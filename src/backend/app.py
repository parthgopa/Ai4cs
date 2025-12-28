from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import blueprints
from api import api_bp
from texttool import texttool_bp

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # allow frontend calls

# Register blueprints with proper URL prefixes
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(texttool_bp, url_prefix='/texttool')

# Legacy route for backward compatibility
@app.route('/generate', methods=['POST', 'OPTIONS'])
def legacy_generate():
    """Legacy endpoint for backward compatibility"""
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    else:
        from api import generate as api_generate
        return api_generate()

@app.route('/')
def home():
    return jsonify({
        "message": "AI4CS Backend API",
        "endpoints": {
            "general": "/api/generate",
            "legacy": "/generate (deprecated)",
            "texttool": {
                "new_email": "/texttool/new-email",
                "reply_email": "/texttool/reply-email"
            }
        }
    })

# COMMENT OUT BELOW WHILE DEPLOYING TO BACKEND SERVER
if __name__ == "__main__":
    app.run(debug=True)
