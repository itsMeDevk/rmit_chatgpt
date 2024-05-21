from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from src.functions.auth import cognito_valid_token_required

# Create a Blueprint named 'main_page'
main_page_bp = Blueprint('main_page', __name__, url_prefix='/api/main_page')

# Define your main_page route
@main_page_bp.route('', methods=['POST'])
@cross_origin()
@cognito_valid_token_required
def get_main_page():
    """
    Handle requests to the main page.

    Returns:
        JSON response based on access token validation.
    """
    return jsonify({
        "error": False,
        "success": True,
        "message": "Welcome to the main page",
        "data": None
    }), 200  # OK
