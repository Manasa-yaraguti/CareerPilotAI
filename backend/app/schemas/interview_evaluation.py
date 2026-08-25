from pydantic import BaseModel


class InterviewEvaluationRequest(BaseModel):
    question: str
    answer: str