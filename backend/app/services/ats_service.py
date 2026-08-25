import re


def calculate_ats_score(text: str):

    score = 0
    suggestions = []

    text = text.lower()

    # Email
    if re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text):
        score += 10
    else:
        suggestions.append("Add a valid email address.")

    # Phone
    if re.search(r"\b\d{10}\b", text):
        score += 10
    else:
        suggestions.append("Add a phone number.")

    # Education
    education_keywords = [
        "b.tech",
        "btech",
        "degree",
        "education",
        "university",
        "college"
    ]

    if any(word in text for word in education_keywords):
        score += 20
    else:
        suggestions.append("Add education details.")

    # Skills
    skill_keywords = [
        "python",
        "java",
        "sql",
        "html",
        "css",
        "javascript",
        "react",
        "machine learning"
    ]

    skills_found = sum(
        1 for skill in skill_keywords
        if skill in text
    )

    score += min(skills_found * 3, 20)

    if skills_found == 0:
        suggestions.append("Add technical skills.")

    # Projects
    if "project" in text:
        score += 20
    else:
        suggestions.append("Add project experience.")

    # Experience
    if "experience" in text or "internship" in text:
        score += 20
    else:
        suggestions.append("Add internship or experience.")

    return {
        "score": score,
        "suggestions": suggestions
    }