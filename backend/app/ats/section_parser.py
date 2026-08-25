import re


SECTION_HEADERS = [
    "education",
    "experience",
    "projects",
    "skills",
    "certifications",
    "internships",
    "achievements",
    "languages",
    "summary"
]


def split_into_sections(text: str):
    sections = {}

    current_section = "general"

    sections[current_section] = []

    for line in text.split("\n"):

        clean = line.strip()

        if clean.lower() in SECTION_HEADERS:
            current_section = clean.lower()
            sections[current_section] = []

        else:
            sections[current_section].append(clean)

    return sections