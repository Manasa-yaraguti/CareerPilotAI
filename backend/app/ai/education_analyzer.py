import re

DEGREES = [
    "b.tech",
    "btech",
    "b.e",
    "be",
    "m.tech",
    "mtech",
    "m.e",
    "me",
    "b.sc",
    "bsc",
    "m.sc",
    "msc",
    "bca",
    "mca",
    "bba",
    "mba",
    "phd"
]


def analyze_education(resume_text: str):

    resume = resume_text.lower()

    degree_found = []

    for degree in DEGREES:
        if degree in resume:
            degree_found.append(degree.upper())

    cgpa = None
    percentage = None
    graduation_year = None

    # CGPA
    cgpa_match = re.search(
        r'(\d\.\d{1,2})\s*(cgpa)?',
        resume
    )

    if cgpa_match:
        cgpa = cgpa_match.group(1)

    # Percentage
    percentage_match = re.search(
        r'(\d{2}\.?\d?)\s*%',
        resume
    )

    if percentage_match:
        percentage = percentage_match.group(1)

    # Graduation Year
    year_match = re.search(
        r'(20[2-4][0-9])',
        resume
    )

    if year_match:
        graduation_year = year_match.group(1)

    score = 100

    feedback = []

    if len(degree_found) == 0:
        score -= 40
        feedback.append(
            "Degree not detected."
        )

    if cgpa is None and percentage is None:
        score -= 20
        feedback.append(
            "CGPA or Percentage missing."
        )

    if graduation_year is None:
        score -= 10
        feedback.append(
            "Graduation year missing."
        )

    score = max(score, 0)

    return {

        "education_score": score,

        "degrees": degree_found,

        "cgpa": cgpa,

        "percentage": percentage,

        "graduation_year": graduation_year,

        "feedback": feedback
    }