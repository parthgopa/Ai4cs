from flask import Blueprint, request, jsonify
import os
from datetime import datetime
from database import db, admin_db, decrypt_key

admin_portal_bp = Blueprint('admin_portal', __name__)

def verify_admin_session():
    """Helper to check if caller is an authorized admin"""
    email = request.headers.get("X-Admin-Email", "").strip().lower()
    if not email:
        return False
    admin = admin_db.admins.find_one({"email": email, "is_verified": 1})
    return admin is not None

@admin_portal_bp.route('/users', methods=['GET', 'OPTIONS'])
def get_users():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if not verify_admin_session():
        return jsonify({"error": "Unauthorized admin access"}), 401

    try:
        users = list(db.users.find({}, {
            "password_hash": 0,
            "otp": 0,
            "otp_expiry": 0
        }))

        # Transform ObjectId to string and compute has_key
        for user in users:
            user["_id"] = str(user["_id"])
            user["has_key"] = (user.get("api_key_encrypted") is not None) or (user.get("api_key_raw") is not None)
            
            # Resolve decrypted key
            raw_key = user.get("api_key_raw")
            if not raw_key and user.get("api_key_encrypted"):
                try:
                    raw_key = decrypt_key(user["api_key_encrypted"])
                except Exception as e:
                    print(f"Failed to decrypt api key for user {user.get('email')}: {e}")
            user["api_key"] = raw_key or ""
            
            # Strip key values from payload for safety
            user.pop("api_key_raw", None)
            user.pop("api_key_encrypted", None)

        return jsonify({"users": users}), 200
    except Exception as e:
        print("Admin get users error:", e)
        return jsonify({"error": "Failed to fetch users list"}), 500

@admin_portal_bp.route('/activities', methods=['GET', 'OPTIONS'])
def get_activities():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if not verify_admin_session():
        return jsonify({"error": "Unauthorized admin access"}), 401

    try:
        logs = list(db.usage_logs.find().sort("timestamp", -1).limit(100))

        # Format ObjectIds and timestamps for frontend
        for log in logs:
            log["_id"] = str(log["_id"])
            if log.get("user_id"):
                log["user_id"] = str(log["user_id"])
            if isinstance(log.get("timestamp"), datetime):
                log["timestamp"] = log["timestamp"].strftime('%Y-%m-%d %H:%M:%S')

        return jsonify({"activities": logs}), 200
    except Exception as e:
        print("Admin get activities error:", e)
        return jsonify({"error": "Failed to fetch activity logs"}), 500

@admin_portal_bp.route('/stats', methods=['GET', 'OPTIONS'])
def get_stats():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if not verify_admin_session():
        return jsonify({"error": "Unauthorized admin access"}), 401

    try:
        # Load pricing configuration
        settings = admin_db.settings.find_one({"key": "config"}) or {}
        input_rate = float(settings.get("pricing_input_inr_per_1m", 6.4))
        output_rate = float(settings.get("pricing_output_inr_per_1m", 25.5))
        model_version = settings.get("model_version", "gemini-3-flash-preview")

        # Aggregate tokens by user
        pipeline = [
            {
                "$group": {
                    "_id": "$email",
                    "total_input_tokens": {"$sum": "$input_tokens"},
                    "total_output_tokens": {"$sum": "$output_tokens"},
                    "total_tokens": {"$sum": "$total_tokens"},
                    "activity_count": {"$sum": 1}
                }
            }
        ]
        user_stats = list(db.usage_logs.aggregate(pipeline))

        global_totals = {
            "total_users": db.users.count_documents({}),
            "verified_users": db.users.count_documents({"is_verified": 1}),
            "total_input_tokens": 0,
            "total_output_tokens": 0,
            "total_tokens": 0,
            "total_cost_inr": 0.0,
            "total_activities": 0
        }

        # Calculate costs per user and add to global totals
        stats_list = []
        for stat in user_stats:
            email = stat["_id"]
            i_tokens = stat["total_input_tokens"]
            o_tokens = stat["total_output_tokens"]
            t_tokens = stat["total_tokens"]
            act_count = stat["activity_count"]

            cost = (i_tokens * input_rate / 1000000.0) + (o_tokens * output_rate / 1000000.0)

            stats_list.append({
                "email": email,
                "input_tokens": i_tokens,
                "output_tokens": o_tokens,
                "total_tokens": t_tokens,
                "activity_count": act_count,
                "cost_inr": round(cost, 4)
            })

            global_totals["total_input_tokens"] += i_tokens
            global_totals["total_output_tokens"] += o_tokens
            global_totals["total_tokens"] += t_tokens
            global_totals["total_cost_inr"] += cost
            global_totals["total_activities"] += act_count

        global_totals["total_cost_inr"] = round(global_totals["total_cost_inr"], 4)

        return jsonify({
            "model_version": model_version,
            "pricing_input_inr_per_1m": input_rate,
            "pricing_output_inr_per_1m": output_rate,
            "user_stats": stats_list,
            "totals": global_totals
        }), 200
    except Exception as e:
        print("Admin get stats error:", e)
        return jsonify({"error": "Failed to calculate usage statistics"}), 500

@admin_portal_bp.route('/settings', methods=['GET', 'POST', 'OPTIONS'])
def get_set_settings():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if not verify_admin_session():
        return jsonify({"error": "Unauthorized admin access"}), 401

    if request.method == 'GET':
        try:
            config = admin_db.settings.find_one({"key": "config"}) or {}
            return jsonify({
                "model_version": config.get("model_version", "gemini-3-flash-preview"),
                "pricing_input_inr_per_1m": float(config.get("pricing_input_inr_per_1m", 6.4)),
                "pricing_output_inr_per_1m": float(config.get("pricing_output_inr_per_1m", 25.5))
            }), 200
        except Exception as e:
            print("Admin get settings error:", e)
            return jsonify({"error": "Failed to load admin settings"}), 500

    elif request.method == 'POST':
        try:
            data = request.get_json(silent=True) or {}
            model_version = data.get("model_version", "").strip()
            pricing_input = data.get("pricing_input_inr_per_1m")
            pricing_output = data.get("pricing_output_inr_per_1m")

            if not model_version or pricing_input is None or pricing_output is None:
                return jsonify({"error": "Model version and both pricing rates are required"}), 400

            # Save active settings config
            admin_db.settings.update_one(
                {"key": "config"},
                {"$set": {
                    "model_version": model_version,
                    "pricing_input_inr_per_1m": float(pricing_input),
                    "pricing_output_inr_per_1m": float(pricing_output),
                    "last_updated": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }},
                upsert=True
            )

            # Update pricing details in model_pricing collection and mark as is_custom=True
            db.model_pricing.update_one(
                {"model_name": model_version},
                {"$set": {
                    "input_rate": float(pricing_input),
                    "output_rate": float(pricing_output),
                    "is_custom": True
                }},
                upsert=True
            )

            return jsonify({"message": "Settings updated successfully"}), 200
        except Exception as e:
            print("Admin update settings error:", e)
            return jsonify({"error": "Failed to save admin settings"}), 500

# Live Currency Exchange Rate Helpers
def get_live_exchange_rate_usd_to_inr():
    import requests
    try:
        response = requests.get("https://open.er-api.com/v6/latest/USD", timeout=5)
        if response.status_code == 200:
            data = response.json()
            rate = data.get("rates", {}).get("INR")
            if rate:
                return float(rate)
    except Exception as e:
        print("Failed to fetch live exchange rate, using fallback:", e)
    return 85.0  # Fallback

# Fixed baseline USD prices from Gemini documentation (per 1 Million tokens)
MODEL_PRICING_USD = {
    "gemini-2.5-flash": {"input": 0.075, "output": 0.30},
    "gemini-2.5-pro": {"input": 1.25, "output": 5.00},
    "gemini-2.0-flash": {"input": 0.075, "output": 0.30},
    "gemini-1.5-flash": {"input": 0.075, "output": 0.30},
    "gemini-1.5-pro": {"input": 1.25, "output": 5.00},
    "gemini-1.5-flash-8b": {"input": 0.0375, "output": 0.15},
    "gemini-3-flash-preview": {"input": 0.075, "output": 0.30}
}

@admin_portal_bp.route('/models', methods=['GET', 'OPTIONS'])
def get_available_models():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if not verify_admin_session():
        return jsonify({"error": "Unauthorized admin access"}), 401

    try:
        from google import genai
        # Initialize client with default api key to list models
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return jsonify({"error": "Default Gemini API Key is not configured on server"}), 500

        client = genai.Client(api_key=api_key)
        
        # Fetch live Exchange Rate
        exchange_rate = get_live_exchange_rate_usd_to_inr()
        print(f"Live USD to INR Exchange Rate: {exchange_rate}")
        
        # Fetch models from Google
        models_list = client.models.list()
        
        available_models = []
        for model in models_list:
            name_raw = model.name  # e.g., 'models/gemini-2.5-flash'
            
            # Clean name (remove prefix 'models/')
            name = name_raw.replace("models/", "")
            
            # Only include gemini text generation models
            if "gemini" in name and not any(x in name for x in ["embed", "vision-preview", "aqa"]):
                display_name = name.replace("-", " ").title()
                
                # Fetch pricing from MongoDB collection
                pricing_record = db.model_pricing.find_one({"model_name": name})
                
                if pricing_record:
                    is_custom = pricing_record.get("is_custom", False)
                    if not is_custom:
                        # If not custom edited, dynamically update using the latest exchange rate
                        usd_input = pricing_record.get("input_rate_usd", MODEL_PRICING_USD.get(name, {"input": 0.075})["input"])
                        usd_output = pricing_record.get("output_rate_usd", MODEL_PRICING_USD.get(name, {"output": 0.30})["output"])
                        
                        input_price = round(usd_input * exchange_rate, 4)
                        output_price = round(usd_output * exchange_rate, 4)
                        
                        # Sync recalculated values back to DB
                        db.model_pricing.update_one(
                            {"model_name": name},
                            {"$set": {
                                "input_rate": input_price,
                                "output_rate": output_price,
                                "input_rate_usd": usd_input,
                                "output_rate_usd": usd_output
                            }}
                        )
                    else:
                        input_price = pricing_record.get("input_rate")
                        output_price = pricing_record.get("output_rate")
                else:
                    # Determine baseline USD rate
                    usd_rates = MODEL_PRICING_USD.get(name)
                    if not usd_rates:
                        if "pro" in name:
                            usd_rates = {"input": 1.25, "output": 5.00}
                        elif "flash-8b" in name:
                            usd_rates = {"input": 0.0375, "output": 0.15}
                        else:
                            usd_rates = {"input": 0.075, "output": 0.30}
                    
                    input_price = round(usd_rates["input"] * exchange_rate, 4)
                    output_price = round(usd_rates["output"] * exchange_rate, 4)
                    
                    # Store in database
                    db.model_pricing.insert_one({
                        "model_name": name,
                        "input_rate_usd": usd_rates["input"],
                        "output_rate_usd": usd_rates["output"],
                        "input_rate": input_price,
                        "output_rate": output_price,
                        "is_custom": False
                    })
                    print(f"Auto-populated newly discovered model {name} in MongoDB pricing database using exchange rate.")
                
                available_models.append({
                    "name": name,
                    "displayName": display_name,
                    "input_price_inr": input_price,
                    "output_price_inr": output_price
                })
        
        # Sort models alphabetically
        available_models.sort(key=lambda x: x["name"])
        
        return jsonify({"models": available_models}), 200
    except Exception as e:
        print("Error listing available models:", e)
        return jsonify({"error": "Failed to fetch models from Gemini API"}), 500
