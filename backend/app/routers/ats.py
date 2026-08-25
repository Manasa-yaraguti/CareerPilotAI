import os
from app.ai.job_recommender import recommend_jobs
from app.schemas.job import JobRecommendationRequest
from fastapi import APIRouter, UploadFile, File
from app.ai.skill_gap_analyzer import analyze_skill_gap
from app.schemas.skill_gap import SkillGapRequest
from app.ats.pdf_parser import extract_text_from_pdf
from app.ats.resume_parser import parse_resume
from app.ats.ats_engine import calculate_ats_score
from app.ai.interview_generator import generate_interview
from app.schemas.interview import InterviewRequest
from app.schemas.ats import ATSRequest
from app.schemas.company_ats import CompanyATSRequest
from app.ai.gemini_analyzer import analyze_resume_ai
from app.schemas.ai import AIResumeRequest
from app.ai.resume_rewriter import rewrite_resume
from app.schemas.rewrite import RewriteResume
from app.ai.interview_evaluator import evaluate_answer
from app.schemas.interview_evaluation import InterviewEvaluationRequest
from app.ai.resume_job_match import analyze_resume_job_match
from app.schemas.resume_match import ResumeMatchRequest
from app.ai.career_roadmap import generate_career_roadmap
from app.schemas.career import CareerRoadmapRequest
from app.ai.salary_predictor import predict_salary
from app.schemas.salary import SalaryPredictionRequest
from app.ai.job_recommender import recommend_jobs
from app.schemas.job import JobRecommendationRequest
from app.ai.course_recommender import recommend_courses
from app.schemas.course import CourseRecommendationRequest
from app.services.history_service import get_resume_history
from app.database.database import get_db
from app.services.resume_service import save_resume 

from sqlalchemy.orm import Session
from fastapi import Depends
router = APIRouter()


# -----------------------------
# Upload Resume
# -----------------------------
@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    folder = "uploads"
    os.makedirs(folder, exist_ok=True)

    file_path = os.path.join(folder, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)
    resume = parse_resume(text)

    return {
        "filename": file.filename,
        "resume": resume
    }


# -----------------------------
# Generic ATS Score
# -----------------------------
@router.post("/calculate-score")
def calculate_score(data: ATSRequest):

    result = calculate_ats_score(
        resume_text=data.resume,
        job_description=data.job_description,
        company=data.company
    )

    return result


# -----------------------------
# Company ATS Score
# -----------------------------
@router.post("/company-score")
def company_score(data: CompanyATSRequest):

    result = calculate_ats_score(
        resume_text=data.resume,
        company=data.company
    )

    return result
@router.post("/ai-feedback")
def ai_feedback(data: AIResumeRequest):

    result = analyze_resume_ai(data.resume)

    return {
        "feedback": result
    }
@router.post("/rewrite-resume")
def rewrite(
    data: RewriteResume,
    db: Session = Depends(get_db)
):
    result = rewrite_resume(data.resume)

    score = calculate_ats_score(
        resume_text=data.resume
    )["overall_ats_score"]

    save_resume(
        db=db,
        email=data.email,
        filename=data.filename,
        resume_text=data.resume,
        score=score,
        company="General"
    )

    return {
        "rewritten_resume": result
    }
    # -----------------------------
# AI Job Recommendation
# -----------------------------
@router.post("/job-recommendation")
def job_recommendation(data: JobRecommendationRequest):

    result = recommend_jobs(data.resume)

    return {
        "recommended_jobs": result
    }
    # -----------------------------
# Skill Gap Analyzer
# -----------------------------
@router.post("/skill-gap")
def skill_gap(data: SkillGapRequest):

    result = analyze_skill_gap(
        data.resume,
        data.job_role
    )
    return result
    # -----------------------------
# AI Mock Interview
# -----------------------------
@router.post("/mock-interview")
def mock_interview(data: InterviewRequest):

    result = generate_interview(data.job_role)
    return {
        "questions": result
    }
@router.post("/evaluate-interview")
def evaluate(data: InterviewEvaluationRequest):

    result = evaluate_answer(
        data.question,
        data.answer
    )

    return {
        "evaluation": result
    }
# -----------------------------
# Resume vs Job Description
# -----------------------------
@router.post("/resume-match")
def resume_match(data: ResumeMatchRequest):

    result = analyze_resume_job_match(
        data.resume,
        data.job_description
    )
    return result
@router.post("/career-roadmap")
def career_roadmap(data: CareerRoadmapRequest):

    return generate_career_roadmap(data.career)

@router.post("/predict-salary")
def salary_prediction(data: SalaryPredictionRequest):

    return predict_salary(
        data.role,
        data.experience
    )

@router.post("/recommend-courses")
def recommend_course(data: CourseRecommendationRequest):

    return recommend_courses(
        data.missing_skills
    )
@router.get("/history/{email}")
def history(
    email: str,
    db: Session = Depends(get_db)
):

    return get_resume_history(
        db,
        email
    )

    