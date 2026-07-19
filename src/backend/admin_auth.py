from flask import Blueprint, request, jsonify
import random
from datetime import datetime, timedelta
import os
from database import (
    admin_db,
    hash_password,
    verify_password
)
from email_utils import send_admin_otp_email

admin_auth_bp = Blueprint('admin_auth', __name__)

@admin_auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        secret_key = data.get('secret_key', '').strip()

        if not email or not password or not secret_key:
            return jsonify({"error": "Email, password, and secret key are required"}), 400

        # Validate admin signup secret
        required_secret = os.getenv("ADMIN_SIGNUP_SECRET", "AI4CS-ADMIN")
        if secret_key != required_secret:
            return jsonify({"error": "Invalid admin signup secret key"}), 403

        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))
        otp_expiry = (datetime.now() + timedelta(minutes=10)).strftime('%Y-%m-%d %H:%M:%S')
        hashed_pwd = hash_password(password)

        # Check if admin already exists
        admin = admin_db.admins.find_one({"email": email})

        if admin:
            if admin.get('is_verified') == 1:
                return jsonify({"error": "An admin account with this email already exists"}), 400
            else:
                # Update unverified admin
                admin_db.admins.update_one(
                    {"email": email},
                    {"$set": {
                        "password_hash": hashed_pwd,
                        "otp": otp,
                        "otp_expiry": otp_expiry
                    }}
                )
        else:
            # Create a new unverified admin
            admin_db.admins.insert_one({
                "email": email,
                "password_hash": hashed_pwd,
                "otp": otp,
                "otp_expiry": otp_expiry,
                "is_verified": 0,
                "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })

        # Send OTP email
        if send_admin_otp_email(email, otp):
            return jsonify({"message": "Admin verification OTP sent to your email"}), 200
        else:
            return jsonify({"error": "Failed to send verification email. Please check your email address."}), 500

    except Exception as e:
        print("Admin signup error:", e)
        return jsonify({"error": "Internal server error during admin signup"}), 500

@admin_auth_bp.route('/verify-otp', methods=['POST', 'OPTIONS'])
def verify_otp():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email', '').strip().lower()
        otp_submitted = data.get('otp', '').strip()

        if not email or not otp_submitted:
            return jsonify({"error": "Email and OTP are required"}), 400

        admin = admin_db.admins.find_one({"email": email})

        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        stored_otp = admin.get('otp')
        stored_expiry_str = admin.get('otp_expiry')
        
        if not stored_otp or not stored_expiry_str:
            return jsonify({"error": "No OTP verification request active"}), 400

        stored_expiry = datetime.strptime(stored_expiry_str, '%Y-%m-%d %H:%M:%S')
        if datetime.now() > stored_expiry:
            return jsonify({"error": "OTP has expired. Please sign up again."}), 400

        if stored_otp != otp_submitted:
            return jsonify({"error": "Invalid OTP code"}), 400

        # Mark admin as verified
        admin_db.admins.update_one(
            {"email": email},
            {"$set": {
                "is_verified": 1,
                "otp": None,
                "otp_expiry": None
            }}
        )

        return jsonify({
            "message": "Admin account verified successfully!",
            "email": email
        }), 200

    except Exception as e:
        print("Admin OTP verification error:", e)
        return jsonify({"error": "Internal server error during admin verification"}), 500

@admin_auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        admin = admin_db.admins.find_one({"email": email})

        if not admin:
            return jsonify({"error": "Invalid email or password"}), 401

        if admin.get('is_verified') != 1:
            return jsonify({"error": "Please complete email verification first"}), 401

        if not verify_password(admin.get('password_hash'), password):
            return jsonify({"error": "Invalid email or password"}), 401

        return jsonify({
            "message": "Admin login successful",
            "email": email
        }), 200

    except Exception as e:
        print("Admin login error:", e)
        return jsonify({"error": "Internal server error during admin login"}), 500

@admin_auth_bp.route('/status', methods=['GET', 'POST', 'OPTIONS'])
def status():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    email = request.headers.get("X-Admin-Email", "").strip().lower()
    
    if not email:
        return jsonify({"is_logged_in": False}), 200

    try:
        admin = admin_db.admins.find_one({"email": email, "is_verified": 1})

        if not admin:
            return jsonify({"is_logged_in": False}), 200

        return jsonify({
            "is_logged_in": True,
            "email": email
        }), 200
    except Exception as e:
        print("Admin status check error:", e)
        return jsonify({"error": "Internal server error check status"}), 500
