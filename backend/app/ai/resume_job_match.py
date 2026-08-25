import re


def analyze_resume_job_match(resume: str, job_description: str):

    resume_words = set(
        re.findall(r"\b[a-zA-Z]+\b", resume.lower())
    )

    job_words = set(
        re.findall(r"\b[a-zA-Z]+\b", job_description.lower())
    )

    common = resume_words.intersection(job_words)

    missing = job_words - resume_words

    if len(job_words) == 0:
        score = 0
    else:
        score = round(
            len(common) / len(job_words) * 100,
            2
        )

    return {

        "match_percentage": score,

        "matched_keywords": sorted(list(common)),

        "missing_keywords": sorted(list(missing))
    }