from app.data.company_skills import COMPANY_SKILLS


def match_company_skills(resume_text: str, company: str):

    company = company.lower()

    required_skills = COMPANY_SKILLS.get(company)

    if not required_skills:
        return {
            "company": company,
            "matched": [],
            "missing": [],
            "match_percentage": 0
        }

    resume = resume_text.lower()

    matched = []
    missing = []

    for skill in required_skills:

        if skill.lower() in resume:
            matched.append(skill)
        else:
            missing.append(skill)

    score = round(
        len(matched) / len(required_skills) * 100,
        2
    )

    return {
        "company": company,
        "matched": matched,
        "missing": missing,
        "match_percentage": score
    }