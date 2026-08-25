const API_BASE_URL = "http://127.0.0.1:8000/api";

function getAuthHeader() {
    const token = localStorage.getItem("careerpilot_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// -----------------------------
// Resume & ATS Endpoints
// -----------------------------

export async function uploadResume(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/ats/upload-resume`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to upload resume");
    }

    return response.json();
}

export async function calculateATSScore({ resume, jobDescription = "", company = "General" }) {
    const response = await fetch(`${API_BASE_URL}/ats/calculate-score`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resume,
            job_description: jobDescription,
            company,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to calculate ATS score");
    }

    return response.json();
}

export async function calculateCompanyScore({ resume, company }) {
    const response = await fetch(`${API_BASE_URL}/ats/company-score`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resume,
            company,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to calculate company ATS score");
    }

    return response.json();
}

// -----------------------------
// AI Insights & Rewriting
// -----------------------------

export async function getAIFeedback(resume) {
    const response = await fetch(`${API_BASE_URL}/ats/ai-feedback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to get AI feedback");
    }

    return response.json();
}

export async function rewriteResume({ resume, email = "user@careerpilot.ai", filename = "resume.pdf" }) {
    const response = await fetch(`${API_BASE_URL}/ats/rewrite-resume`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resume,
            email,
            filename,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to rewrite resume");
    }

    return response.json();
}

// -----------------------------
// Career & Match Tools
// -----------------------------

export async function matchResumeJob({ resume, jobDescription }) {
    const response = await fetch(`${API_BASE_URL}/ats/resume-match`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resume,
            job_description: jobDescription,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to match resume with job description");
    }

    return response.json();
}

export async function analyzeSkillGap({ resume, jobRole }) {
    const response = await fetch(`${API_BASE_URL}/ats/skill-gap`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resume,
            job_role: jobRole,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to analyze skill gap");
    }

    return response.json();
}

export async function getJobRecommendations(resume) {
    const response = await fetch(`${API_BASE_URL}/ats/job-recommendation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch job recommendations");
    }

    return response.json();
}

export async function getMockInterviewQuestions(jobRole) {
    const response = await fetch(`${API_BASE_URL}/ats/mock-interview`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_role: jobRole }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate interview questions");
    }

    return response.json();
}

export async function evaluateInterviewAnswer({ question, answer }) {
    const response = await fetch(`${API_BASE_URL}/ats/evaluate-interview`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question,
            answer,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to evaluate answer");
    }

    return response.json();
}

export async function getCareerRoadmap(career) {
    const response = await fetch(`${API_BASE_URL}/ats/career-roadmap`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ career }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate career roadmap");
    }

    return response.json();
}

export async function predictSalary({ role, experience }) {
    const response = await fetch(`${API_BASE_URL}/ats/predict-salary`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            role,
            experience: Number(experience),
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to predict salary");
    }

    return response.json();
}

export async function getCourseRecommendations(missingSkills = []) {
    const response = await fetch(`${API_BASE_URL}/ats/recommend-courses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ missing_skills: missingSkills }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch course recommendations");
    }

    return response.json();
}

export async function getResumeHistory(email) {
    const response = await fetch(`${API_BASE_URL}/ats/history/${encodeURIComponent(email)}`);

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch resume history");
    }

    return response.json();
}

// -----------------------------
// Authentication Endpoints
// -----------------------------

export async function registerUser({ email, password, full_name }) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
            full_name,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Registration failed");
    }

    return response.json();
}

export async function loginUser({ email, password }) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Login failed");
    }

    const data = await response.json();
    if (data.message === "Invalid Email or Password") {
        throw new Error("Invalid Email or Password");
    }

    return data;
}

export async function getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
            ...getAuthHeader(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load user profile");
    }

    return response.json();
}