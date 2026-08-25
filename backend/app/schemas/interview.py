from pydantic import BaseModel


class InterviewRequest(BaseModel):
    job_role: str   