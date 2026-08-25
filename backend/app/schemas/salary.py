from pydantic import BaseModel


class SalaryPredictionRequest(BaseModel):
    role: str
    experience: int