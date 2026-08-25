from app.data.jobs import JOBS
from app.ai.skill_matcher import extract_skills


def recommend_jobs(resume_or_skills):
    if isinstance(resume_or_skills, str):
        extracted = extract_skills(resume_or_skills)
        skill_set = set(
            [s.lower() for s in extracted.get("technical_skills", [])] +
            [s.lower() for s in extracted.get("soft_skills", [])]
        )
        resume_lower = resume_or_skills.lower()
    elif isinstance(resume_or_skills, list):
        skill_set = set([s.lower() for s in resume_or_skills])
        resume_lower = " ".join(skill_set)
    else:
        skill_set = set()
        resume_lower = ""

    recommendations = []

    for job in JOBS:
        matched = []

        for skill in job["skills"]:
            skill_lower = skill.lower()
            if skill_lower in skill_set or skill_lower in resume_lower:
                matched.append(skill)

        total_req = len(job["skills"])
        percentage = round((len(matched) / total_req) * 100, 2) if total_req > 0 else 0

        # Include jobs with matches or at least 25% match
        if percentage >= 25 or len(matched) > 0:
            recommendations.append({
                "title": job["title"],
                "company": job["company"],
                "match_percentage": percentage,
                "matched_skills": matched,
                "required_skills": job["skills"]
            })

    # If no high match, list all jobs with current match %
    if not recommendations:
        for job in JOBS:
            recommendations.append({
                "title": job["title"],
                "company": job["company"],
                "match_percentage": 0,
                "matched_skills": [],
                "required_skills": job["skills"]
            })

    recommendations.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    return recommendations