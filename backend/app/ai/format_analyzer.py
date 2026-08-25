import re


def analyze_resume_format(resume_text: str):

    score = 100
    issues = []

    # Resume Length
    words = len(resume_text.split())

    if words < 300:
        score -= 15
        issues.append("Resume is too short.")

    elif words > 900:
        score -= 10
        issues.append("Resume is too long.")

    # Email
    email_pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"

    if not re.search(email_pattern, resume_text):
        score -= 20
        issues.append("Email address missing.")

    # Phone Number
    phone_pattern = r"\+?\d[\d\s-]{8,}\d"

    if not re.search(phone_pattern, resume_text):
        score -= 15
        issues.append("Phone number missing.")

    # LinkedIn
    if "linkedin" not in resume_text.lower():
        score -= 10
        issues.append("LinkedIn profile missing.")

    # GitHub
    if "github" not in resume_text.lower():
        score -= 10
        issues.append("GitHub profile missing.")

    score = max(score, 0)

    return {
        "format_score": score,
        "issues": issues
    }