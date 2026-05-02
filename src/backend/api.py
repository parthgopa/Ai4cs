from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Create Blueprint for API routes
api_bp = Blueprint('api', __name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini API KEY :", GEMINI_API_KEY)

client = genai.Client(api_key=GEMINI_API_KEY)

@api_bp.route("/generate", methods=["POST", "OPTIONS"])
def generate():

    # Handle preflight FIRST
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        question = data.get("question")
        if not question:
            return jsonify({"error": "Question is required"}), 400

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=[{"role": "user", "parts": [{"text": question}]}]
        )
        print(response.text)
        if not response or not response.text:
            return jsonify({
                "error": "Gemini API failed",
                "details": "No content returned"
            }), 500

        return jsonify({
            "candidates": [{
                "content": {
                    "parts": [{"text": response.text}]
                }
            }]
        })

    except Exception as e:
        print("API ERROR:", e)
        return jsonify({"error": "Internal server error"}), 500


@api_bp.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    """Multi-turn conversation endpoint for Court Document feature"""
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        messages = data.get("messages", [])
        if not messages:
            return jsonify({"error": "Messages are required"}), 400

        # Convert frontend message format to Gemini format
        contents = []
        for msg in messages:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.get("content", "")}]
            })

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=contents
        )

        if not response or not response.text:
            return jsonify({
                "error": "Gemini API failed",
                "details": "No content returned"
            }), 500

        return jsonify({"text": response.text})

    except Exception as e:
        print("CHAT API ERROR:", e)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
