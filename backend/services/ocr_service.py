from PIL import Image
import pytesseract
import os

# Windows Tesseract installation path
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def extract_image_text(path):
    image = Image.open(path)
    return pytesseract.image_to_string(image)