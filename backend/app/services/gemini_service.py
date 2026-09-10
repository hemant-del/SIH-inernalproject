import json
import re
import google.generativeai as genai
from app.core.config import settings


class GeminiService:

    def __init__(self):
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None


    async def extract_intent(
        self,
        message: str,
        language: str = 'en',
        conversation_history: list = None
    ) -> dict:

        if not self.model:
            return self._mock_extract_intent(message)

        # Build conversation context
        history_text = ""

        if conversation_history:
            recent_history = conversation_history[-10:]

            for item in recent_history:
                role = item.get("role", "user")
                content = item.get("content", "")

                if content:
                    history_text += f"{role.upper()}: {content}\n"

        prompt = f"""
You are CreditGPS AI Navigator.

Your job is to understand a user's financial needs related to
government credit schemes, education loans, business loans,
agriculture loans, subsidies, and financial assistance.

You are having a conversation with the user.

IMPORTANT RULES:

- Use previous conversation context.
- Do NOT forget information already provided by the user.
- If the user answers a previous question, update that specific field.
- Do NOT ask repeatedly for information already provided.
- Extract numbers intelligently.
- Understand Indian currency values:
  "5 lakh" = 500000
  "10 lakh" = 1000000
  "2 crore" = 20000000
- Ask only ONE useful follow-up question at a time.
- Do not force users to provide unnecessary information.
- Respond in the requested language.

CONVERSATION HISTORY:

{history_text}

CURRENT USER MESSAGE:

{message}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "purpose": null,
    "business_type": null,
    "loan_amount": null,
    "project_cost": null,
    "annual_income": null,
    "age": null,
    "education_status": null,
    "state": null,
    "district": null,
    "language": "{language}",
    "missing_fields": [],
    "follow_up_question": null,
    "confidence": 0.0
}}

FIELD RULES:

purpose:
Possible values include:
business, agriculture, education, housing, self_employment, equipment

business_type:
Specific business if mentioned.

Examples:
dairy farming, grocery shop, manufacturing, tailoring, poultry

loan_amount:
Requested loan amount as a number in INR.

project_cost:
Total project cost as a number in INR.

annual_income:
Annual income as a number in INR.

age:
Integer.

missing_fields:
Only include genuinely important missing fields.
Do not mark every field as mandatory.

follow_up_question:
Ask ONE natural contextual question.
Do not repeat questions already answered.

confidence:
Number between 0 and 1.
"""

        try:
            response = self.model.generate_content(prompt)

            content = (
                response.text
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            result = json.loads(content)

            return result

        except Exception as e:
            print(f"Gemini Error: {str(e)}")
            return self._mock_extract_intent(message)


    async def explain_recommendation(
        self,
        scheme: dict,
        user_profile: dict,
        language: str = 'en'
    ) -> str:

        if not self.model:
            return (
                f"The scheme '{scheme['name']}' is recommended "
                f"because it matches your purpose and loan requirements."
            )

        prompt = (
            f"Explain why the scheme '{scheme['name']}' is a good fit "
            f"for a user with profile {user_profile}. "
            f"Language: {language}"
        )

        try:
            response = self.model.generate_content(prompt)
            return response.text

        except Exception:
            return "This scheme fits your profile."


    async def generate_project_report(
        self,
        business_data: dict
    ) -> dict:

        if not self.model:
            return {
                "executive_summary": "Draft summary...",
                "business_description": (
                    f"Business Type: "
                    f"{business_data.get('business_type')}"
                ),
                "investment_breakdown": (
                    "Equipment and working capital..."
                ),
                "equipment_requirements": (
                    "List of required machinery..."
                ),
                "operating_expenses": (
                    "Monthly running costs..."
                ),
                "revenue_projection": (
                    "Estimated sales..."
                ),
                "profit_estimate": (
                    "Projected margins..."
                ),
                "risks": "Market risks...",
                "loan_requirement": str(
                    business_data.get('loan_amount', 0)
                )
            }

        prompt = (
            "Generate a structured project report for the following "
            f"business: {json.dumps(business_data)}. "
            "Return ONLY JSON with keys: "
            "executive_summary, business_description, "
            "investment_breakdown, equipment_requirements, "
            "operating_expenses, revenue_projection, "
            "profit_estimate, risks, loan_requirement. "
            "All numbers clearly labeled as ESTIMATES."
        )

        try:
            response = self.model.generate_content(prompt)

            content = (
                response.text
                .replace('```json', '')
                .replace('```', '')
                .strip()
            )

            return json.loads(content)

        except Exception as e:
            print(f"Project Report Error: {str(e)}")
            return {}


    def _mock_extract_intent(
        self,
        message: str
    ) -> dict:

        result = {
            "purpose": None,
            "business_type": None,
            "loan_amount": None,
            "project_cost": None,
            "annual_income": None,
            "age": None,
            "education_status": None,
            "state": None,
            "district": None,
            "language": (
                "hi"
                if any("ऀ" <= c <= "ॿ" for c in message)
                else "en"
            ),
            "missing_fields": [],
            "follow_up_question": None,
            "confidence": 0.3
        }

        msg = message.lower()

        # Detect purpose
        if any(word in msg for word in [
            "business",
            "shop",
            "startup",
            "enterprise"
        ]):
            result["purpose"] = "business"

        elif any(word in msg for word in [
            "farm",
            "dairy",
            "agriculture",
            "farming",
            "poultry"
        ]):
            result["purpose"] = "agriculture"

        elif any(word in msg for word in [
            "education",
            "college",
            "university",
            "study",
            "student"
        ]):
            result["purpose"] = "education"

        # Extract lakh amount
        lakh_match = re.search(
            r'(\d+(?:\.\d+)?)\s*lakh',
            msg
        )

        if lakh_match:
            result["loan_amount"] = (
                float(lakh_match.group(1)) * 100000
            )

        # Extract crore amount
        crore_match = re.search(
            r'(\d+(?:\.\d+)?)\s*crore',
            msg
        )

        if crore_match:
            result["loan_amount"] = (
                float(crore_match.group(1)) * 10000000
            )

        # Intelligent follow-up
        if not result["purpose"]:

            result["missing_fields"].append("purpose")

            result["follow_up_question"] = (
                "What would you like financial assistance for?"
            )

        elif not result["loan_amount"]:

            result["missing_fields"].append("loan_amount")

            result["follow_up_question"] = (
                "Approximately how much loan or financial assistance "
                "do you need?"
            )

        else:

            result["follow_up_question"] = (
                "Got it. Could you tell me your approximate annual "
                "income so I can recommend suitable schemes?"
            )

        return result


gemini_service = GeminiService()