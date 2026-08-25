from app.data.career_roadmaps import CAREER_ROADMAPS


def generate_career_roadmap(career: str):

    if career not in CAREER_ROADMAPS:
        return {
            "error": "Career not available."
        }

    return {
        "career": career,
        "roadmap": CAREER_ROADMAPS[career]
    }