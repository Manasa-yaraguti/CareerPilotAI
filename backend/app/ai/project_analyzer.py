import re

TECHNOLOGIES = [

    "python",
    "java",
    "c",
    "c++",
    "javascript",
    "typescript",
    "react",
    "angular",
    "vue",
    "node",
    "express",
    "fastapi",
    "django",
    "flask",
    "spring",
    "mysql",
    "postgresql",
    "mongodb",
    "firebase",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "tensorflow",
    "pytorch",
    "opencv",
    "langchain",
    "gemini",
    "openai",
    "redis",
    "git",
    "github"
]


def analyze_projects(resume_text: str):

    resume = resume_text.lower()

    score = 100

    feedback = []

    projects = 0

    if "project" in resume:
        projects += resume.count("project")

    technologies = []

    for tech in TECHNOLOGIES:

        if tech in resume:
            technologies.append(tech)

    github = bool(
        re.search(
            r"github\.com",
            resume
        )
    )

    linkedin = bool(
        re.search(
            r"linkedin\.com",
            resume
        )
    )

    portfolio = bool(
        re.search(
            r"(portfolio|vercel|netlify)",
            resume
        )
    )

    if projects == 0:
        score -= 30
        feedback.append(
            "No projects detected."
        )

    if len(technologies) < 5:
        score -= 20
        feedback.append(
            "Use more modern technologies in your projects."
        )

    if not github:
        score -= 15
        feedback.append(
            "Add your GitHub profile."
        )

    if not portfolio:
        score -= 10
        feedback.append(
            "Add a portfolio or live demo link."
        )

    score = max(score, 0)

    return {

        "project_score": score,

        "projects_detected": projects,

        "technologies": technologies,

        "github_found": github,

        "linkedin_found": linkedin,

        "portfolio_found": portfolio,

        "feedback": feedback
    }