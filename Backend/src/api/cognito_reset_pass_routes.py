import boto3
from flask import Flask, request, jsonify, Blueprint
from src.config import CLIENT_ID, AWS_REGION
from src.functions.hashing import get_secret_hash

################################################################################
# This section handles user forgot password. Requires certain IAM not working atm #
################################################################################

# Create a Blueprint named 'forgot_password' with the given name
cognito_forgot_password_bp = Blueprint('forgot_password', __name__, url_prefix='/api/auth/forgot-password')

@cognito_forgot_password_bp.route('', methods=['POST'])
def forgot_password():
    """
    Initiate the forgot password process.

    Returns:
        JSON response with appropriate status and message.
    """
    data = request.json
    username = data.get('username')

    if not username:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Username is required",
            "data": None
        }), 400  # Bad Request

    client = boto3.client('cognito-idp', region_name=AWS_REGION)

    try:
        response = client.forgot_password(
            ClientId=CLIENT_ID,
            Username=username,
        )

        return jsonify({
            "error": False,
            "success": True,
            "message": "Forgot password process initiated",
            "data": {
                "CodeDeliveryDetails": response.get("CodeDeliveryDetails")
            }
        }), 200  # OK

    except client.exceptions.UserNotFoundException:
        return jsonify({
            "error": True,
            "success": False,
            "message": "User not found",
            "data": None
        }), 404  # Not Found
    except client.exceptions.NotAuthorizedException:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Not authorized to initiate the forgot password process",
            "data": None
        }), 403  # Forbidden
    except Exception as e:
        return jsonify({
            "error": True,
            "success": False,
            "message": f"Failed to initiate forgot password process: {str(e)}",
            "data": None
        }), 500  # Internal Server Error

########################################################################################
# This section handles password change given they have a token. need specific iam role #
########################################################################################

def change_password(client, username, current_password, new_password):
    """
    Change a user's password in AWS Cognito User Pool.

    Args:
        client: Boto3 Cognito client.
        username (str): User's username.
        current_password (str): User's current password.
        new_password (str): User's new password.

    Returns:
        tuple: A tuple containing the status and an error message if applicable.
            The status can be 'PasswordChanged', 'AuthenticationFailed', or 'Error'.
    """
    try:
        resp = client.change_password(
            PreviousPassword=current_password,
            ProposedPassword=new_password,
            AccessToken=username  # Use the username as the AccessToken
        )
        return "PasswordChanged", None
    except client.exceptions.NotAuthorizedException:
        return "AuthenticationFailed", "Current password is incorrect"
    except Exception as e:
        return "Error", str(e)

# Create a Blueprint named 'change_password_page' with the given name
cognito_change_pass_bp = Blueprint('change_password_page', __name__, url_prefix='/api/auth/change-password')

@cognito_change_pass_bp.route('', methods=['POST'])
def change_user_password():
    """
    Handle changing a user's password.

    Returns:
        JSON response with appropriate status and message.
    """
    data = request.json
    username = data.get('username')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not username or not current_password or not new_password:
        # Return a Bad Request response if required fields are missing
        return jsonify({
            "error": True,
            "success": False,
            "message": "Username, current password, and new password are required",
            "data": None
        }), 400  # Bad Request

    client = boto3.client('cognito-idp', region_name=AWS_REGION)

    change_status, error_message = change_password(client, username, current_password, new_password)

    if change_status == "PasswordChanged":
        # Return a success response with HTTP status code 200
        return jsonify({
            "error": False,
            "success": True,
            "message": "Password changed successfully",
            "data": None
        }), 200  # OK

    if change_status == "AuthenticationFailed":
        # Return an unauthorized response with HTTP status code 401
        return jsonify({
            "error": True,
            "success": False,
            "message": error_message,
            "data": None
        }), 401  # Unauthorized

    # Return an internal server error response with HTTP status code 500 if there's an unknown error
    return jsonify({
        "error": True,
        "success": False,
        "message": "Password change failed",
        "data": None
    }), 500  # Internal Server Error

####################################################################################
# This section handles password change given an admin set off password reset       #
# This would of sent a token to thee users e-mail address which they need to reset #
####################################################################################

def reset_password(client, username, new_password, confirmation_code):
    try:

        # Reset the user's password with the confirmation code
        response = client.confirm_forgot_password(
            ClientId=CLIENT_ID,
            Username=username,
            Password=new_password,
            ConfirmationCode=confirmation_code,
            SecretHash=get_secret_hash(username)  # Include SECRET_HASH
        )

        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            return "PasswordChanged", None
        else:
            return "PasswordChangeFailed", "Failed to change password"
    except client.exceptions.UserNotFoundException:
        return "UserNotFound", "User not found"
    except client.exceptions.CodeMismatchException:
        return "CodeMismatch", "Confirmation code is incorrect"
    except Exception as e:
        return "Error", str(e)

# Create a Blueprint named 'reset_password_page'
cognito_reset_pass_bp = Blueprint('reset_password_page', __name__, url_prefix='/api/auth/reset-password')

@cognito_reset_pass_bp.route('', methods=['POST'])
def reset_user_password():
    data = request.json
    username = data.get('username')
    new_password = data.get('new_password')
    confirmation_code = data.get('confirmation_code')

    if not username or not new_password or not confirmation_code:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Username, new password, and confirmation code are required",
            "data": None
        }), 400  # Bad Request
    
    # Initialize the Cognito client
    client = boto3.client('cognito-idp', region_name=AWS_REGION)
    reset_status, error_message = reset_password(client, username, new_password, confirmation_code)

    if reset_status == "PasswordChanged":
        return jsonify({
            "error": False,
            "success": True,
            "message": "Password changed successfully",
            "data": None
        }), 200  # OK

    if reset_status == "UserNotFound":
        return jsonify({
            "error": True,
            "success": False,
            "message": error_message,
            "data": None
        }), 404  # Not Found

    if reset_status == "CodeMismatch":
        return jsonify({
            "error": True,
            "success": False,
            "message": error_message,
            "data": None
        }), 400  # Bad Request

    return jsonify({
        "error": True,
        "success": False,
        "message": error_message,
        "data": None
    }), 500  # Internal Server Error

