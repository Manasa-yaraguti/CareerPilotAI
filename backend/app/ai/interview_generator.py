from app.data.interview_questions import INTERVIEW_QUESTIONS


def generate_interview(job_role: str):

    if job_role not in INTERVIEW_QUESTIONS:

        return {
            "error": "Job role not available."
        }

    return INTERVIEW_QUESTIONS[job_role]