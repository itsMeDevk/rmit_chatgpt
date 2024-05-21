from flask import Flask
from flask_cognito import CognitoAuth
from flask_cors import CORS
from src.config import AWS_REGION, CLIENT_ID, CLIENT_SECRET, USER_POOL_ID


# Create a CognitoAuth object
cognito = CognitoAuth()

def create_app():

    application = Flask(__name__)
    CORS(application, support_credentials=True)

    # Configure Flask-Cognito
    application.config['COGNITO_REGION'] = AWS_REGION
    application.config['COGNITO_USERPOOL_ID'] = USER_POOL_ID
    application.config['COGNITO_APP_CLIENT_ID'] = CLIENT_ID
    application.config['COGNITO_APP_CLIENT_SECRET'] = CLIENT_SECRET

    cognito.init_app(application)


    from .api.cognito_login_routes import cognito_login_bp, cognito_complete_password_reset_bp
    from .api.cognito_reset_pass_routes import cognito_forgot_password_bp, cognito_change_pass_bp, cognito_reset_pass_bp
    from .api.cognito_logout_routes import cognito_revoke_token_bp, cognito_global_sign_out_bp
    from .api.competitor_ads_routes import comp_ads_bp
    from .api.chat_gpt_ad_routes import chat_gpt_ad_bp, start_campaign_bp, get_ad_campaign_bp

    # Login
    application.register_blueprint(cognito_login_bp)
    application.register_blueprint(cognito_complete_password_reset_bp)

    # Change Password
    application.register_blueprint(cognito_forgot_password_bp)
    application.register_blueprint(cognito_change_pass_bp)
    application.register_blueprint(cognito_reset_pass_bp)

    # Log Out
    application.register_blueprint(cognito_revoke_token_bp)
    application.register_blueprint(cognito_global_sign_out_bp)

    # campaigns API
    application.register_blueprint(comp_ads_bp)
    application.register_blueprint(chat_gpt_ad_bp)
    application.register_blueprint(start_campaign_bp)
    application.register_blueprint(get_ad_campaign_bp)

    return application
