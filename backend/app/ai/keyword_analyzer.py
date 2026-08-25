import re


def keyword_density(resume_text: str, job_description: str):

    resume_words = re.findall(r'\b\w+\b', resume_text.lower())
    jd_words = re.findall(r'\b\w+\b', job_description.lower())

    # Remove duplicate words
    resume_set = set(resume_words)
    jd_set = set(jd_words)

    matched = list(resume_set.intersection(jd_set))
    missing = list(jd_set.difference(resume_set))

    if len(jd_set) == 0:
        score = 0
    else:
        score = round(
            (len(matched) / len(jd_set)) * 100,
            2
        )

    return {
        "keyword_score": score,
        "matched_keywords": sorted(matched),
        "missing_keywords": sorted(missing)
    }