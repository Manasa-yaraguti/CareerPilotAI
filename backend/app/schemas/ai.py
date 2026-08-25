from pydantic import BaseModel

class AIResumeRequest(BaseModel):
    resume: str