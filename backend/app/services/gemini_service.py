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
            return self._mock_extract_intent(message, conversation_history)

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
            return self._mock_extract_intent(message, conversation_history)


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
        message: str,
        conversation_history: list = None
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
            "language": "hi" if any("ऀ" <= c <= "ॿ" for c in message) else "en",
            "missing_fields": [],
            "follow_up_question": None,
            "confidence": 0.5
        }

        # Collect full history context
        history = conversation_history or []
        all_user_messages = [item.get("content", "") for item in history if item.get("role") == "user"]
        all_user_messages.append(message)
        combined_user_text = " ".join(all_user_messages).lower()

        # Find the last question asked by the assistant if any
        last_assistant_msg = ""
        for item in reversed(history):
            if item.get("role") in ("assistant", "system"):
                last_assistant_msg = item.get("content", "").lower()
                break

        msg = message.lower()

        # Helper to extract numbers (handles 5 lakh, 5l, 5,00,000, 50k, etc.)
        def extract_amounts(text: str):
            amounts = []
            # crore
            for m in re.finditer(r'(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)', text):
                amounts.append(float(m.group(1)) * 10000000)
            # lakh / lac / l
            for m in re.finditer(r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|\bl\b)', text):
                amounts.append(float(m.group(1)) * 100000)
            # thousands (k)
            for m in re.finditer(r'(\d+(?:\.\d+)?)\s*k\b', text):
                amounts.append(float(m.group(1)) * 1000)
            # plain numbers like 500000, 50,000
            for m in re.finditer(r'(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})+|\d{4,9})', text):
                clean_num = m.group(1).replace(',', '')
                amounts.append(float(clean_num))
            return amounts

        # Detect purpose from combined context
        if any(w in combined_user_text for w in ["business", "shop", "startup", "enterprise", "tailor", "retail", "store", "manufacturing"]):
            result["purpose"] = "business"
        elif any(w in combined_user_text for w in ["farm", "dairy", "agriculture", "farming", "poultry", "fishery", "crop", "cattle"]):
            result["purpose"] = "agriculture"
        elif any(w in combined_user_text for w in ["education", "college", "university", "study", "student", "course", "fees", "school"]):
            result["purpose"] = "education"
        elif any(w in combined_user_text for w in ["house", "housing", "home", "construction", "renovation", "property"]):
            result["purpose"] = "housing"

        # Detect specific business types
        for bt in ["tailoring", "dairy", "poultry", "retail", "grocery", "manufacturing", "repair", "handicraft"]:
            if bt in combined_user_text:
                result["business_type"] = bt
                if not result["purpose"]:
                    result["purpose"] = "business"

        # Contextual amount extraction
        curr_amounts = extract_amounts(msg)
        all_amounts = extract_amounts(combined_user_text)

        # Check if the user is answering an income question
        is_answering_income = any(w in last_assistant_msg for w in ["income", "earning", "annual income"]) or any(w in msg for w in ["income", "earn", "salary", "per year", "annual"])
        is_answering_loan = any(w in last_assistant_msg for w in ["loan", "assistance", "how much"]) or any(w in msg for w in ["loan", "borrow", "need", "budget", "cost"])

        if is_answering_income and curr_amounts:
            result["annual_income"] = curr_amounts[0]
        elif is_answering_loan and curr_amounts:
            result["loan_amount"] = curr_amounts[0]
        elif len(curr_amounts) == 1:
            # Single amount in message
            if is_answering_income:
                result["annual_income"] = curr_amounts[0]
            elif not result["purpose"]:
                result["loan_amount"] = curr_amounts[0]
            elif result["loan_amount"] is None:
                result["loan_amount"] = curr_amounts[0]
            else:
                result["annual_income"] = curr_amounts[0]

        # Look across all past messages to restore fields if missing
        if result["annual_income"] is None:
            income_matches = re.search(r'(?:income|salary|earn(?:ing)?s?)\s*(?:is|of|:)?\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?\s*(?:lakh|lac|k)?|\d+)', combined_user_text)
            if income_matches:
                inc_vals = extract_amounts(income_matches.group(0))
                if inc_vals:
                    result["annual_income"] = inc_vals[0]

        if result["loan_amount"] is None:
            loan_matches = re.search(r'(?:loan|need|borrow|amount|budget|cost)\s*(?:is|of|:)?\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?\s*(?:lakh|lac|k|cr)?|\d+)', combined_user_text)
            if loan_matches:
                loan_vals = extract_amounts(loan_matches.group(0))
                if loan_vals:
                    result["loan_amount"] = loan_vals[0]
            elif all_amounts and (result["annual_income"] is None or all_amounts[0] != result["annual_income"]):
                result["loan_amount"] = all_amounts[0]

        if result["loan_amount"] and not result["project_cost"]:
            result["project_cost"] = result["loan_amount"]

        # Age detection
        age_match = re.search(r'\b(?:age|years old)\s*(?:is|:)?\s*(\d{2})\b', combined_user_text)
        if age_match:
            try:
                result["age"] = int(age_match.group(1))
            except ValueError:
                pass

        # Smart contextual follow-up questions
        if not result["purpose"]:
            result["missing_fields"].append("purpose")
            result["follow_up_question"] = "What would you like financial assistance for? (e.g., Business, Agriculture, Education, or Housing)"
        elif not result["loan_amount"]:
            result["missing_fields"].append("loan_amount")
            result["follow_up_question"] = f"Approximately how much loan do you require for your {result['purpose']}? (e.g., Rs. 2 lakh, Rs. 5 lakh)"
        elif not result["annual_income"]:
            result["missing_fields"].append("annual_income")
            result["follow_up_question"] = "Got it! Could you tell me your approximate annual income? This helps match the eligibility criteria of government schemes."
        else:
            result["follow_up_question"] = "Thank you! I have all your details. You can now click 'Check Eligible Schemes' below to see the best matching options for you."

        return result


gemini_service = GeminiService()