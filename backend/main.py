from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from services.pdf_service import extract_pdf_text
from services.ocr_service import extract_image_text
from services.ai_service import analyze_document
import os
import shutil

app = FastAPI(title="DocuLens AI API")

# Allow requests from local React app and deployed frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://document-summary-frontend-sl1q.onrender.com",
        "https://documentsummary-iw6tky6kk-ishu25.vercel.app"
    ],
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
async def analyze(
    file: UploadFile = File(...),
    length: str = Form("Medium")
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text
        if file.filename.lower().endswith(".pdf"):
            text = extract_pdf_text(file_path)
        else:
            text = extract_image_text(file_path)

        # Check if text was extracted
        if not text or not text.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in the uploaded document."
            )

        # Generate AI summary with selected length
        result = analyze_document(text, length)

        return {
            "success": True,
            "filename": file.filename,
            "summary_length": length,
            "text_preview": text[:300],
            "summary": result.get("summary", ""),
            "key_points": result.get("key_points", []),
            "suggestions": result.get("suggestions", [])
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"AI ERROR: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)