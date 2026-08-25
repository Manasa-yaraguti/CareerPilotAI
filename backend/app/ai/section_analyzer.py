def analyze_sections(resume_text: str):

    resume = resume_text.lower()

    sections = {
        "contact": [
            "email",
            "phone",
            "linkedin",
            "github"
        ],

        "education": [
            "education",
            "b.tech",
            "bachelor",
            "degree",
            "college",
            "university"
        ],

        "skills": [
            "skills",
            "technical skills"
        ],

        "projects": [
            "projects",
            "project"
        ],

        "experience": [
            "experience",
            "internship",
            "work experience"
        ],

        "certifications": [
            "certification",
            "certifications",
            "certificate"
        ],

        "achievements": [
            "achievement",
            "achievements",
            "award"
        ]
    }

    found = []
    missing = []

    for section, keywords in sections.items():

        if any(keyword in resume for keyword in keywords):
            found.append(section)

        else:
            missing.append(section)

    return {
        "found_sections": found,
        "missing_sections": missing,
        "section_score": round(
            len(found) / len(sections) * 100,
            2
        )
    }