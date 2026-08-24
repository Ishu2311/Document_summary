from PIL import Image
import pytesseract
import os

# Use Windows path locally
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.name == "nt" and os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def extract_image_text(path):
    image = Image.open(path)
    return pytesseract.image_to_string(image)