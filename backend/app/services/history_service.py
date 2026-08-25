from app.models.resume import Resume


def get_resume_history(db, email):
    resumes = db.query(Resume).filter(
        Resume.user_email == email
    ).order_by(Resume.id.desc()).all()

    return [
        {
            "id": resume.id,
            "filename": resume.filename or "resume.pdf",
            "ats_score": resume.ats_score,
            "company": resume.company,
            "created_at": resume.created_at,
        }
        for resume in resumes
    ]