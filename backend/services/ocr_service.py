import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_image_text(path):
    # Detect image type
    ext = os.path.splitext(path)[1].lower()
    mime_type = "image/png" if ext == ".png" else "image/jpeg"

    with open(path, "rb") as f:
        image_bytes = f.read()

    response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=[
        "Extract all text from this image exactly as written. Return only the extracted text.",
        {
            "mime_type": mime_type,
            "data": image_bytes,
        },
    ],
)

    return response.text