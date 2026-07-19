from flask import Blueprint, request, jsonify
import random
from datetime import datetime, timedelta
import os
from database import (
    db,
    hash_password,
    verify_password,
    encrypt_key,
    decrypt_key
)
from email_utils import send_otp_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))
        otp_expiry = (datetime.now() + timedelta(minutes=10)).strftime('%Y-%m-%d %H:%M:%S')
        hashed_pwd = hash_password(password)

        # Check if user already exists
        user = db.users.find_one({"email": email})

        if user:
            if user.get('is_verified') == 1:
                return jsonify({"error": "An account with this email already exists"}), 400
            else:
                # Update unverified user with new password and OTP
                db.users.update_one(
                    {"email": email},
                    {"$set": {
                        "password_hash": hashed_pwd,
                        "otp": otp,
                        "otp_expiry": otp_expiry
                    }}
                )
        else:
            # Create a new unverified user
            db.users.insert_one({
                "email": email,
                "password_hash": hashed_pwd,
                "otp": otp,
                "otp_expiry": otp_expiry,
                "is_verified": 0,
                "api_key_raw": None,
                "api_key_encrypted": None,
                "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })

        # Send OTP email
        if send_otp_email(email, otp):
            return jsonify({"message": "Verification OTP sent to your email"}), 200
        else:
            return jsonify({"error": "Failed to send verification email. Please check the email address."}), 500

    except Exception as e:
        print("Signup error:", e)
        return jsonify({"error": "Internal server error during signup"}), 500

@auth_bp.route('/verify-otp', methods=['POST', 'OPTIONS'])
def verify_otp():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email', '').strip().lower()
        otp_submitted = data.get('otp', '').strip()

        if not email or not otp_submitted:
            return jsonify({"error": "Email and OTP are required"}), 400

        user = db.users.find_one({"email": email})

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Validate OTP and expiry
        stored_otp = user.get('otp')
        stored_expiry_str = user.get('otp_expiry')
        
        if not stored_otp or not stored_expiry_str:
            return jsonify({"error": "No OTP verification request active"}), 400

        stored_expiry = datetime.strptime(stored_expiry_str, '%Y-%m-%d %H:%M:%S')
        if datetime.now() > stored_expiry:
            return jsonify({"error": "OTP has expired. Please sign up again."}), 400

        if stored_otp != otp_submitted:
            return jsonify({"error": "Invalid OTP code"}), 400

        # Mark user as verified
        db.users.update_one(
            {"email": email},
            {"$set": {
                "is_verified": 1,
                "otp": None,
                "otp_expiry": None
            }}
        )

        byok_using = os.getenv("BYOK_Using", "false").lower() == "true"
        return jsonify({
            "message": "Email verified successfully!",
            "email": email,
            "byok_enabled": byok_using,
            "has_key": False
        }), 200

    except Exception as e:
        print("OTP verification error:", e)
        return jsonify({"error": "Internal server error during OTP verification"}), 500

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = db.users.find_one({"email": email})

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if user.get('is_verified') != 1:
            return jsonify({"error": "Please complete email verification first"}), 401

        if not verify_password(user.get('password_hash'), password):
            return jsonify({"error": "Invalid email or password"}), 401

        byok_using = os.getenv("BYOK_Using", "false").lower() == "true"
        has_key = user.get('api_key_encrypted') is not None
        raw_key = user.get('api_key_raw', '')

        return jsonify({
            "message": "Login successful",
            "email": email,
            "byok_enabled": byok_using,
            "has_key": has_key,
            "api_key": raw_key
        }), 200

    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": "Internal server error during login"}), 500

@auth_bp.route('/save-key', methods=['POST', 'OPTIONS'])
def save_key():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        email = request.headers.get("X-User-Email", "").strip().lower()
        if not email:
            # Fallback to post body if not in header
            data = request.get_json(silent=True) or {}
            email = data.get('email', '').strip().lower()

        data = request.get_json(silent=True) or {}
        api_key = data.get('api_key', '').strip()

        if not email:
            return jsonify({"error": "Authorization/User Email is required"}), 401
        
        if not api_key:
            return jsonify({"error": "Gemini API key is required"}), 400

        # Validate that it looks like a Gemini key (typically starts with AIzaSy)
        if not api_key.startswith("AIzaSy"):
            return jsonify({"error": "Invalid Gemini API Key format (must start with 'AIzaSy')"}), 400

        # Validate the API key with a test call to Gemini
        try:
            from google import genai
            test_client = genai.Client(api_key=api_key)
            test_client.models.generate_content(
                model="gemini-2.5-flash",
                contents="ping"
            )
        except Exception as e:
            print("Gemini API key verification failed:", e)
            return jsonify({
                "error": "Authentication failed with Gemini. Please make sure the API key is correct and active."
            }), 400

        # Encrypt the key
        encrypted_key = encrypt_key(api_key)

        # Check if user exists
        user = db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Save key
        db.users.update_one(
            {"email": email},
            {"$set": {
                "api_key_raw": api_key,
                "api_key_encrypted": encrypted_key
            }}
        )

        return jsonify({
            "message": "Gemini API Key saved successfully",
            "has_key": True
        }), 200

    except Exception as e:
        print("Save key error:", e)
        return jsonify({"error": "Internal server error during key registration"}), 500

@auth_bp.route('/status', methods=['GET', 'POST', 'OPTIONS'])
def status():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    email = request.headers.get("X-User-Email", "").strip().lower()
    byok_using = os.getenv("BYOK_Using", "false").lower() == "true"
    
    if not email:
        return jsonify({
            "is_logged_in": False,
            "byok_enabled": byok_using
        }), 200

    try:
        user = db.users.find_one({"email": email, "is_verified": 1})

        if not user:
            return jsonify({
                "is_logged_in": False,
                "byok_enabled": byok_using
            }), 200

        has_key = user.get('api_key_encrypted') is not None
        raw_key = user.get('api_key_raw', '')
        return jsonify({
            "is_logged_in": True,
            "email": email,
            "byok_enabled": byok_using,
            "has_key": has_key,
            "api_key": raw_key
        }), 200
    except Exception as e:
        print("Status error:", e)
        return jsonify({"error": "Internal server error check status"}), 500
