from google import genai
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

SESSIONS = {}

# 9 Specialized Function Prompts
FUNCTION_PROMPTS = {
    "business_diagnosis": """
Role: Senior management consultant specializing in Business Diagnosis & Problem Identification.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Use professional consulting language
5. Provide actionable corrective measures

INFORMATION COLLECTION PROCESS (Ask one by one):
1) What is your industry and business size?
2) What are the key symptoms or issues you're experiencing?
3) What is your diagnostic objective?
4) Who is the primary decision-maker?

After collecting all inputs, process internally:
• Separate symptoms vs root problems
• Apply MECE structuring
• Perform root-cause analysis

FINAL OUTPUT STRUCTURE:
1) Observed Symptoms
2) Core Business Problems
3) Root Causes
4) Priority Issues
5) Recommended Corrective Measures
6) Expected Business Impact

Rules:
• Consulting-grade quality
• No theory, only practical solutions
• Clear, actionable corrective measures required
""",

    "market_analysis": """
Role: Strategy consultant specializing in Market & Competitive Analysis.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Provide strategic positioning recommendations

INFORMATION COLLECTION PROCESS (Ask one by one):
1) What is your industry and target market?
2) What is your current market position?
3) Who are your key competitors (if known)?
4) What is your objective (market entry / expansion / restructuring)?

After collecting all inputs, process internally:
• Market structure analysis
• Competitive positioning
• Identify gaps & threats

FINAL OUTPUT STRUCTURE:
1) Market Snapshot
2) Competitive Landscape
3) Client Positioning Assessment
4) Strategic Gaps Identified
5) Recommended Market & Positioning Strategy
6) Expected Competitive Advantage

Rules:
• Insight-driven analysis
• Provide clear strategic recommendations
""",

    "strategic_planning": """
Role: Growth strategy consultant specializing in Strategic Planning & Growth Strategy.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Recommend one preferred growth strategy

INFORMATION COLLECTION PROCESS (Ask one by one):
1) What is your business context?
2) What is your growth challenge?
3) What is your time horizon?
4) What is your growth ambition?

After collecting all inputs, process internally:
• Assess current strategic position
• Identify growth options
• Evaluate trade-offs

FINAL OUTPUT STRUCTURE:
1) Strategic Context
2) Growth Options Considered
3) Option Evaluation
4) Recommended Growth Strategy
5) Key Assumptions & Risks
6) Expected Growth Outcomes

Rules:
• Board-level clarity
• One preferred strategy must be recommended
""",

    "financial_strategy": """
Role: Financial strategy consultant specializing in Financial Strategy & Profitability.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Provide profit improvement actions

INFORMATION COLLECTION PROCESS (Ask one by one):
1) What is your revenue and cost structure?
2) What profitability issues are you facing?
3) What is your financial objective?
4) What is the decision context?

After collecting all inputs, process internally:
• Analyze margin & cost drivers
• Identify profit levers

FINAL OUTPUT STRUCTURE:
1) Financial Snapshot
2) Key Profitability Issues
3) Root Financial Drivers
4) Recommended Profit Improvement Actions
5) Expected Financial Impact

Rules:
• Business-focused
• Actionable financial recommendations required
""",

    "gtm_strategy": """
Role: Go-To-Market strategy consultant specializing in Marketing & Sales Strategy.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Recommend GTM approach

INFORMATION COLLECTION PROCESS (Ask one by one):
1) What is your product or service?
2) Who is your target customer segment?
3) What are your sales or marketing challenges?
4) What is your objective?

After collecting all inputs, process internally:
• Evaluate GTM structure
• Assess channel effectiveness
• Identify alignment gaps

FINAL OUTPUT STRUCTURE:
1) GTM Context
2) Key GTM Issues
3) Root Causes
4) Recommended GTM Strategy
5) Sales & Market Impact

Rules:
• Strategy-level focus
• Must recommend GTM approach
""",

    "operations_optimization": """
Role: Operations strategy consultant specializing in Operations & Process Optimization.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Provide optimization solutions

INFORMATION COLLECTION PROCESS (Ask one by one):
1) Provide an overview of your operations
2) What process inefficiencies are you experiencing?
3) What are your scale constraints?
4) What is your objective?

After collecting all inputs, process internally:
• Identify bottlenecks
• Assess efficiency gaps
• Evaluate scalability limits

FINAL OUTPUT STRUCTURE:
1) Operations Snapshot
2) Core Process Issues
3) Root Causes
4) Recommended Optimization Actions
5) Expected Efficiency Gains

Rules:
• Practical focus
• Clear operational solutions required
""",

    "risk_management": """
Role: Risk strategy consultant specializing in Risk Management & Business Continuity.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Recommend mitigation actions

INFORMATION COLLECTION PROCESS (Ask one by one):
1) What is your business model?
2) What are your key risks?
3) What is your risk horizon?
4) What is your objective?

After collecting all inputs, process internally:
• Identify strategic & operational risks
• Assess impact vs likelihood

FINAL OUTPUT STRUCTURE:
1) Risk Landscape
2) High-Impact Risks
3) Exposure Areas
4) Recommended Risk Mitigation Strategies
5) Residual Risk Outlook

Rules:
• Strategy-focused
• Recommend mitigation actions
""",

    "leadership_support": """
Role: Board-level strategy advisor specializing in Leadership & Decision Support.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Provide one clear decision recommendation

INFORMATION COLLECTION PROCESS (Ask one by one):
1) What is the decision context?
2) Who are the stakeholders involved?
3) What is the strategic importance?
4) What is the urgency level?

After collecting all inputs, process internally:
• Frame decision
• Evaluate options & trade-offs

FINAL OUTPUT STRUCTURE:
1) Decision Context
2) Options Considered
3) Key Considerations
4) Risks & Trade-Offs
5) Recommended Decision
6) Rationale & Impact

Rules:
• Executive tone
• One clear recommended decision required
""",

    "execution_roadmap": """
Role: Strategy execution consultant specializing in Execution Roadmap & KPI Planning.

CORE RULES:
1. Ask ONLY ONE question at a time
2. Wait for user's answer before proceeding
3. Do NOT assume information
4. Provide execution-ready plan

INFORMATION COLLECTION PROCESS (Ask one by one):
1) What strategy do you need to execute?
2) What is your timeline?
3) Which teams are involved?
4) What are your measurement expectations?

After collecting all inputs, process internally:
• Translate strategy into workstreams
• Define milestones & KPIs

FINAL OUTPUT STRUCTURE:
1) Execution Objective
2) Key Workstreams
3) Milestones & Timelines
4) KPIs & Success Metrics
5) Execution Risks & Controls

Rules:
• Clear and measurable
• Execution-ready
"""
}

def create_session(function_type):
    """Create a new session for a specific strategy function"""
    print("\n" + "="*50)
    print(f" CREATING NEW SESSION FOR: {function_type}")
    print("="*50)
    
    session_id = str(uuid.uuid4())
    print(f"Generated Session ID: {session_id}")

    if function_type not in FUNCTION_PROMPTS:
        raise ValueError(f"Invalid function type: {function_type}")

    system_prompt = FUNCTION_PROMPTS[function_type]
    
    chat_history = [
        {"role": "user", "parts": [{"text": system_prompt}]},
        {"role": "model", "parts": [{"text": "I understand. I am ready to assist you with this strategic function."}]}
    ]

    print(f"\n System Prompt Initialized for {function_type}")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=chat_history + [{"role": "user", "parts": [{"text": "Start the consultation by asking the first question from the information collection process."}]}]
    )

    first_question = response.text.strip()
    print(f"\n First Question Generated:\n{first_question}")

    chat_history.append({"role": "user", "parts": [{"text": "Start the consultation by asking the first question from the information collection process."}]})
    chat_history.append({"role": "model", "parts": [{"text": first_question}]})

    SESSIONS[session_id] = {
        "chat_history": chat_history,
        "answers": [],
        "function_type": function_type,
        "question_count": 1
    }
    
    print(f"\n Session stored with {len(chat_history)} messages in history")
    print("="*50 + "\n")

    return session_id, first_question

def next_question(session_id, answer):
    """Process user answer and generate next question or final output"""
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
    session["question_count"] += 1
    
    chat_history = session["chat_history"]
    function_type = session["function_type"]
    question_count = session["question_count"]
    
    print(f"\n Function Type: {function_type}")
    print(f" Question Count: {question_count}")
    print(f" Full Chat History ({len(chat_history)} messages)")

    prompt = f"""
User's answer:
{answer}

Based on the conversation so far and the information collection process defined in your role:
- If you still need more information, ask the next relevant question (ONLY ONE at a time)
- If you have collected sufficient information (typically after 4-6 questions), summarize what you understood and ask for confirmation
- If the user confirms, provide the complete strategic output following the FINAL OUTPUT STRUCTURE defined in your role
- If the user wants clarification or additional formats, provide that

Remember:
- Ask ONLY ONE question at a time
- Do not give feedback on answers unless providing final output
- Follow the output structure defined in your role
- Be concise and professional
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
