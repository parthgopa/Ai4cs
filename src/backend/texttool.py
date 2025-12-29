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
        # print("Received New Email request:", data)
        
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
        # print("Received Reply request:", data)
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

@texttool_bp.route("/internship-report", methods=["POST"])
def internship_report():
    """Generate a comprehensive internship report"""
    try:
        data = request.get_json()
        # print("Received Internship Report request:", data)
        
        # Validate required fields
        required_fields = ['studentName', 'organizationName', 'internshipRole', 'department', 'duration', 'supervisorName', 'organizationOverview', 'keyResponsibilities', 'toolsTechnologies', 'keyLearnings']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get current date
        currentDate = datetime.now().strftime("%d/%m/%Y")


        
        # Build the prompt
        prompt = f"""You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Internship Report based on the following inputs:

Report Details:
- Student Name: {data['studentName']}
- Organization Name: {data['organizationName']}
- Internship Role: {data['internshipRole']}
- Department: {data['department']}
- Duration: {data['duration']}
- Supervisor: {data['supervisorName']}
- Organization Overview: {data['organizationOverview']}
- Key Responsibilities: {data['keyResponsibilities']}
- Tools/Technologies: {data['toolsTechnologies']}
- Key Learnings: {data['keyLearnings']}
- Challenges: {data['challenges']}
- Solutions: {data['solutions']}
- Conclusion: {data['conclusion']}
- Date: {currentDate}

Instructions:
1. Format as a professional internship report with proper structure
2. Include title page with all details
3. Follow the exact output structure:
   - Title Page
   - 1. Introduction
   - 2. Organization Overview
   - 3. Internship Role and Responsibilities
   - 4. Tools and Technologies Used
   - 5. Key Learnings
   - 6. Challenges (if provided)
   - 7. Conclusion (if provided)
   - 8. Acknowledgement
4. Use professional academic tone
5. Include proper headings and subheadings
6. Format responsibilities as bullet points
7. Ensure proper spacing and structure
8. Make it comprehensive and detailed

Format the report professionally with proper academic structure. Remove all introductory paragraph, end notes and any other non-relevant content."""
        
        try:
            result, status_code = call_gemini_api(prompt)
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 987

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@texttool_bp.route("/project-report", methods=["POST"])
def project_report():
    """Generate a comprehensive project report"""
    try:
        data = request.get_json()
        # print("Received Project Report request:", data)
        
        # Validate required fields
        required_fields = ['projectTitle', 'studentTeamName', 'organization', 'duration', 'problemStatement', 'objectives', 'proposedSolution', 'technologiesUsed', 'systemArchitecture', 'implementationDetails', 'resultsOutcomes', 'futureEnhancements', 'conclusion']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get current date
        currentDate = datetime.now().strftime("%d/%m/%Y")
        
        # Build the prompt
        prompt = f"""You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Project Report based on the following inputs:

Report Details:
- Project Title: {data['projectTitle']}
- Student/Team Name: {data['studentTeamName']}
- Organization: {data['organization']}
- Duration: {data['duration']}
- Problem Statement: {data['problemStatement']}
- Objectives: {data['objectives']}
- Proposed Solution: {data['proposedSolution']}
- Technologies Used: {data['technologiesUsed']}
- System Architecture: {data['systemArchitecture']}
- Implementation Details: {data['implementationDetails']}
- Results/Outcomes: {data['resultsOutcomes']}
- Future Enhancements: {data['futureEnhancements']}
- Conclusion: {data['conclusion']}
- Date: {currentDate}

Instructions:
1. Format as a professional project report with proper structure
2. Follow the exact output structure:
   - 1. Introduction
   - 2. Problem Statement
   - 3. Objectives
   - 4. Proposed Solution
   - 5. System Architecture
   - 6. Implementation
   - 7. Results
   - 8. Future Scope
   - 9. Conclusion
3. Use technical and professional tone
4. Include proper headings and subheadings
5. Format objectives and results as clear points
6. Ensure proper technical documentation style
7. Make it comprehensive and detailed

Format the report professionally with proper technical structure. Remove all introductory paragraph, end notes and any other non-relevant content."""

        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@texttool_bp.route("/technical-report", methods=["POST"])
def technical_report():
    """Generate a comprehensive technical report"""
    try:
        data = request.get_json()
        # print("Received Technical Report request:", data)
        
        # Validate required fields
        required_fields = ['reportTitle', 'authorName', 'organization', 'purpose', 'technicalBackground', 'toolsTechnologies', 'methodology', 'implementationDetails', 'performanceEvaluation', 'limitations', 'conclusion']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get current date
        currentDate = datetime.now().strftime("%d/%m/%Y")
        
        # Build the prompt
        prompt = f"""You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Technical Report based on the following inputs:

Report Details:
- Report Title: {data['reportTitle']}
- Author Name: {data['authorName']}
- Organization: {data['organization']}
- Purpose: {data['purpose']}
- Technical Background: {data['technicalBackground']}
- Tools/Technologies: {data['toolsTechnologies']}
- Methodology: {data['methodology']}
- Implementation Details: {data['implementationDetails']}
- Performance/Evaluation: {data['performanceEvaluation']}
- Limitations: {data['limitations']}
- Conclusion: {data['conclusion']}
- Date: {currentDate}

Instructions:
1. Format as a professional technical report with proper structure
2. Follow the exact output structure:
   - 1. Abstract
   - 2. Introduction
   - 3. Technical Background
   - 4. Methodology
   - 5. Implementation
   - 6. Performance Analysis
   - 7. Limitations
   - 8. Conclusion
3. Use technical and analytical tone
4. Include proper headings and subheadings
5. Ensure proper technical documentation style
6. Make it comprehensive and detailed with technical depth

Format the report professionally with proper technical structure. Remove all introductory paragraph, end notes and any other non-relevant content."""

        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@texttool_bp.route("/business-market-report", methods=["POST"])
def business_market_report():
    """Generate a comprehensive business/market report"""
    try:
        data = request.get_json()
        # print("Received Business/Market Report request:", data)
        
        # Validate required fields
        required_fields = ['reportTitle', 'companyIndustry', 'marketOverview', 'targetAudience', 'keyProblems', 'marketAnalysis', 'competitorAnalysis', 'proposedStrategy', 'risksChallenges', 'conclusionRecommendations']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get current date
        currentDate = datetime.now().strftime("%d/%m/%Y")
        
        # Build the prompt
        prompt = f"""You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Business/Market Report based on the following inputs:

Report Details:
- Report Title: {data['reportTitle']}
- Company/Industry: {data['companyIndustry']}
- Market Overview: {data['marketOverview']}
- Target Audience: {data['targetAudience']}
- Key Problems/Gaps: {data['keyProblems']}
- Market Analysis: {data['marketAnalysis']}
- Competitor Analysis: {data['competitorAnalysis']}
- Proposed Strategy: {data['proposedStrategy']}
- Financial/Growth Insights: {data.get('financialGrowth', 'Not specified')}
- Risks & Challenges: {data['risksChallenges']}
- Conclusion & Recommendations: {data['conclusionRecommendations']}
- Date: {currentDate}

Instructions:
1. Format as a professional business report with proper structure
2. Follow the exact output structure:
   - 1. Executive Summary
   - 2. Market Overview
   - 3. Industry Analysis
   - 4. Competitor Analysis
   - 5. Strategy Proposal
   - 6. Risk Assessment
   - 7. Recommendations
3. Use business professional tone
4. Include proper headings and subheadings
5. Ensure proper business documentation style
6. Make it comprehensive and strategic

Format the report professionally with proper business structure. Remove all introductory paragraph, end notes and any other non-relevant content."""

        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@texttool_bp.route("/incident-status-report", methods=["POST"])
def incident_status_report():
    """Generate a comprehensive incident/status report"""
    try:
        data = request.get_json()
        # print("Received Incident/Status Report request:", data)
        
        # Validate required fields
        required_fields = ['incidentTitle', 'dateTime', 'locationSystem', 'reportedBy', 'description', 'impactAnalysis', 'actionsTaken', 'currentStatus', 'futurePrevention']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get current date
        currentDate = datetime.now().strftime("%d/%m/%Y")
        
        # Build the prompt
        prompt = f"""You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Incident/Status Report based on the following inputs:

Report Details:
- Incident Title: {data['incidentTitle']}
- Date & Time: {data['dateTime']}
- Location/System: {data['locationSystem']}
- Reported By: {data['reportedBy']}
- Description: {data['description']}
- Impact Analysis: {data['impactAnalysis']}
- Actions Taken: {data['actionsTaken']}
- Current Status: {data['currentStatus']}
- Future Prevention: {data['futurePrevention']}
- Date: {currentDate}

Instructions:
1. Format as a professional incident report with proper structure
2. Follow the exact output structure:
   - 1. Incident Overview
   - 2. Description
   - 3. Impact Analysis
   - 4. Actions Taken
   - 5. Current Status
   - 6. Preventive Measures
3. Use factual and objective tone
4. Include proper headings and subheadings
5. Ensure proper incident documentation style
6. Make it comprehensive and precise

Format the report professionally with proper incident structure. Remove all introductory paragraph, end notes and any other non-relevant content."""

        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    