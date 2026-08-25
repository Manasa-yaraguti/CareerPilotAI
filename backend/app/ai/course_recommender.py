from app.data.courses import COURSES


def recommend_courses(missing_skills: list):

    recommendations = []

    for skill in missing_skills:

        key = skill.lower()

        if key in COURSES:

            recommendations.append({

                "skill": skill,

                "platform": COURSES[key]["platform"],

                "course": COURSES[key]["course"]

            })

    return recommendations