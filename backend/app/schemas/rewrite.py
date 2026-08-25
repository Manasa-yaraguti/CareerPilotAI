from pydantic import BaseModel

class RewriteResume(BaseModel):
    email: str
    resume: str
    filename: str = "resume.pdf"