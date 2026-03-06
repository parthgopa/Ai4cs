from flask import Blueprint, request, jsonify
from business_strategist_service import (
    create_session,
    next_question
)

business_strategist_bp = Blueprint("business_strategist", __name__)

# Function type mapping
FUNCTION_TYPES = {
    "business_diagnosis": "Business Diagnosis & Problem Identification",
    "market_analysis": "Market & Competitive Analysis",
    "strategic_planning": "Strategic Planning & Growth Strategy",
    "financial_strategy": "Financial Strategy & Profitability",
    "gtm_strategy": "Go-To-Market Strategy",
    "operations_optimization": "Operations & Process Optimization",
    "risk_management": "Risk Management & Business Continuity",
    "leadership_support": "Leadership / Board-Level Decision Support",
    "execution_roadmap": "Execution Roadmap & KPI Planning"
}

@business_strategist_bp.route("/consultation", methods=["POST", "OPTIONS"])
def consultation():
    """Main consultation endpoint supporting all 9 strategy functions"""
    
    # Handle preflight FIRST
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    
    try:
        data = request.json
        consultation_type = data.get("type")

        if consultation_type == "start":
            function_type = data.get("function_type")
            
            if not function_type or function_type not in FUNCTION_TYPES:
                return jsonify({"error": "Invalid or missing function_type"}), 400
            
            session_id, first_q = create_session(function_type)
            return jsonify({
                "session_id": session_id,
                "question": first_q,
                "function_type": function_type,
                "function_name": FUNCTION_TYPES[function_type]
            })
        
        elif consultation_type == "next":
            session_id = data.get("session_id")
            answer = data.get("answer")

            if not session_id or not answer:
                return jsonify({"error": "Invalid request. Session ID and answer required."}), 400

            q = next_question(session_id, answer)
            return jsonify({"question": q})
        
        else:
            return jsonify({"error": "Invalid type. Use 'start' or 'next'."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@business_strategist_bp.route("/functions", methods=["GET", "OPTIONS"])
def get_functions():
    """Get list of all available strategy functions"""
    
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    
    try:
        functions = [
            {"id": key, "name": value} 
            for key, value in FUNCTION_TYPES.items()
        ]
        return jsonify({"functions": functions})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
