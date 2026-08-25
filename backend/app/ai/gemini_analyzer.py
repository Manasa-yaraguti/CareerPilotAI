import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

model = None
if api_key:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
    except Exception as e:
        print(f"Warning: Could not configure Gemini model: {e}")
        model = None


def generate_fallback_feedback(resume_text: str) -> str:
    text_lower = resume_text.lower()
    
    # Analyze sections
    strengths = []
    weaknesses = []
    missing_skills = []
    ats_improvements = []
    hr_improvements = []
    
    # Check for skills
    if "python" in text_lower or "java" in text_lower or "javascript" in text_lower:
        strengths.append("Demonstrates core programming language competency.")
    if "sql" in text_lower or "database" in text_lower or "postgresql" in text_lower or "mongodb" in text_lower:
        strengths.append("Includes relevant database and data management technologies.")
    if "project" in text_lower:
        strengths.append("Features project work demonstrating practical application.")
    if not strengths:
        strengths.append("Foundational technical background.")
        
    # Check weaknesses
    if "github.com" not in text_lower:
        weaknesses.append("Missing live project or GitHub profile links for verification.")
        ats_improvements.append("Add a direct link to your active GitHub repository and LinkedIn profile.")
    if "developed" not in text_lower and "architected" not in text_lower and "optimized" not in text_lower:
        weaknesses.append("Action verbs could be stronger in bullet points.")
        hr_improvements.append("Begin each bullet point with strong action verbs (e.g., Engineered, Accelerated, Designed).")
    if not any(char.isdigit() for char in resume_text):
        weaknesses.append("Lack of quantifiable metrics and business impact numbers.")
        hr_improvements.append("Quantify achievements (e.g., 'Improved latency by 35%', 'Managed database with 100K+ records').")
        
    # Missing skills suggestions
    modern_skills = ["docker", "kubernetes", "aws", "ci/cd", "rest api", "unit testing", "system design"]
    for s in modern_skills:
        if s not in text_lower:
            missing_skills.append(s.upper())
            
    missing_str = ", ".join(missing_skills[:5]) if missing_skills else "Cloud deployments, Containerization"
    
    return f"""### 1. Resume Strengths
- {strengths[0]}
- Clear technical foundation.
- {" - ".join(strengths[1:]) if len(strengths) > 1 else "Good structural layout."}

### 2. Resume Weaknesses
- {weaknesses[0] if weaknesses else "Could include more production-grade deployment experience."}
- {weaknesses[1] if len(weaknesses) > 1 else "Formatting could be tightened for faster skimming by recruiters."}

### 3. Missing Skills
- High-demand skills to consider adding: {missing_str}.

### 4. ATS Improvements
- Ensure standard section headings: 'Summary', 'Skills', 'Experience', 'Education', 'Projects', 'Certifications'.
- Avoid multi-column complex layouts or graphics that trip up automated scanners.
- {ats_improvements[0] if ats_improvements else "Include primary target role keywords throughout experience bullets."}

### 5. HR Improvements
- Keep the summary punchy (3-4 lines highlighting core domain and years of focus).
- {hr_improvements[0] if hr_improvements else "Highlight team collaboration and ownership in past roles/projects."}

### 6. Final Suggestions
- Tailor keywords to the exact job description before submitting.
- Target an ATS compatibility score above 85% for best screening results."""


def analyze_resume_ai(resume_text: str):
    if model:
        try:
            prompt = f"""
You are an ATS expert and senior HR recruiter.

Analyze the following resume.

Give your response in simple English.

Include:

1. Resume Strengths
2. Resume Weaknesses
3. Missing Skills
4. ATS Improvements
5. HR Improvements
6. Final Suggestions

Resume:

{resume_text}
"""
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text
        except Exception as e:
            print(f"Gemini API call failed, using intelligent fallback: {e}")

    return generate_fallback_feedback(resume_text)