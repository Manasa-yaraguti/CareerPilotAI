from pydantic import BaseModel


class ResumeMatchRequest(BaseModel):

    resume: str

    job_description: str