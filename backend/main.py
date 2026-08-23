from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from services.pdf_service import extract_pdf_text
from services.ocr_service import extract_image_text
from services.ai_service import analyze_document
import os
import shutil

app = FastAPI(title="DocuLens AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "DocuLens AI Backend Running"}


@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    if file.filename.lower().endswith(".pdf"):
        text = extract_pdf_text(file_path)
    else:
        text = extract_image_text(file_path)

    # AI analysis
    try:
        result = analyze_document(text)

        return {
            "success": True,
            "filename": file.filename,
            "text_preview": text[:300],
            **result
        }

    except Exception as e:
        return {
            "success": False,
            "error": repr(e),
            "filename": file.filename,
            "text_preview": text[:300]
        }