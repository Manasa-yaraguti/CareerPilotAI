from app.data.skills import TECHNICAL_SKILLS, SOFT_SKILLS


def extract_skills(resume_text: str):

    resume = resume_text.lower()

    technical = []
    soft = []

    for skill in TECHNICAL_SKILLS:
        if skill.lower() in resume:
            technical.append(skill)

    for skill in SOFT_SKILLS:
        if skill.lower() in resume:
            soft.append(skill)

    return {
        "technical_skills": technical,
        "soft_skills": soft
    }