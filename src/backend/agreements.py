from flask import Blueprint, request, jsonify
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Create Blueprint for Agreements routes
agreements_bp = Blueprint('agreements', __name__, url_prefix='/agreements')

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

@agreements_bp.route("/generate-template", methods=["POST"])
def generate_template():
    """Generate a professional agreement template"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'agreementType' not in data:
            return jsonify({"error": "Missing required field: agreementType"}), 400

        # Build the prompt (moved from frontend for security)
        prompt = f"""Generate a Professional Template for a "{data['agreementType']}" Agreement (Template Only)

Prepare a dummy draft of a "{data['agreementType']}" agreement in a highly professional format, as would be prepared by a senior and experienced solicitor practicing under Indian laws. This template is for structural preview only and should include:

A formal and sophisticated legal drafting style

Compliance with Indian laws and best practices for such agreement types

Clearly structured clauses, definitions, schedules (if any), and annexures

Use of formal legal phrases and terminology suitable for High Court or Tribunal presentation

Placeholder text for all variable elements (e.g., [Party Name], [Date], [Consideration Amount], [Governing Law], etc.)

The title of the agreement should be: "{data['agreementType']} Agreement (Template)"

Use a consistent format with numbered clauses, section headings, and indented sub-clauses.

Ensure the template maintains clarity, authority, and readability, reflecting the standard expected from top-tier legal firms in India.

⚖ This template should not contain actual party-specific information, but be ready for such data to be inserted.
🖋 The style should reflect that of a learned senior solicitor of over 20 years' experience in corporate law practice."""

        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@agreements_bp.route("/generate-agreement", methods=["POST"])
def generate_agreement():
    """Generate a complete legally binding agreement"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['agreementType', 'dateOfAgreement', 'partyAName', 'partyADescription', 'partyAAddress', 
                          'partyBName', 'partyBDescription', 'partyBAddress', 'purpose', 'effectiveDate', 
                          'duration', 'governingLaw', 'specialClauses', 'signatureNames']
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Build the prompt (moved from frontend for security)
        prompt = f"""Generate a legally binding "{data['agreementType']}" agreement under Indian laws.
Based on the provided input variables, prepare a complete and professionally drafted agreement as would be prepared by a senior solicitor with over 20 years of corporate law experience.
Follow the style, structure, and terminology used in Indian legal practice, ensuring compliance with applicable laws (such as the Indian Contract Act, Companies Act, etc.).
The document must include:
•	A formal title (e.g., "Shareholders Agreement")
•	Date of execution
•	Parties' legal identity and addresses
•	Recitals / Background
•	Detailed clauses covering rights, duties, obligations, representations, indemnity, termination, and dispute resolution
•	Jurisdiction and governing law (India)
•	Placeholders only where input is missing
•	Use numbered headings, sub-clauses, and professional formatting
⚖️ Ensure tone and language match that of documents submitted before Indian regulators, High Courts, or arbitral tribunals.

Agreement Type: {data['agreementType']}
Date of Agreement: {data['dateOfAgreement']}
Party A Name: {data['partyAName']}
Party A Description: {data['partyADescription']}
Party A Address: {data['partyAAddress']}
Party B Name: {data['partyBName']}
Party B Description: {data['partyBDescription']}
Party B Address: {data['partyBAddress']}
Purpose: {data['purpose']}
Effective Date: {data['effectiveDate']}
Duration: {data['duration']}
Governing Law: {data['governingLaw']}
Special Clauses: {data['specialClauses']}
Signature Names: {data['signatureNames']}"""

        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
