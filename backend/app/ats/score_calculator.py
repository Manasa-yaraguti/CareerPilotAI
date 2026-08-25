from app.ats.company_profiles import COMPANY_PROFILES


def calculate_company_score(resume, company="generic"):

    profile = COMPANY_PROFILES.get(
        company.lower(),
        COMPANY_PROFILES["generic"]
    )

    score = 0

    feedback = []

    matched_skills = []

    missing_skills = []

    resume_skills = [
        skill.lower()
        for skill in resume.get("skills", [])
    ]

    # ---------------------------
    # Required Skills (35 Marks)
    # ---------------------------

    required = profile["required_skills"]

    if len(required) > 0:

        skill_score = 35 / len(required)

        for skill in required:

            if skill.lower() in resume_skills:

                score += skill_score
                matched_skills.append(skill)

            else:

                missing_skills.append(skill)

    # ---------------------------
    # Preferred Skills (15 Marks)
    # ---------------------------

    preferred = profile["preferred_skills"]

    if len(preferred) > 0:

        pref_score = 15 / len(preferred)

        for skill in preferred:

            if skill.lower() in resume_skills:
                score += pref_score

    # ---------------------------
    # Projects (20 Marks)
    # ---------------------------

    projects = len(resume.get("projects", []))

    required_projects = profile["minimum_projects"]

    if projects >= required_projects:

        score += 20

    else:

        feedback.append(
            f"Need at least {required_projects} projects."
        )

    # ---------------------------
    # Certifications (10 Marks)
    # ---------------------------

    certs = len(resume.get("certifications", []))

    if certs >= profile["minimum_certifications"]:

        score += 10

    else:

        feedback.append(
            "Add more certifications."
        )

    # ---------------------------
    # Experience (10 Marks)
    # ---------------------------

    if len(resume.get("experience", [])) > 0:

        score += 10

    else:

        feedback.append(
            "Add internship or work experience."
        )

    # ---------------------------
    # Education (10 Marks)
    # ---------------------------

    if len(resume.get("education", [])) > 0:

        score += 10

    else:

        feedback.append(
            "Education section missing."
        )

    return {

        "company": company,

        "ats_score": round(score),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "feedback": feedback
    }