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
        print(data)
        
        # Validate required fields
        required_fields = ['language', 'tone', 'references', 'length', 'closingConnotation', 'signatory']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get current date
        currentDate = datetime.now().strftime("%d/%m/%Y")
        
        # Build the prompt (moved from frontend for security)
        prompt = f"""You are my Email Writing Assistant.

Your task is to draft a professional email based on the following inputs:

Content Details/stats:
- 
- To: {data.get('to', '')}
- Subject: {data.get('subject', '')}
- Context: {data.get('context', '')}
- 
Output Preferences:
- Language: {data['language']}
- Tone: {data['tone']}
- Include References/Case Law: {data['references']}
- Length: {data['length']}
- Closing: {data['closingConnotation']}
- Signatory: {data['signatory']}

Instructions:
1. Auto-insert today's date ({currentDate}) at top-right of the email
2. Show Subject line on top
3. Write the body in short paragraphs (1-3 sentences each)
4. End with closing connotation + signatory
5. Keep formatting clean and copy-paste ready (Note format)
6. Use {data['tone'].lower()} tone throughout
7. Write in {data['language']}
8. { "Include relevant legal references or case laws where applicable" if data['references'] == "Yes" else "Do not include legal references or case laws" }
9. Make it {data['length'].lower()} in length

Format the email professionally with proper spacing and structure. Make it ready for immediate use.

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
2. Generate an appropriate subject line (Re: {data['subject']})
3. Start with {data['connotation']} {data['to']}
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
