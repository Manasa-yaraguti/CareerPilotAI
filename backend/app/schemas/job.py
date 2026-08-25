from pydantic import BaseModel


class JobRecommendationRequest(BaseModel):
    resume: str