from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Create Blueprint for API routes
api_bp = Blueprint('api', __name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini API KEY :", GEMINI_API_KEY)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

@api_bp.route("/generate", methods=["POST", "OPTIONS"])
def generate():

    # ✅ Handle preflight FIRST
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        question = data.get("question")
        if not question:
            return jsonify({"error": "Question is required"}), 400

        response = model.generate_content(
            question,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=2048,
                temperature=0.7
            )
        )

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
