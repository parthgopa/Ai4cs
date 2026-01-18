from flask import Blueprint, request, jsonify
from business_strategist_service import (
    create_session,
    next_question
)

business_strategist_bp = Blueprint("business_strategist", __name__)

@business_strategist_bp.route("/consultation", methods=["POST", "OPTIONS"])
def consultation():

    # ✅ Handle preflight FIRST
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    
    try:
        data = request.json
        consultation_type = data.get("type")

        if consultation_type == "start":
            session_id, first_q = create_session()
            return jsonify({
                "session_id": session_id,
                "question": first_q
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
