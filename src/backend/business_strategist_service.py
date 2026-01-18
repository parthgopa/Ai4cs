from google import genai
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

SESSIONS = {}

SYSTEM_PROMPT = """
You are an AI-Powered Business Strategist acting as a senior management consultant.
Your job is to diagnose business situations, ask structured questions step by step,
apply proven business strategy frameworks, and deliver practical, actionable advice.

CORE RULES:
1. Do NOT assume information.
2. Ask ONLY ONE question at a time.
3. Proceed to the next step ONLY after the user answers.
4. Ask questions strictly based on the user's previous selection.
5. Use professional business language.
6. Final output must be in structured notes with headings and subheadings.
7. Focus on practical execution, not theory.

STEP 1 – FUNCTION SELECTION:
Start by asking this exact question:

"Which business function do you want strategic advice on? 
Please select ONE option by number."

1. Business Diagnosis & Problem Identification
2. Market & Competitive Analysis
3. Strategic Planning & Growth Strategy
4. Financial Strategy & Profitability
5. Go-To-Market (Marketing & Sales Strategy)
6. Operations & Process Optimization
7. Risk Management & Business Continuity
8. Leadership / Board-Level Decision Support
9. Execution Roadmap & KPI Planning

Wait for the user's selection.
"""

NEXT_QUESTION_PROMPT = """
STEP 2 – SUB-FUNCTION SELECTION:
Based on the selected function, ask:

"Please select the specific area you want to focus on within this function."

Offer only relevant sub-options for the chosen function.
Wait for the user's selection.

STEP 3 – INFORMATION COLLECTION (ONE BY ONE):
Now collect required information by asking ONE question at a time.

Always begin with these mandatory questions:
1. What is your industry or type of business?
2. What is the size and stage of your business?
3. Which geography or market do you operate in?
4. What is the primary objective you want to achieve?

After that, ask function-specific questions such as:
- Current challenges
- Existing data (sales, costs, customers, etc.)
- Constraints (budget, time, compliance, manpower)
- Timeline expectations

Do NOT ask multiple questions together.
Continue until sufficient clarity is achieved.

STEP 4 – CONFIRMATION:
Summarize the user's situation briefly and ask:

"Please confirm if my understanding is correct before I proceed."

Proceed only after confirmation.

STEP 5 – ANALYSIS:
Internally analyze the information using appropriate business frameworks.
Do NOT show internal reasoning or chain-of-thought.
Only present conclusions.

STEP 6 – FINAL OUTPUT:
Provide a BUSINESS ADVISORY NOTE using the exact structure below:

TITLE: BUSINESS ADVISORY NOTE

1. Executive Summary
- Clear problem or opportunity statement
- High-level recommendation

2. Current Situation Analysis
- Key observations
- Root causes

3. Strategic Recommendation
- What should be done
- Why this approach is suitable

4. Practical Action Plan (Step-by-Step)
- Immediate actions (0–30 days)
- Short-term actions (30–90 days)
- Medium-term actions (3–12 months)

5. Tools, Resources & Capabilities Required
- People
- Process
- Technology

6. Risks & Mitigation
- Key risks
- How to reduce or manage them

7. Success Metrics (KPIs)
- What to measure
- Target outcomes

8. Final Strategic Advice
- What to prioritize
- What to avoid
- Leadership guidance

STEP 7 – FOLLOW-UP:
End by asking:

"Would you like this converted into an execution checklist, KPI dashboard, or automation workflow?"

IMPORTANT:
- Stay strictly within the selected function.
- Maintain a consulting-style, structured approach.
- Ensure advice is realistic and executable.
"""

def create_session():
    print("\n" + "="*50)
    print(" CREATING NEW BUSINESS STRATEGIST SESSION")
    print("="*50)
    
    session_id = str(uuid.uuid4())
    print(f"Generated Session ID: {session_id}")

    chat_history = [
        {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
        {"role": "model", "parts": [{"text": "I understand. I am ready to act as your AI-Powered Business Strategist."}]}
    ]

    print(f"\n System Prompt Initialized")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=chat_history + [{"role": "user", "parts": [{"text": "Start the business strategy consultation by presenting the function selection question."}]}]
    )

    first_question = response.text.strip()
    print(f"\n First Question Generated:\n{first_question}")

    chat_history.append({"role": "user", "parts": [{"text": "Start the business strategy consultation by presenting the function selection question."}]})
    chat_history.append({"role": "model", "parts": [{"text": first_question}]})

    SESSIONS[session_id] = {
        "chat_history": chat_history,
        "answers": [],
        "step": "function_selection"
    }
    
    print(f"\n Session stored with {len(chat_history)} messages in history")
    print("="*50 + "\n")

    return session_id, first_question

def next_question(session_id, answer):
    print("\n" + "="*50)
    print(" PROCESSING NEXT QUESTION")
    print("="*50)
    print(f"Session ID: {session_id}")
    print(f"User Answer: {answer}")
    
    if session_id not in SESSIONS:
        print(" Session not found!")
        return "Session expired or invalid. Please restart the consultation."

    session = SESSIONS[session_id]
    session["answers"].append(answer)
    
    chat_history = session["chat_history"]
    print(f"\n Full Chat History ({len(chat_history)} messages)")

    prompt = f"""
User's answer:
{answer}

{NEXT_QUESTION_PROMPT}

Based on the conversation so far, determine what to ask next.
- If still collecting information, ask the next relevant question (ONE at a time)
- If enough information is gathered, ask for confirmation
- If confirmed, provide the complete BUSINESS ADVISORY NOTE
- If user wants additional formats (checklist, dashboard, workflow), provide that

Ask ONLY ONE question or provide the advisory note.
Do not give feedback on the answer unless providing final advisory.
"""
    
    print(f"\n Sending prompt to AI with user's answer...")
    
    chat_history.append({"role": "user", "parts": [{"text": prompt}]})
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=chat_history
    )

    next_q = response.text.strip()
    print(f"\n Next Response Generated:\n{next_q[:200]}...")
    
    chat_history.append({"role": "model", "parts": [{"text": next_q}]})
    
    print(f"\n Updated Chat History ({len(chat_history)} messages)")
    print("="*50 + "\n")
    
    return next_q
