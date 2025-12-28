from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Create Blueprint for API routes
api_bp = Blueprint('api', __name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini API KEY :", GEMINI_API_KEY)

@api_bp.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        question = data.get("question")

        if not question:
            return jsonify({"error": "Question is required"}), 400

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

        payload = {
            "contents": [
                {
                    "parts": [{"text": question}]
                }
            ],
            "generationConfig": {
                "maxOutputTokens": 2048,
                "temperature": 0.7
            }
        }

        response = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=120
        )

        print(response)

        if response.status_code != 200:
            return jsonify({
                "error": "Gemini API failed",
                "details": response.text
            }), response.status_code

        return jsonify(response.json())

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out"}), 504

    except Exception as e:
        return jsonify({"error": str(e)}), 500
