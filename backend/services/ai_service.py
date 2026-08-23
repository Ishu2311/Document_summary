import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_document(text, length="Medium"):
    prompt = f"""
Analyze this document.

Summary Length: {length}

Return ONLY valid JSON in this format:

{{
  "summary": "...",
  "key_points": ["..."],
  "suggestions": ["..."]
}}

Document:
{text[:4000]}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    cleaned = response.text.replace("```json", "").replace("```", "").strip()

    return json.loads(cleaned)