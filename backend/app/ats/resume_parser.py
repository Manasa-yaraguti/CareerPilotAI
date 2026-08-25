import re

from app.ats.skill_extractor import extract_skills
from app.ats.section_parser import split_into_sections


def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)

    if match:
        return match.group()

    return ""


def extract_phone(text):
    match = re.search(r'(\+91[- ]?)?[6-9]\d{9}', text)

    if match:
        return match.group()

    return ""


def extract_name(text):
    lines = text.split("\n")

    for line in lines[:5]:

        line = line.strip()

        if len(line.split()) <= 4 and len(line) > 2:
            return line

    return ""


def parse_resume(text):

    sections = split_into_sections(text)

    return {

        "name": extract_name(text),

        "email": extract_email(text),

        "phone": extract_phone(text),

        "skills": extract_skills(text),

        "education": sections.get("education", []),

        "projects": sections.get("projects", []),

        "experience": sections.get("experience", []),

        "certifications": sections.get("certifications", []),

        "internships": sections.get("internships", []),

        "achievements": sections.get("achievements", []),

        "languages": sections.get("languages", [])

    }