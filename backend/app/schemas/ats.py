from pydantic import BaseModel


class ATSRequest(BaseModel):
    resume: str
    job_description: str = ""
    company: str | None = None