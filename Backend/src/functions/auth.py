from src.config import CLIENT_ID, USER_POOL_ID, AWS_REGION
from src.functions.hashing import get_secret_hash
import boto3
from functools import wraps
from flask import request, jsonify

def initiate_auth(client, username, password):
    """
    Initiates user authentication in the Cognito User Pool.

    Args:
        client: Boto3 Cognito client.
        username (str): User's username.
        password (str): User's password.

    Returns:
        tuple: A tuple containing the status and authentication result.
            The status can be 'Authenticated', 'ChangePasswordRequired', 'UserNotConfirmed', or 'Error'.
            The authentication result is a dictionary containing user tokens.

    Raises:
        Exception: If any other error occurs.
    """
    try:
        resp = client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password,
                'SECRET_HASH': get_secret_hash(username)
            },
            ClientId=CLIENT_ID 
        )
        if 'AuthenticationResult' in resp:
            # User is successfully authenticated
            return "Authenticated", resp['AuthenticationResult']
        elif 'ChallengeName' in resp and resp['ChallengeName'] == 'NEW_PASSWORD_REQUIRED':
            # User needs to change their password
            return "ChangePasswordRequired", resp['Session']  # Pass the session to respond to the challenge
        else:
            return "AuthenticationFailed", None

    except client.exceptions.NotAuthorizedException:
        return "AuthenticationFailed", None
    except client.exceptions.UserNotConfirmedException:
        return "UserNotConfirmed", None
    except Exception as e:
        return "Error", str(e)
    
def get_refresh_token(client, refresh_token, username):
    """
    Refreshes the access token and ID token using a valid refresh token.

    Args:
        client: Boto3 Cognito client.
        refresh_token (str): User's refresh token.

    Returns:
        tuple: A tuple containing the status and refreshed authentication result.
            The status can be 'Refreshed', 'Error', or 'AuthenticationFailed'.
            The refreshed authentication result is a dictionary containing user tokens.

    Raises:
        Exception: If any other error occurs.
    """
    try:
        resp = client.initiate_auth(
            AuthFlow='REFRESH_TOKEN_AUTH',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token,
                'SECRET_HASH': get_secret_hash(get_user_uid_by_email(client, username))
            },
            ClientId=CLIENT_ID 
        )
        if 'AuthenticationResult' in resp:
            # Tokens are successfully refreshed
            return "Refreshed", resp['AuthenticationResult']
        else:
            return "AuthenticationFailed", None

    except client.exceptions.NotAuthorizedException:
        return "AuthenticationFailed", None
    except Exception as e:
        return "Error", str(e)
    

def get_user_uid_by_email(client, user_email):
    """
    Get the UID (Username) of a user in an Amazon Cognito User Pool using their email address.

    Args:
        client: Boto3 Cognito client.
        user_pool_id (str): User Pool ID.
        user_email (str): User's email address.

    Returns:
        str: The user's UID (Username) if found, or None if no user matches the email.
    """
    try:
        response = client.list_users(
            UserPoolId=USER_POOL_ID,
            Filter=f'email="{user_email}"'
        )

        # Check if any users match the provided email
        if len(response['Users']) > 0:
            user = response['Users'][0]
            user_uid = user['Username']  # This is the UID
            return user_uid
        else:
            return None
    except Exception as e:
       print(f"Error: {str(e)}")
       return None



def is_cognito_access_token_valid(access_token):
    """
    Check if a Cognito User Pool access token is valid by calling the getUser API.

    Args:
        access_token (str): The Cognito User Pool access token to validate.

    Returns:
        bool: True if the access token is valid, False otherwise.

    Raises:
        Exception: If any error occurs during the validation process.
    """
    try:
        # Initialize a Cognito Identity Provider client
        client = boto3.client('cognito-idp', region_name=AWS_REGION)  # Replace 'YOUR_REGION' with your AWS region

        # Call the getUser API with the access token
        response = client.get_user(AccessToken=access_token)

        # If the API call is successful, the token is valid
        return True
    except client.exceptions.NotAuthorizedException:
        # The token is not valid or has been revoked
        return False
    except Exception as e:
        # Other errors may occur
        print(f"Error: {str(e)}")
        return False

def cognito_valid_token_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        access_token = request.headers.get('Authorization', '').split(' ')[1]

        if is_cognito_access_token_valid(access_token):
            return func(*args, **kwargs)
        else:
            return jsonify({
                "error": True,
                "success": False,
                "message": "Access token is invalid or session-disabled",
                "data": None
            }), 401  # Unauthorized

    return decorated_function