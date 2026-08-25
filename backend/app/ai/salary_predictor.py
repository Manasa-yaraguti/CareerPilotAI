def predict_salary(role: str, experience: int):

    role = role.lower()

    salaries = {
        "ai engineer": [600000, 1200000, 1800000],
        "backend developer": [500000, 1000000, 1600000],
        "full stack developer": [550000, 1100000, 1700000],
        "data scientist": [700000, 1400000, 2000000]
    }

    if role not in salaries:
        return {
            "error": "Role not available."
        }

    if experience <= 1:
        salary = salaries[role][0]
    elif experience <= 3:
        salary = salaries[role][1]
    else:
        salary = salaries[role][2]

    return {
        "role": role.title(),
        "experience": experience,
        "predicted_salary": salary
    }