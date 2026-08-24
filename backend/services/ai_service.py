import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
{text[:12000]}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
    )

    cleaned = response.choices[0].message.content
    cleaned = cleaned.replace("```json", "").replace("```", "").strip()

    return json.loads(cleaned)