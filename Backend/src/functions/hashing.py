import hmac
import hashlib
import base64
from src.config import CLIENT_ID, CLIENT_SECRET

# Requires username for secret hashing
def get_secret_hash(username):

    message = bytes(username + CLIENT_ID, 'utf-8')
    secret = bytes(CLIENT_SECRET, 'utf-8')

    # Calculate the HMAC-SHA256 hash of the message using the client secret
    secret_hash = hmac.new(secret, message, hashlib.sha256).digest()
    secret_hash = base64.b64encode(secret_hash).decode()

    return secret_hash
