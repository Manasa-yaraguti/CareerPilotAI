from datetime import datetime
from app.models.resume import Resume


def save_resume(
    db,
    email,
    filename,
    resume_text,
    score,
    company
):
    resume = Resume(
        user_email=email,
        filename=filename,
        resume_text=resume_text,
        ats_score=score,
        company=company,
        created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume