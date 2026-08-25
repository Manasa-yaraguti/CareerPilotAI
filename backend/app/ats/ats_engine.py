from app.ai.skill_matcher import extract_skills
from app.ai.section_analyzer import analyze_sections
from app.ai.company_matcher import match_company_skills
from app.ai.format_analyzer import analyze_resume_format
from app.ai.keyword_analyzer import keyword_density
from app.ai.experience_analyzer import analyze_experience
from app.ai.education_analyzer import analyze_education
from app.ai.project_analyzer import analyze_projects
from app.ai.certification_analyzer import analyze_certifications
from app.data.company_skills import COMPANY_SKILLS


def calculate_ats_score(
    resume_text: str,
    job_description: str = "",
    company: str = None
):

    # ==========================================
    # Resume Analysis
    # ==========================================

    skills = extract_skills(resume_text)
    sections = analyze_sections(resume_text)
    format_result = analyze_resume_format(resume_text)
    keyword_result = keyword_density(resume_text, job_description) if job_description else {
        "keyword_score": 85,
        "matched_keywords": [],
        "missing_keywords": []
    }
    experience_result = analyze_experience(resume_text)
    education_result = analyze_education(resume_text)
    project_result = analyze_projects(resume_text)
    certification_result = analyze_certifications(resume_text)

    # ==========================================
    # Company Analysis
    # ==========================================

    has_specific_company = bool(company and company.lower() != "general" and company.lower() in COMPANY_SKILLS)
    company_result = None
    company_score = 0

    if has_specific_company:
        company_result = match_company_skills(
            resume_text,
            company
        )
        company_score = company_result["match_percentage"]

    # ==========================================
    # Individual Scores
    # ==========================================

    total_skills = (
        len(skills["technical_skills"]) +
        len(skills["soft_skills"])
    )

    skill_score = min(total_skills * 5, 100)
    section_score = sections["section_score"]
    format_score = format_result["format_score"]
    keyword_score = keyword_result["keyword_score"]
    experience_score = experience_result["experience_score"]
    education_score = education_result["education_score"]
    project_score = project_result["project_score"]
    certification_score = certification_result["certification_score"]

    # ==========================================
    # ATS Score Calculation
    # ==========================================

    if has_specific_company:
        overall = (
            skill_score * 0.16 +
            section_score * 0.12 +
            format_score * 0.10 +
            keyword_score * 0.12 +
            experience_score * 0.12 +
            education_score * 0.08 +
            project_score * 0.10 +
            certification_score * 0.08 +
            company_score * 0.12
        )
    else:
        overall = (
            skill_score * 0.25 +
            section_score * 0.18 +
            format_score * 0.12 +
            keyword_score * 0.12 +
            experience_score * 0.10 +
            education_score * 0.08 +
            project_score * 0.10 +
            certification_score * 0.05
        )

    overall = round(overall, 2)


    # ==========================================
    # Performance Grade
    # ==========================================

    if overall >= 90:
        grade = "Excellent"

    elif overall >= 80:
        grade = "Very Good"

    elif overall >= 70:
        grade = "Good"

    elif overall >= 60:
        grade = "Average"

    else:
        grade = "Needs Improvement"

    # ==========================================
    # ATS Compatibility
    # ==========================================

    ats_compatible = overall >= 70
        # ==========================================
    # Suggestion Engine
    # ==========================================

    suggestions = []
    if project_score < 70:

        suggestions.append(
            "Improve your projects by adding more technologies, GitHub links, and live demos."
    )
    if certification_score < 70:

        suggestions.append(

            "Earn certifications from Microsoft, Google, AWS, Oracle, Cisco, IBM or UiPath."
    )

    # ---------- Skills ----------
    if skill_score < 60:
        suggestions.append(
            "Add more technical skills related to your target role."
        )

    if len(skills["technical_skills"]) < 8:
        suggestions.append(
            "Include more relevant programming languages, frameworks, and tools."
        )

    # ---------- Resume Sections ----------
    if section_score < 80:
        suggestions.append(
            "Your resume is missing one or more important sections such as Projects, Experience, Education, Certifications, or Skills."
        )

    # ---------- Formatting ----------
    if format_score < 80:
        suggestions.append(
            "Improve formatting by adding proper headings, consistent spacing, phone number, email, LinkedIn, and GitHub."
        )

    # ---------- Keywords ----------
    if keyword_score < 70:
        suggestions.append(
            "Include more keywords from the Job Description to improve ATS compatibility."
        )

    missing_keywords = keyword_result.get("missing_keywords", [])

    if len(missing_keywords) > 0:

        top_missing = missing_keywords[:10]

        suggestions.append(
            "Important missing keywords: "
            + ", ".join(top_missing)
        )

    # ---------- Experience ----------
    if experience_score < 70:

        suggestions.append(
            "Strengthen your experience section using action verbs like Developed, Designed, Implemented, Optimized, Automated."
        )

        suggestions.append(
            "Quantify your achievements using numbers and percentages."
        )

    # ---------- Company ----------
    if company:

        if company_score < 70:

            suggestions.append(
                f"Your resume does not strongly match {company.title()} hiring requirements."
            )

            if company_result:

                missing = company_result["missing"]

                if len(missing) > 0:

                    suggestions.append(
                        "Missing company skills: "
                        + ", ".join(missing)
                    )

    # ---------- ATS Compatibility ----------
    if overall < 60:

        suggestions.append(
            "This resume has a low ATS score and may not pass the first screening."
        )

    elif overall < 80:

        suggestions.append(
            "Improve the highlighted areas to increase interview chances."
        )

    else:

        suggestions.append(
            "Excellent ATS compatibility. Your resume is ready for most applicant tracking systems."
        )
            # ==========================================
    # Final Response
    # ==========================================

    return {

        # ------------------------------
        # Overall Result
        # ------------------------------
        "overall_ats_score": overall,

        "grade": grade,

        "ats_compatible": ats_compatible,

        # ------------------------------
        # Individual Scores
        # ------------------------------
        "skill_score": skill_score,

        "section_score": section_score,

        "format_score": format_score,

        "keyword_score": keyword_score,

        "experience_score": experience_score,

        "company_score": company_score,

        # ------------------------------
        # Resume Analysis
        # ------------------------------
        "skills": skills,

        "sections": sections,

        "format_analysis": format_result,

        "keyword_analysis": keyword_result,

        "experience_analysis": experience_result,

        "company_analysis": company_result,
        "education_score": education_score,
        "project_score": project_score,

        "project_analysis": project_result,
        "certification_score": certification_score,

        "certification_analysis": certification_result,
        "suggestions": suggestions
    }