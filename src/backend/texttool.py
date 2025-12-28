from flask import Blueprint, request, jsonify
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Create Blueprint for TextTool routes
texttool_bp = Blueprint('texttool', __name__, url_prefix='/texttool')

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def call_gemini_api(prompt):
    """Helper function to call Gemini API"""
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
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

        if response.status_code != 200:
            return {
                "error": "Gemini API failed",
                "details": response.text
            }, response.status_code

        return response.json(), 200

    except requests.exceptions.Timeout:
        return {"error": "Request timed out"}, 504
    except Exception as e:
        return {"error": str(e)}, 500

@texttool_bp.route("/new-email", methods=["POST"])
def new_email():
    """Generate a new professional email"""
    try:
        data = request.get_json()
        print("Received New Email request:", data)
        
        # Validate required fields
        required_fields = ['language', 'tone', 'length', 'closingConnotation', 'signatory', 'subject', 'connotation', 'inputDetails', 'otherPoints']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get current date
        currentDate = datetime.now().strftime("%d/%m/%Y")
        
        # Build the prompt (moved from frontend for security)
        prompt = f"""You are an API-based Email Writing Engine operating in strict stateless mode.

Generate a ready-to-send email using only the input data supplied.
Do not infer, assume, or invent any information.

To: {data.get('signatory', '')}
Subject: {data.get('subject', '')}
Opening Connotation: {data.get('connotation', '')}
Main matter: {data.get('inputDetails', '')}
Additional matters: {data.get('otherPoints', '')}
Language: {data['language']}
Tone: {data['tone']}
Length: {data['length']}
Closing: {data['closingConnotation']}
Current Date: {currentDate}

OUTPUT STRUCTURE (MANDATORY, one by one , each on a new line):
1. Show {currentDate} aligned to the top-right.
2. To: {data.get('signatory', '')}.
3. Subject: {data.get('subject', '')}.
4. Leave one blank line.
5. Write the email body content here( carefully include all details from the context and instructions).
6. Maintain a {data['tone']} tone throughout.
7. Write strictly in {data['language']}.
8. Control length strictly as per {data['length']}:

summary → 1-2 paragraphs
Medium → 2-3 paragraphs
Detailed → 3-5 paragraphs

9. End with {data['closingConnotation']}.

Remove all introductory paragraph, end notes and any other non-relevant content."""

        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@texttool_bp.route("/reply-email", methods=["POST"])
def reply_email():
    """Generate a professional email reply"""
    try:
        data = request.get_json()
        print("Received Reply request:", data)
        # for key, value in data.items():
        #     print(f"{key}: {value}")
        
        # Validate required fields
        required_fields = ['originalEmail', 'to', 'subject', 'connotation', 'replyMatter', 'tone', 'size', 'closing', 'signature', 'language']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get current date
        currentDate = datetime.now().strftime("%d/%m/%Y")
        
        # Build the prompt (moved from frontend for security)
        prompt = f"""You are my Email Reply Assistant.

Original Email:
{data['originalEmail']}

Reply Requirements:
- To: {data['to']}
- Subject: {data['subject']}
- Connotation: {data['connotation']}
- Reply Matter: {data['replyMatter']}
- Additional Matter: {data.get('additionalMatter', 'None')}
- Tone: {data['tone']}
- Size: {data['size']}
- Closing: {data['closing']}
- Signature: {data['signature']}
- Language: {data['language']}

Instructions:
1. Auto-insert today's date ({currentDate}) at top-right
2. Generate an appropriate subject line of given user subject : {data['subject']}
3. Start with {data['connotation']}
4. Write a professional reply with {data['tone'].lower()} tone
5. Address the reply matter: {data['replyMatter']}
6. Include additional matter if provided: {data.get('additionalMatter', 'None')}
7. Make it {data['size'].lower()} in length
8. End with {data['closing']} and {data['signature']}
9. Write in {data['language']}
10. Keep formatting clean and copy-paste ready
11. Include appropriate greeting and closing

Format the reply professionally with proper spacing and structure.

Remove all introductory paragraph, end notes and any other non-relevant content."""

        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500