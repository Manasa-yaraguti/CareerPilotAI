from pydantic import BaseModel


class CompanyATSRequest(BaseModel):

    resume: str

    company: str = "generic"