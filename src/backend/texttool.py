from flask import Blueprint, request, jsonify
from datetime import datetime
import requests
import os
import io
from dotenv import load_dotenv
import fitz  # PyMuPDF for PDFs
import docx  # python-docx for DOCX

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

@texttool_bp.route('/extract-text', methods=['POST'])
def extract_text():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = file.filename.lower()
    content = ""

    try:
        # Read file into memory
        file_bytes = file.read()

        # 1. Handle PDF
        if filename.endswith('.pdf'):
            with fitz.open(stream=file_bytes, filetype="pdf") as doc:
                for page in doc:
                    content += page.get_text()

        # 2. Handle DOCX
        elif filename.endswith('.docx'):
            doc_file = io.BytesIO(file_bytes)
            doc = docx.Document(doc_file)
            full_text = [para.text for para in doc.paragraphs]
            content = '\n'.join(full_text)

        # 3. Handle TXT
        elif filename.endswith('.txt'):
            content = file_bytes.decode('utf-8')

        else:
            return jsonify({"error": "Unsupported file format"}), 400

        print(f"Extracted {len(content)} characters from {filename}")
        return jsonify({
            "status": "success",
            "extractedText": content,
            "filename": file.filename
        })

    except Exception as e:
        return jsonify({"error": f"Failed to process file: {str(e)}"}), 500

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

@texttool_bp.route("/generate-blog", methods=["POST"])
def generate_blog():
    """Generate blog content based on type and data"""
    try:
        data = request.get_json()
        blog_type = data.get('blogType', 'default')
        blog_data = data.get('data', {})
        
        current_date = datetime.now().strftime("%d-%m-%Y")
        prompt = generate_blog_prompt(blog_type, blog_data, current_date)
        
        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_blog_prompt(blog_type, data, current_date):
    """Generate appropriate prompt based on blog type"""
    
    if blog_type == "educational-blog":

        return f"""You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Educational/Explainer blog based on the following inputs:

Blog Details:
- Topic/Title: {data['blogTopic']}
- Language: {data['language']}
- Tone: {data['tone']}
- Length: {data['length']}
- Target Audience: {data['targetAudience']}
- Complexity Level: {data['complexityLevel']}
- Include Examples: {data['includeExamples']}

Instructions:
1. Format as a professional educational blog with proper structure
2. Follow the exact output structure:
   - Title
   - Introduction
   - Concept Explanation
   - Examples (if enabled)
   - Benefits / Importance
   - Conclusion
3. Use {data['tone'].lower()} tone throughout
4. Write in {data['language']}
5. Make it {data['length'].lower()} in length
6. Target audience: {data['targetAudience']}
7. Complexity level: {data['complexityLevel'].lower()}
8. {'Include relevant examples to illustrate concepts' if data['includeExamples'] == 'Yes' else 'Do not include examples'}
9. Ensure proper educational flow and clarity
10. Make content engaging and informative

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif blog_type == "business-blog":
        return f"""You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Business/Corporate blog based on the following inputs:

Blog Details:
- Topic/Title: {data['blogTopic']}
- Language: {data['language']}
- Tone: {data['tone']}
- Length: {data['length']}
- Target Audience: {data['targetAudience']}
- Business Focus Area: {data['businessFocusArea']}
- Add Call-to-Action: {data['addCallToAction']}

Instructions:
1. Format as a professional business blog with proper structure
2. Follow the exact output structure:
   - Title
   - Business Context
   - Problem Statement
   - AI / Technology Solution
   - Business Benefits
   - Conclusion{' (+ CTA)' if data['addCallToAction'] == 'Yes' else ''}
3. Use {data['tone'].lower()} tone throughout
4. Write in {data['language']}
5. Make it {data['length'].lower()} in length
6. Target audience: {data['targetAudience']}
7. Focus on {data['businessFocusArea'].lower()} aspects
8. {'Include a compelling call-to-action at the end' if data['addCallToAction'] == 'Yes' else 'Do not include call-to-action'}
9. Ensure business relevance and strategic value
10. Make content professional and insightful

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif blog_type == "howto-blog":
        return f"""You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive How-To/Step-by-Step blog based on the following inputs:

Blog Details:
- Topic/Title: {data['blogTopic']}
- Language: {data['language']}
- Tone: {data['tone']}
- Length: {data['length']}
- Target Audience: {data['targetAudience']}
- Skill Level: {data['skillLevel']}
- Steps Detail Level: {data['stepsDetailLevel']}

Instructions:
1. Format as a professional how-to blog with proper structure
2. Follow the exact output structure:
   - Title
   - Introduction
   - Prerequisites
   - Step-by-Step Guide
   - Tips & Best Practices
   - Conclusion
3. Use {data['tone'].lower()} tone throughout
4. Write in {data['language']}
5. Make it {data['length'].lower()} in length
6. Target audience: {data['targetAudience']}
7. Skill level: {data['skillLevel'].lower()}
8. Steps detail: {data['stepsDetailLevel'].lower()}
9. Ensure clear, actionable steps
10. Make instructions practical and easy to follow

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif blog_type == "tech-blog":
        return f"""You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Tech/Developer blog based on the following inputs:

Blog Details:
- Topic/Title: {data['blogTopic']}
- Language: {data['language']}
- Tone: {data['tone']}
- Length: {data['length']}
- Target Audience: {data['targetAudience']}
- Tech Domain: {data['techDomain']}
- Include Code Snippets: {data['includeCodeSnippets']}

Instructions:
1. Format as a professional technical blog with proper structure
2. Follow the exact output structure:
   - Title
   - Technical Overview
   - Architecture / Approach
   - Implementation Explanation
   - Code Snippets (if enabled)
   - Conclusion
3. Use {data['tone'].lower()} tone throughout
4. Write in {data['language']}
5. Make it {data['length'].lower()} in length
6. Target audience: {data['targetAudience']}
7. Tech domain: {data['techDomain'].lower()}
8. {'Include relevant code snippets with proper formatting' if data['includeCodeSnippets'] == 'Yes' else 'Do not include code snippets'}
9. Ensure technical accuracy and depth
10. Make content valuable for developers

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif blog_type == "opinion-blog":
        return f"""You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Opinion/Thought Leadership blog based on the following inputs:

Blog Details:
- Topic/Title: {data['blogTopic']}
- Language: {data['language']}
- Tone: {data['tone']}
- Length: {data['length']}
- Target Audience: {data['targetAudience']}
- Perspective: {data['perspective']}
- Data Support Level: {data['dataSupportLevel']}

Instructions:
1. Format as a professional opinion blog with proper structure
2. Follow the exact output structure:
   - Title
   - Introduction
   - Author's Perspective
   - Supporting Arguments
   - Counterpoints
   - Conclusion
3. Use {data['tone'].lower()} tone throughout
4. Write in {data['language']}
5. Make it {data['length'].lower()} in length
6. Target audience: {data['targetAudience']}
7. Perspective: {data['perspective'].lower()}
8. Data support: {data['dataSupportLevel'].lower()}
9. Ensure balanced viewpoint with supporting arguments
10. Make content thought-provoking and insightful

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif blog_type == "marketing-blog":
        return f"""You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Marketing/SEO blog based on the following inputs:

Blog Details:
- Topic/Title: {data['blogTopic']}
- Language: {data['language']}
- Tone: {data['tone']}
- Length: {data['length']}
- Target Audience: {data['targetAudience']}
- SEO Intent: {data['seoIntent']}
- Include FAQs: {data['includeFAQs']}
- Primary Keyword: {data['primaryKeyword']}

Instructions:
1. Format as a professional marketing/SEO blog with proper structure
2. Follow the exact output structure:
   - SEO Optimized Title
   - Meta Description
   - Introduction
   - Keyword-Focused Sections
   - FAQs (if enabled)
   - Conclusion
3. Use {data['tone'].lower()} tone throughout
4. Write in {data['language']}
5. Make it {data['length'].lower()} in length
6. Target audience: {data['targetAudience']}
7. SEO intent: {data['seoIntent'].lower()}
8. Primary keyword: {data['primaryKeyword']}
9. {'Include relevant FAQs with answers' if data['includeFAQs'] == 'Yes' else 'Do not include FAQs'}
10. Ensure SEO optimization and marketing value
11. Naturally incorporate the primary keyword throughout

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif blog_type == "product-blog":
        return f"""You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Product/Feature blog based on the following inputs:

Blog Details:
- Topic/Title: {data['blogTopic']}
- Language: {data['language']}
- Tone: {data['tone']}
- Length: {data['length']}
- Target Audience: {data['targetAudience']}
- Product Type: {data['productType']}
- Announcement Type: {data['announcementType']}

Instructions:
1. Format as a professional product blog with proper structure
2. Follow the exact output structure:
   - Title
   - Product Overview
   - Problem It Solves
   - Key Features
   - Benefits
   - Conclusion
3. Use {data['tone'].lower()} tone throughout
4. Write in {data['language']}
5. Make it {data['length'].lower()} in length
6. Target audience: {data['targetAudience']}
7. Product type: {data['productType'].lower()}
8. Announcement type: {data['announcementType'].lower()}
9. Ensure product value proposition is clear
10. Make content engaging and informative

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    else:
        return f"""You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive blog based on the following inputs:

Blog Details:
- Topic/Title: {data['blogTopic']}
- Language: {data['language']}
- Tone: {data['tone']}
- Length: {data['length']}
- Target Audience: {data['targetAudience']}

Instructions:
1. Format as a professional blog with proper structure
2. Follow the exact output structure:
   - Title
   - Introduction
   - Main Content
   - Conclusion
3. Use {data['tone'].lower()} tone throughout
4. Write in {data['language']}
5. Make it {data['length'].lower()} in length
6. Target audience: {data['targetAudience']}
7. Ensure proper flow and clarity
8. Make content engaging and informative

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""

@texttool_bp.route("/generate-text-intelligence", methods=["POST"])
def generate_text_intelligence():
    """Generate content for Text Intelligence Hub operations"""
    try:
        data = request.get_json()
        print("Text Intelligence Hub data:", data)
        
        # Validate required fields
        if 'operationType' not in data:
            return jsonify({"error": "Missing required field: operationType"}), 400
        
        operation_type = data['operationType']
        
        # Generate prompt based on operation type
        prompt = generate_text_intelligence_prompt(operation_type, data)
        
        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_text_intelligence_prompt(operation_type, data):
    """Generate appropriate prompt based on Text Intelligence Hub operation type"""
    
    if operation_type == "summarization":
        return f"""You are a professional AI Text Processing Agent designed for office, business, and corporate use.

Your task is to create a professional summary based on the following inputs:

Content to Summarize:
{data['content']}

Summary Requirements:
- Length: {data['summaryLength']}
- Style: {data['summaryStyle']}
- Output Language: {data['outputLanguage']}

Instructions:
1. Create a {data['summaryLength'].lower()} summary
2. Use {data['summaryStyle'].lower()} style throughout
3. Write in {data['outputLanguage']}
4. Ensure all key points are covered
5. Maintain professional tone
6. Make it suitable for office/corporate use

Format the summary professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif operation_type == "dotpoints":
        return f"""You are a professional AI Text Processing Agent designed for office, business, and corporate use.

Your task is to convert content into structured dot points based on the following inputs:

Content to Process:
{data['content']}

Dot Points Requirements:
- Number of Points: {data['numberOfPoints']}
- Detail Level: {data['detailLevel']}
- Tone: {data['tone']}
- Output Language: {data['outputLanguage']}

Instructions:
1. Extract exactly {data['numberOfPoints']} key points from the content
2. Use {data['detailLevel'].lower()} detail level for each point
3. Maintain {data['tone'].lower()} tone throughout
4. Write in {data['outputLanguage']}
5. Ensure each point is concise and impactful
6. Structure as professional bullet points suitable for office/corporate use
7. Focus on the most important and actionable information
8. Use proper bullet point formatting (• or numbered list)

Format the dot points professionally with clear structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif operation_type == "pptslides":
        return f"""You are a professional AI Text Processing Agent designed for office, business, and corporate use.

Your task is to convert content into professional presentation slides based on the following inputs:

Content to Convert:
{data['content']}

PPT Slides Requirements:
- Number of Slides: {data['numberOfSlides']}
- Slide Style: {data['slideStyle']}
- Bullet Points per Slide: {data['bulletPointsPerSlide']}
- Output Language: {data['outputLanguage']}

Instructions:
1. Create exactly {data['numberOfSlides']} presentation slides from the content
2. Use {data['slideStyle'].lower()} style for all slides
3. Include {data['bulletPointsPerSlide']} bullet points per slide maximum
4. Write in {data['outputLanguage']}
5. Structure each slide with a clear title and bullet points
6. Ensure logical flow and progression between slides
7. Focus on key information suitable for presentation format
8. Make content concise and impactful for audience
9. Use professional presentation language and structure
10. Include a title slide and conclusion if appropriate

Format the slides professionally with clear slide numbering and structure. Use "Slide X: [Title]" format followed by bullet points. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif operation_type == "translation":
        return f"""You are a professional AI Text Processing Agent designed for office, business, and corporate use.

Your task is to translate content accurately based on the following inputs:

Content to Translate:
{data['content']}

Translation Requirements:
- Source Language: {data['sourceLanguage']}
- Target Language: {data['targetLanguage']}
- Translation Style: {data['translationStyle']}
- Industry Context: {data.get('industryContext', 'None')}

Instructions:
1. Translate from {data['sourceLanguage'] if data['sourceLanguage'] != 'Auto-detect' else 'automatically detected language'} to {data['targetLanguage']}
2. Use {data['translationStyle'].lower()} translation style throughout
3. {data['industryContext'] + ' industry context and terminology' if data['industryContext'] else 'General translation approach'}
4. Preserve the original meaning and tone of the content
5. Ensure cultural and linguistic accuracy
6. Maintain professional quality suitable for office/corporate use
7. Pay attention to context-specific terminology and phrasing
8. Ensure natural flow and readability in the target language
9. Preserve formatting and structure where appropriate
10. Double-check for accuracy and completeness

Translate accurately while preserving meaning, tone, and context. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif operation_type == "actionpoints":
        return f"""You are a professional AI Text Processing Agent designed for office, business, and corporate use.

Your task is to extract clear, actionable tasks from the content based on the following inputs:

Content to Process:
{data['content']}

Action Points Requirements:
- Perspective: {data['perspective']}
- Timeline Preference: {data['timelinePreference']}
- Output Format: {data['outputFormat']}
- Output Language: {data['outputLanguage']}

Instructions:
1. Extract actionable tasks from {data['perspective'].lower()} perspective
2. Focus on {data['timelinePreference'].lower()} timeline preferences
3. Format as {data['outputFormat'].lower()}
4. Write in {data['outputLanguage']}
5. Ensure each action point is clear, specific, and actionable
6. Include responsibility assignments where appropriate
7. Add realistic timelines based on {data['timelinePreference'].lower()} preference
8. Prioritize actions by importance and urgency
9. Make content suitable for office/corporate environment
10. Use professional and action-oriented language

{('Format as a table with columns: Action | Responsibility | Timeline' if data['outputFormat'] == 'Table' else 'Format as a bullet list with clear action items')}

Extract clear, actionable tasks from the content. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif operation_type == "internalnote":
        current_date = datetime.now().strftime("%B %d, %Y") if data['datePreference'] == 'Auto' else '[Date to be specified]'
        
        return f"""You are a professional AI Text Processing Agent designed for office, business, and corporate use.

Your task is to create a structured internal office note based on the following inputs:

Background / Facts Content:
{data['content']}

Internal Note Requirements:
- Department / Section: {data['departmentSection']}
- Subject: {data['subject']}
- Reference: {data.get('reference', 'None')}
- Purpose: {data['purpose']}
- Tone: {data['tone']}
- Structure: {data['structurePreference']}
- Recommendation Required: {data['recommendationRequired']}
- Approval Required From: {data.get('approvalRequiredFrom', 'None')}
- Output Language: {data['outputLanguage']}
- Date: {current_date}

Instructions:
1. Follow a professional, corporate, and administrative writing style
2. Do NOT invent facts - use only the provided background content
3. Maintain logical flow throughout the note
4. Respect the selected tone ({data['tone']}) strictly
5. Use {data['structurePreference'].lower()} structure preference
6. Output must be clean, structured, and ready for official use
7. Write in {data['outputLanguage']}
8. Treat uploaded/pasted content as Background/Facts source
9. Include recommendation section only if selected
10. Include approval section if approval is required

STRICT OUTPUT FORMAT:

OFFICE NOTE

Department / Section: {data['departmentSection']}
Date: {current_date}

Subject: {data['subject']}
Reference: {data.get('reference', 'None')}

1. Background:
2. Matter for Consideration:
3. Analysis / Observations:
{('4. Recommendation:' if data['recommendationRequired'] == 'Yes' else '')}
{('5. Approval Sought:' if data['approvalRequiredFrom'] else '')}

Prepared By:
(Designation only)

Generate the output following this exact format. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    else:
        return f"""You are a professional AI Text Processing Agent designed for office, business, and corporate use.

Your task is to process the following content based on the operation requirements:

Content to Process:
{data['content']}

Operation Type: {operation_type}

Instructions:
1. Process the content professionally
2. Maintain office/corporate quality standards
3. Ensure logical structure and clarity
4. Write in {data.get('outputLanguage', 'English')}
5. Make the output ready for professional use

Format the output professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""


@texttool_bp.route("/generate-letter", methods=["POST"])
def generate_letter():
    """Generate letter content based on type and data"""
    try:
        data = request.get_json()
        letter_type = data.get('letterType', 'formal-letter')
        letter_data = data.get('data', {})
        
        current_date = datetime.now().strftime("%d-%m-%Y")
        prompt = generate_letter_prompt(letter_type, letter_data, current_date)
        
        result, status_code = call_gemini_api(prompt)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_letter_prompt(letter_type, data, current_date):
    """Generate appropriate prompt based on letter type"""
    
    if letter_type == "formal-letter":
        return f"""You are my Professional Letter Writing Assistant.

Your task is to draft a formal letter based on the following inputs:

Letter Details:
- From: {data['fromName']}, {data['fromAddress']}
- Date: {current_date}
- To: {data['toRecipient']}
- Subject: {data['subject']}
- Opening Connotation: {data['openingConnotation']}
- Main Matter: {data['mainMatter']}
- Additional Matter: {data['additionalMatter'] if 'additionalMatter' in data and data['additionalMatter'] else "None"}
- Closing Connotation: {data['closingConnotation']}
- Tone: {data['tone']}
- Length: {data['length']}
- Language: {data['language']}

Instructions:
1. Format as a professional formal letter with proper structure
2. Include sender's address at top-left
3. Include date at top-right
4. Include recipient's address after date
5. Use proper salutation with {data['openingConnotation']}
6. Write the body in clear, professional paragraphs
7. Address main matter: {data['mainMatter']}
8. {f"Include additional matter: {data['additionalMatter']}" if 'additionalMatter' in data and data['additionalMatter'] else "No additional matter"}
9. Use {data['tone'].lower()} tone throughout
10. Make it {data['length'].lower()} in length
11. End with {data['closingConnotation']} and signature
12. Write in {data['language']}
13. Ensure proper formatting with spacing and structure
14. Make it ready for immediate use

Format the letter professionally with proper spacing and structure. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    elif letter_type == "informal-letter":
        return f"""You are my Personal Letter Writing Assistant.

Letter Details:
- To: {data['toWhom']}
- Purpose: {data['purpose']}
- Tone: {data['tone']}
- Language: {data['language'] if 'language' in data and data['language'] else "English"}

Instructions:
1. Format as a warm, personal letter
2. Include today's date: {current_date}
3. Use friendly greeting appropriate for {data['toWhom']}
4. Write naturally about the purpose: {data['purpose']}
5. Use {data['tone'].lower()} tone throughout
6. Keep it conversational and heartfelt
7. Include appropriate personal closing
8. Write in {data['language'] if 'language' in data and data['language'] else "English"}
9. Make it feel genuine and personal
10. Ensure proper letter structure with spacing

Format the letter warmly and naturally. Remove all introductory paragraph, end notes and any other non-relevant content."""
    
    else:
        return f"""You are my Letter Writing Assistant.

Letter Details:
- Type: {letter_type}
- Data: {data}
- Date: {current_date}

Instructions:
1. Generate an appropriate letter based on the provided details
2. Follow proper letter formatting and structure
3. Ensure professional and clear communication
4. Include date and proper salutations
5. Make it ready for immediate use

Format the letter professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content."""

