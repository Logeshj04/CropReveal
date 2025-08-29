import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

# Validate API key
if not API_KEY:
    print("WARNING: OPENROUTER_API_KEY not found in environment variables")
    print("Available environment variables:", list(os.environ.keys()))
else:
    print(f"API Key loaded successfully: {API_KEY[:10]}...")

def build_prompt(label: str, language: str = "English", followup_question: str = None) -> str:
    crop_disease = label.replace("___", " - ").replace("_", " ")
    prompt = f"""You are an expert agricultural assistant. 
Answer only if the question is related to agriculture. Ignore other topics.

Provide detailed information about the following crop disease in proper markdown format:

**Disease Name:** {crop_disease}

Please structure your response with clear markdown formatting:

## Cause
[Explain what causes this disease]

## Symptoms
- [List key symptoms with bullet points]
- [Include visual indicators]
- [Mention progression stages]

## Control Methods
### Cultural Control
- [List cultural practices]
- [Sanitation methods]

### Chemical Control
- [Recommended pesticides/fungicides]
- [Application methods]
- [Safety precautions]

## Prevention Advice
- [Preventive measures]
- [Best practices]
- [Resistant varieties if available]

## Treatment Recommendations
1. [Step-by-step treatment process]
2. [Timing considerations]
3. [Follow-up actions]

Please provide practical, actionable advice that farmers can implement immediately."""

    if followup_question:
        prompt += f"\n\n**Additional Question:** {followup_question}\n\nPlease also address this specific concern in your response."

    if language.lower() == "tamil":
        prompt += "\n\n**Important:** Respond only in Tamil language."
    elif language.lower() == "telugu":
        prompt += "\n\n**Important:** Respond only in Telugu language."
    elif language.lower() == "kannada":
        prompt += "\n\n**Important:** Respond only in Kannada language."
    elif language.lower() == "malayalam":
        prompt += "\n\n**Important:** Respond only in Malayalam language."

    return prompt

def get_disease_info(label: str, language="English", followup_question=None) -> str:
    try:
        if not API_KEY:
            return "LLM Error: OpenRouter API key not configured. Please check environment variables."
        
        llm = ChatOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=API_KEY,
            model="openai/gpt-4o-mini"
        )
        prompt = build_prompt(label, language, followup_question)
        return llm.invoke(prompt).content
    except Exception as e:
        return f"LLM Error: {str(e)}"

def ask_general_agri_question(query: str, language: str = "English") -> str:
    try:
        if not API_KEY:
            return "LLM Error: OpenRouter API key not configured. Please check environment variables."
        
        llm = ChatOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=API_KEY,
            model="openai/gpt-4o-mini"
        )
        prompt = f"""You are an expert agricultural assistant.
Only answer agricultural questions.

Question: {query}

Respond in {language}."""
        return llm.invoke(prompt).content
    except Exception as e:
        return f"LLM Error: {str(e)}"