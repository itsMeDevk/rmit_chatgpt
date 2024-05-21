from flask import Blueprint, jsonify, request
import boto3
from src.config import CLIENT_ID, CLIENT_SECRET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

################################################################################
# This section handles the revoking refresh token for a user                   #
################################################################################

# Create a Blueprint named 'revoke_token_page'
cognito_revoke_token_bp = Blueprint('revoke_token_page', __name__, url_prefix='/api/auth/revoke-token')

@cognito_revoke_token_bp.route('', methods=['POST'])
def revoke_token():
    """
    Handle token revocation requests.

    Returns:
        JSON response with appropriate status and message.
    """
    data = request.json
    refresh_token = data.get('refresh_token')

    if not refresh_token:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Refresh token is required for token revocation",
            "data": None
        }), 400  # Bad Request

    # Create a session and Cognito client
    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    client = session.client('cognito-idp', region_name=AWS_REGION)  # AWS region

    try:
        # Call the revoke token function to invalidate the refresh token
        resp = client.revoke_token(
            Token=refresh_token,
            ClientId=CLIENT_ID,
            ClientSecret=CLIENT_SECRET
        )

        return jsonify({
            "error": False,
            "success": True,
            "message": "User refresh token revoked successfully",
            "data": None
        }), 200  # OK
    except client.exceptions.NotAuthorizedException:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Refresh token is invalid",
            "data": None
        }), 401  # Unauthorized
    except Exception as e:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Token revocation failed",
            "data": None
        }), 500  # Internal Server Error
    
################################################################################
# This section handles the Logout for a user which revokes all tokens          #
################################################################################

# Create a Blueprint named 'global_sign_out_page'
cognito_global_sign_out_bp = Blueprint('global_sign_out_page', __name__, url_prefix='/api/auth/global-sign-out')

@cognito_global_sign_out_bp.route('', methods=['POST'])
def global_sign_out():
    """
    Handle global sign-out requests.

    Returns:
        JSON response with appropriate status and message.
    """
    data = request.json
    access_token = data.get('access_token')

    if not access_token:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Access token is required for global sign-out",
            "data": None
        }), 400  # Bad Request

    try:
        # Create a session and Cognito client
        session = boto3.Session(
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
        client = session.client('cognito-idp', region_name=AWS_REGION)  # AWS region

        # Call the global sign-out function to invalidate the access token
        resp = client.global_sign_out(
            AccessToken=access_token
        )


        return jsonify({
            "error": False,
            "success": True,
            "message": "User global sign-out successful",
            "data": None
        }), 200  # OK
    except client.exceptions.NotAuthorizedException:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Access token is invalid",
            "data": None
        }), 401  # Unauthorized
    except Exception as e:
        return jsonify({
            "error": True,
            "success": False,
            "message": "Global sign-out failed",
            "data": None
        }), 500  # Internal Server Error
