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
