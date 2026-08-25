import re


ACTION_VERBS = [
    "developed",
    "built",
    "created",
    "implemented",
    "designed",
    "optimized",
    "improved",
    "managed",
    "led",
    "automated",
    "deployed",
    "integrated",
    "engineered",
    "delivered",
    "achieved"
]


def analyze_experience(resume_text: str):

    resume = resume_text.lower()

    score = 100

    feedback = []

    # Internship / Experience

    if "internship" not in resume and "experience" not in resume:

        score -= 30

        feedback.append(
            "No internship or work experience section found."
        )

    # Action Verbs

    verbs_found = []

    for verb in ACTION_VERBS:

        if verb in resume:
            verbs_found.append(verb)

    if len(verbs_found) < 5:

        score -= 20

        feedback.append(
            "Use stronger action verbs."
        )

    # Numbers

    numbers = re.findall(r"\d+", resume)

    if len(numbers) < 3:

        score -= 20

        feedback.append(
            "Quantify your achievements with numbers."
        )

    score = max(score, 0)

    return {

        "experience_score": score,

        "action_verbs": verbs_found,

        "feedback": feedback
    }