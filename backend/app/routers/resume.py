from fastapi import APIRouter, UploadFile, File
import shutil
import os
from app.ats.pdf_parser import extract_text_from_pdf
from app.services.ats_service import calculate_ats_score
from app.ats.resume_parser import parse_resume
router = APIRouter()

UPLOAD_FOLDER = "app/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_pdf(file_path)
    ats = calculate_ats_score(extracted_text)

    return {
    "message": "Resume uploaded successfully",
    "filename": file.filename,
    "ats_score": ats["score"],
    "suggestions": ats["suggestions"]
}