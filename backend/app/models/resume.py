from sqlalchemy import Column, Integer, String, Text, Float
from app.database.database import Base


class Resume(Base):

    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    user_email = Column(String, index=True)

    filename = Column(String)

    resume_text = Column(Text)

    ats_score = Column(Float)

    company = Column(String)

    created_at = Column(String)