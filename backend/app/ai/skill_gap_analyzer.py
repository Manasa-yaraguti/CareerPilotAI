from app.data.job_roles import JOB_ROLES
from app.data.skill_roadmap import SKILL_ROADMAP


def analyze_skill_gap(resume_text: str, job_role: str):

    resume = resume_text.lower()

    required_skills = JOB_ROLES.get(job_role)

    if not required_skills:
        return {
            "error": "Job role not found."
        }

    matched = []
    missing = []
    roadmap = []

    for skill in required_skills:

        if skill.lower() in resume:
            matched.append(skill)
        else:
            missing.append(skill)

            if skill.lower() in SKILL_ROADMAP:

                data = SKILL_ROADMAP[skill.lower()]

                roadmap.append({
                    "skill": skill,
                    "duration": data["duration"],
                    "difficulty": data["difficulty"],
                    "course": data["course"]
                })

    score = round(
        len(matched) / len(required_skills) * 100,
        2
    )

    return {
        "job_role": job_role,
        "match_percentage": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "learning_roadmap": roadmap
    }