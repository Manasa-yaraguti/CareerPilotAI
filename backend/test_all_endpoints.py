import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_routes():
    print("Testing Home...")
    r = client.get("/")
    assert r.status_code == 200, f"Home failed: {r.text}"
    print("Home OK:", r.json())

    # Test ATS calculate score
    sample_resume = """John Doe
    Email: john@example.com
    Phone: 9876543210
    LinkedIn: linkedin.com/in/johndoe
    GitHub: github.com/johndoe
    Education: B.Tech in Computer Science 2024, CGPA 8.5
    Skills: Python, FastAPI, Docker, SQL, PostgreSQL, React, JavaScript, Git
    Projects: Built an AI resume analyzer with FastAPI and React
    Experience: Developed backend APIs and microservices at TechCorp
    Certifications: AWS Cloud Practitioner, Microsoft Azure
    """

    print("Testing calculate-score...")
    r = client.post("/api/ats/calculate-score", json={"resume": sample_resume, "job_description": "Looking for Python FastAPI developer with Docker", "company": "General"})
    assert r.status_code == 200, f"Calculate score failed: {r.text}"
    print("Score OK, overall:", r.json().get("overall_ats_score"))

    print("Testing company-score...")
    r = client.post("/api/ats/company-score", json={"resume": sample_resume, "company": "google"})
    assert r.status_code == 200, f"Company score failed: {r.text}"
    print("Company score OK:", r.json().get("overall_ats_score"))

    print("Testing ai-feedback...")
    r = client.post("/api/ats/ai-feedback", json={"resume": sample_resume})
    assert r.status_code == 200, f"AI feedback failed: {r.text}"
    print("AI feedback OK (preview):", r.json().get("feedback")[:60])

    print("Testing rewrite-resume...")
    r = client.post("/api/ats/rewrite-resume", json={"resume": sample_resume, "email": "test@example.com"})
    assert r.status_code == 200, f"Rewrite failed: {r.text}"
    print("Rewrite OK (preview):", r.json().get("rewritten_resume")[:60])

    print("Testing job-recommendation...")
    r = client.post("/api/ats/job-recommendation", json={"resume": sample_resume})
    assert r.status_code == 200, f"Job recommendation failed: {r.text}"
    print("Job recs OK, count:", len(r.json().get("recommended_jobs", [])))

    print("Testing skill-gap...")
    r = client.post("/api/ats/skill-gap", json={"resume": sample_resume, "job_role": "Backend Developer"})
    assert r.status_code == 200, f"Skill gap failed: {r.text}"
    print("Skill gap OK, match %:", r.json().get("match_percentage"))

    print("Testing mock-interview...")
    r = client.post("/api/ats/mock-interview", json={"job_role": "Backend Developer"})
    assert r.status_code == 200, f"Mock interview failed: {r.text}"
    print("Mock interview OK, questions:", list(r.json().get("questions", {}).keys()))

    print("Testing evaluate-interview...")
    r = client.post("/api/ats/evaluate-interview", json={"question": "Explain FastAPI", "answer": "FastAPI is a modern asynchronous web framework for Python based on standard Python type hints."})
    assert r.status_code == 200, f"Evaluate interview failed: {r.text}"
    print("Evaluation OK (preview):", r.json().get("evaluation")[:60])

    print("Testing resume-match...")
    r = client.post("/api/ats/resume-match", json={"resume": sample_resume, "job_description": "We need Python and FastAPI developer with Docker and PostgreSQL"})
    assert r.status_code == 200, f"Resume match failed: {r.text}"
    print("Resume match OK, %:", r.json().get("match_percentage"))

    print("Testing career-roadmap...")
    r = client.post("/api/ats/career-roadmap", json={"career": "AI Engineer"})
    assert r.status_code == 200, f"Career roadmap failed: {r.text}"
    print("Roadmap OK, steps:", len(r.json().get("roadmap", [])))

    print("Testing predict-salary...")
    r = client.post("/api/ats/predict-salary", json={"role": "Backend Developer", "experience": 3})
    assert r.status_code == 200, f"Salary prediction failed: {r.text}"
    print("Salary prediction OK:", r.json().get("predicted_salary"))

    print("Testing recommend-courses...")
    r = client.post("/api/ats/recommend-courses", json={"missing_skills": ["docker", "fastapi"]})
    assert r.status_code == 200, f"Course recs failed: {r.text}"
    print("Course recs OK, count:", len(r.json()))

    print("Testing user registration and login...")
    test_email = "testuser_smoke@careerpilot.ai"
    reg = client.post("/api/users/register", json={"email": test_email, "password": "TestPassword123!", "full_name": "Test User"})
    if reg.status_code == 200:
        print("Registration OK")
    elif reg.status_code == 400:
        print("User already registered, testing login...")

    log = client.post("/api/users/login", json={"email": test_email, "password": "TestPassword123!"})
    assert log.status_code == 200, f"Login failed: {log.text}"
    token = log.json().get("access_token")
    assert token, "No access token returned"
    print("Login OK, token acquired")

    prof = client.get("/api/users/profile", headers={"Authorization": f"Bearer {token}"})
    assert prof.status_code == 200, f"Profile check failed: {prof.text}"
    print("Profile authenticated OK:", prof.json().get("user"))

    print("Testing history...")
    hist = client.get(f"/api/ats/history/{test_email}")
    assert hist.status_code == 200, f"History check failed: {hist.text}"
    print("History OK, count:", len(hist.json()))

    print("\nALL 15 BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_routes()
