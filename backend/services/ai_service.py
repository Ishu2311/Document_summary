import os
import json
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Initialize Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def analyze_document(text, length="Medium"):
    prompt = f"""
Analyze this document.

Summary Length: {length}

Return ONLY valid JSON in this exact format:

{{
  "summary": "...",
  "key_points": ["...", "..."],
  "suggestions": ["...", "..."]
}}

Document:
{text[:4000]}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        cleaned = (
            response.text.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # If Gemini returns plain text instead of JSON
            return {
                "summary": cleaned,
                "key_points": [],
                "suggestions": []
            }

    except Exception as e:
        raise Exception(f"Gemini API Error: {str(e)}")