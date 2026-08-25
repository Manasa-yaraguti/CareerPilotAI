from pydantic import BaseModel


class SkillGapRequest(BaseModel):
    resume: str
    job_role: str