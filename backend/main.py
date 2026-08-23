from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.pdf_service import extract_pdf_text
from services.ocr_service import extract_image_text
from services.ai_service import analyze_document
import os
import shutil

app = FastAPI(title="DocuLens AI API")

# Allow requests from local React app and Render frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend-name.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "DocuLens AI Backend Running"
    }


@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
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

        # AI Analysis
        result = analyze_document(text)

        return {
            "success": True,
            "filename": file.filename,
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
        # Remove uploaded file after processing
        if os.path.exists(file_path):
            os.remove(file_path)