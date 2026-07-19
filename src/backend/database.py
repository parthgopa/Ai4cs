import os
import base64
import hashlib
import secrets
from datetime import datetime
from cryptography.fernet import Fernet
from pymongo import MongoClient

# MongoDB Client connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo_root:Pp847060@76.13.246.78:27017/?directConnection=true")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "ai4cs")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]
admin_db = db

def init_db():
    try:
        # Create a unique index on the email field for users
        db.users.create_index("email", unique=True)
        print("MongoDB connection established and user index initialized.")
        
        # Create a unique index on the email field for admins
        admin_db.admins.create_index("email", unique=True)
        print("Admin DB index initialized.")
        
        # Initialize default settings if not present
        existing_settings = admin_db.settings.find_one({"key": "config"})
        if not existing_settings:
            admin_db.settings.insert_one({
                "key": "config",
                "model_version": "gemini-3-flash-preview",
                "pricing_input_inr_per_1m": 6.4,   # Default ~6.4 INR per 1M (based on USD pricing)
                "pricing_output_inr_per_1m": 25.5, # Default ~25.5 INR per 1M (based on USD pricing)
                "last_updated": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
            print("Default admin settings initialized.")
            
        # Initialize default model pricing list if empty
        if db.model_pricing.count_documents({}) == 0:
            default_pricing_docs = [
                {"model_name": "gemini-2.5-flash", "input_rate_usd": 0.075, "output_rate_usd": 0.30, "input_rate": 6.375, "output_rate": 25.5, "is_custom": False},
                {"model_name": "gemini-2.5-pro", "input_rate_usd": 1.25, "output_rate_usd": 5.00, "input_rate": 106.25, "output_rate": 425.0, "is_custom": False},
                {"model_name": "gemini-2.0-flash", "input_rate_usd": 0.075, "output_rate_usd": 0.30, "input_rate": 6.375, "output_rate": 25.5, "is_custom": False},
                {"model_name": "gemini-1.5-flash", "input_rate_usd": 0.075, "output_rate_usd": 0.30, "input_rate": 6.375, "output_rate": 25.5, "is_custom": False},
                {"model_name": "gemini-1.5-pro", "input_rate_usd": 1.25, "output_rate_usd": 5.00, "input_rate": 106.25, "output_rate": 425.0, "is_custom": False},
                {"model_name": "gemini-1.5-flash-8b", "input_rate_usd": 0.0375, "output_rate_usd": 0.15, "input_rate": 3.1875, "output_rate": 12.75, "is_custom": False},
                {"model_name": "gemini-3-flash-preview", "input_rate_usd": 0.075, "output_rate_usd": 0.30, "input_rate": 6.375, "output_rate": 25.5, "is_custom": False}
            ]
            db.model_pricing.insert_many(default_pricing_docs)
            print("Default model pricing database collection initialized.")
    except Exception as e:
        print("Error initializing MongoDB database:", e)

# Password Hashing Helper functions
def hash_password(password: str, salt: bytes = None) -> str:
    if salt is None:
        salt = secrets.token_bytes(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex() + ":" + key.hex()

def verify_password(stored_password: str, provided_password: str) -> bool:
    try:
        salt_hex, key_hex = stored_password.split(":")
        salt = bytes.fromhex(salt_hex)
        new_key = hashlib.pbkdf2_hmac('sha256', provided_password.encode(), salt, 100000)
        return new_key.hex() == key_hex
    except Exception:
        return False

# Encryption / Decryption Helper functions for API Keys
def get_fernet():
    secret = "Pp847060#"
    # Derive a valid 32-byte Fernet key from the SECRET_KEY
    key = hashlib.sha256(secret.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))

def encrypt_key(api_key: str) -> str:
    if not api_key:
        return None
    f = get_fernet()
    return f.encrypt(api_key.encode()).decode()

def decrypt_key(encrypted_api_key: str) -> str:
    if not encrypted_api_key:
        return None
    f = get_fernet()
    return f.decrypt(encrypted_api_key.encode()).decode()

def get_gemini_key_for_request(user_email=None):
    byok_using = os.getenv("BYOK_Using", "false").lower() == "true"
    if byok_using and user_email:
        try:
            user = db.users.find_one({"email": user_email.strip().lower(), "is_verified": 1})
            if user and user.get('api_key_encrypted'):
                return decrypt_key(user['api_key_encrypted'])
        except Exception as e:
            print("Error retrieving key for request:", e)
    return os.getenv("GEMINI_API_KEY")

def log_usage(user_email, tool_id, prompt_text, response_text, input_tokens, output_tokens, total_tokens):
    email = (user_email or "anonymous").strip().lower()
    tool = tool_id or "unknown"
    prompt = prompt_text or ""
    response = response_text or ""
    i_tokens = int(input_tokens or 0)
    o_tokens = int(output_tokens or 0)
    t_tokens = int(total_tokens or 0)
    
    user_id = None
    if email != "anonymous":
        try:
            user = db.users.find_one({"email": email})
            if user:
                user_id = user["_id"]
        except Exception as e:
            print("Error resolving user _id for usage log:", e)

    try:
        db.usage_logs.insert_one({
            "user_id": user_id,
            "email": email,
            "tool_id": tool,
            "prompt": prompt,
            "response": response,
            "input_tokens": i_tokens,
            "output_tokens": o_tokens,
            "total_tokens": t_tokens,
            "timestamp": datetime.now()
        })
        print(f"Logged usage for {email} (ID: {user_id}) on tool {tool} ({t_tokens} tokens)")
    except Exception as e:
        print("Error logging usage to MongoDB:", e)

def get_active_model_config():
    try:
        config = admin_db.settings.find_one({"key": "config"})
        if config:
            return {
                "model_version": config.get("model_version", "gemini-3-flash-preview"),
                "pricing_input_inr_per_1m": float(config.get("pricing_input_inr_per_1m", 6.4)),
                "pricing_output_inr_per_1m": float(config.get("pricing_output_inr_per_1m", 25.5))
            }
    except Exception as e:
        print("Error retrieving model config:", e)
    
    # Fallback default configuration
    return {
        "model_version": "gemini-3-flash-preview",
        "pricing_input_inr_per_1m": 6.4,
        "pricing_output_inr_per_1m": 25.5
    }
