SKILLS = [
    "python",
    "java",
    "c",
    "c++",
    "sql",
    "mongodb",
    "react",
    "node",
    "fastapi",
    "flask",
    "docker",
    "kubernetes",
    "aws",
    "git",
    "github",
    "html",
    "css",
    "javascript",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "opencv",
    "nlp",
    "langchain",
    "postgresql"
]


def extract_skills(text):

    text = text.lower()

    found = []

    for skill in SKILLS:

        if skill in text:
            found.append(skill)

    return sorted(set(found))