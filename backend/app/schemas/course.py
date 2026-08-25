from pydantic import BaseModel


class CourseRecommendationRequest(BaseModel):

    missing_skills: list[str]