from pydantic import BaseModel


class CareerRoadmapRequest(BaseModel):
    career: str