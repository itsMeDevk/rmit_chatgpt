from flask import Flask, request, Blueprint, jsonify
import boto3
from src.config import CLIENT_ID, AWS_REGION, PASSWORD_RESET_REQUIRED, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
from src.functions.hashing import get_secret_hash
from src.functions.auth import initiate_auth, get_refresh_token


################################################################################
# This section handles the Login and Refresh Token for a use                   #
################################################################################

# Create a Blueprint named 'login_page' with the given name
cognito_login_bp = Blueprint('login_page', __name__, url_prefix='/api/auth/login')

@cognito_login_bp.route('', methods=['POST'])
def login():
    """
    Handle user login requests and token refresh requests.

    Returns:
        JSON response with appropriate status and message.
    """
    data = request.json
    username = data.get('username')
    password = data.get('password')
    refresh_token = data.get('refresh_token')  # Add refresh_token field to the request data

    # Requires Username AND Refresh_token OR Password for items to work
    if not (username and (refresh_token or password)):
        # If username is missing or both refresh_token and password are missing, return a 400 Bad Request
        return jsonify({
            "error": True,
            "success": False,
            "message": "Provide a username and either a refresh token or a password",
            "data": None
        }), 400  # Bad Request

    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    client = session.client('cognito-idp', region_name=AWS_REGION)  # AWS region

    if refresh_token:
        # Handle token refresh request
        refresh_status, refresh_result = get_refresh_token(client, refresh_token, username)

        if refresh_status == "Refreshed":
            # Tokens are successfully refreshed
            return jsonify({
                "error": False,
                "success": True,
                "message": "Token refreshed successfully",
                "data": {
                    "id_token": refresh_result["IdToken"],
                    "access_token": refresh_result["AccessToken"],
                    "expires_in": refresh_result["ExpiresIn"],
                    "token_type": refresh_result["TokenType"]
                }
            }), 200  # OK
        else:
            # Token refresh failed
            return jsonify({
                "error": True,
                "success": False,
                "message": "Token refresh failed",
                "data": None
            }), 401  # Unauthorized

    elif username and password:
        # Handle regular login request
        auth_status, auth_result = initiate_auth(client, username, password)

        if  'Password reset required for the user' in auth_result:
            return jsonify({
                "error": True,
                "success": False,
                "message": "Password reset required",
                "data": {
                    "secondary": PASSWORD_RESET_REQUIRED
                }
            }), 401  # Unauthorized

        elif auth_status == "ChangePasswordRequired":
            return jsonify({
                "error": True,
                "success": False,
                "message": "Change password required",
                "data": {
                    "session": auth_result  # Pass the session for the challenge
                }
            }), 401  # Unauthorized

        if auth_status == "Authenticated":
            # User is successfully authenticated, return tokens or perform other actions
            return jsonify({
                "error": False,
                "success": True,
                "message": "Login successful",
                "data": {
                    "id_token": auth_result["IdToken"],
                    "refresh_token": auth_result["RefreshToken"],
                    "access_token": auth_result["AccessToken"],
                    "expires_in": auth_result["ExpiresIn"],
                    "token_type": auth_result["TokenType"]
                }
            }), 200  # OK

        if auth_status == "UserNotConfirmed":
            return jsonify({
                "error": True,
                "success": False,
                "message": "User is not confirmed",
                "data": None
            }), 403  # Forbidden

        return jsonify({
            "error": True,
            "success": False,
            "message": "Authentication failed",
            "data": None
        }), 401  # Unauthorized

    else:
        # If neither refresh_token nor username/password is provided, return a 400 Bad Request
        return jsonify({
            "error": True,
            "success": False,
            "message": "Provide either a refresh token or username/password",
            "data": None
        }), 400  # Bad Request


################################################################################
# This section handles the NEW_PASSWORD_CHALLENGE for a user added by an admin #
################################################################################

cognito_complete_password_reset_bp = Blueprint('change_pass', __name__, url_prefix='/api/auth/complete-password-reset')

@cognito_complete_password_reset_bp.route('', methods=['POST'])
def complete_password_reset():
    """
    Handle the completion of the password reset process.

    Returns:
        JSON response with appropriate status and message.
    """
    data = request.json
    session = data.get('session')
    new_password = data.get('new_password')
    username = data.get('username')

    if not session or not new_password:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Both session and new_password are required",
            "data": None
        }), 400  # Bad Request

    client = boto3.client('cognito-idp', region_name=AWS_REGION)

    try:
        # Complete the "new_password_required" challenge
        response = client.respond_to_auth_challenge(
            ClientId=CLIENT_ID ,
            ChallengeName='NEW_PASSWORD_REQUIRED',
            ChallengeResponses={
                'USERNAME': username,
                'NEW_PASSWORD': new_password,
                'SECRET_HASH': get_secret_hash(username)
            },
            Session=session
        )

        return jsonify({
            "error": False,
            "success": True,
            "message": "Password change successful",
            "data": None
        }), 200  # OK

    except client.exceptions.NotAuthorizedException:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Not authorized to complete password reset",
            "data": None
        }), 401  # Unauthorized
    except Exception as e:
        return jsonify({
            "error": True,
            "success": False,
            "message": f"Password reset failed: {str(e)}",
            "data": None
        }), 500  # Internal Server Error
