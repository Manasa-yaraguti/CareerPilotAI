import { useState, useEffect } from "react";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AuthModal from "./components/AuthModal";
import Dashboard from "./components/Dashboard";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import CompanyScoreView from "./components/CompanyScoreView";
import JobMatcher from "./components/JobMatcher";
import AIFeedbackView from "./components/AIFeedbackView";
import ResumeRewriter from "./components/ResumeRewriter";
import SkillGapView from "./components/SkillGapView";
import JobRecommendations from "./components/JobRecommendations";
import ResumeHistoryView from "./components/ResumeHistoryView";
import LandingPage from "./components/LandingPage";

import { getUserProfile } from "./services/api";

function App() {
    const [activePage, setActivePage] = useState("landing");
    const [resumeData, setResumeData] = useState(null);
    const [atsResult, setAtsResult] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    // Load initial user session
    useEffect(() => {
        const token = localStorage.getItem("careerpilot_token");
        const email = localStorage.getItem("careerpilot_email");
        if (token && email) {
            getUserProfile()
                .then((data) => {
                    setCurrentUser(data.user || { sub: email, email });
                    setActivePage("dashboard");
                })
                .catch(() => {
                    // Token expired or invalid
                    localStorage.removeItem("careerpilot_token");
                    localStorage.removeItem("careerpilot_email");
                    setCurrentUser(null);
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("careerpilot_token");
        localStorage.removeItem("careerpilot_email");
        setCurrentUser(null);
        window.history.pushState({}, "", "/");
        setActivePage("landing");
        showToast("Signed out successfully", "info");
    };

    const openWorkspace = (page = "dashboard") => {
        if (!currentUser) {
            setIsAuthOpen(true);
            return;
        }
        window.history.pushState({}, "", "/app");
        setActivePage(page);
    };

    const openHome = () => {
        window.history.pushState({}, "", "/");
        setActivePage("landing");
    };

    const getPageTitle = () => {
        switch (activePage) {
            case "dashboard": return "Platform Overview";
            case "resume": return "Resume Analyzer & ATS";
            case "company-score": return "Target Company ATS";
            case "job-match": return "Resume vs JD Matcher";
            case "ai-feedback": return "AI Recruiter Review";
            case "rewrite": return "AI Resume Rewriter";
            case "skill-gap": return "Skill Gap & Learning";
            case "job-recommendations": return "Job Recommendations";
            case "history": return "Resume History";
            default: return "Dashboard";
        }
    };

    return (
        <div className="app-container">
            {activePage === "landing" ? (
                <LandingPage onLogin={() => setIsAuthOpen(true)} onGetStarted={() => openWorkspace("dashboard")} onExplore={() => openWorkspace("dashboard")} />
            ) : (
                <>
                    <Sidebar
                        activePage={activePage}
                        setActivePage={setActivePage}
                        currentUser={currentUser}
                        onGoHome={openHome}
                    />

            {/* Main Content Area */}
                    <div className="main-wrapper">
                <Navbar
                    currentUser={currentUser}
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onLogout={handleLogout}
                    activeTabTitle={getPageTitle()}
                />

                <main className="content-body">
                    {activePage === "dashboard" && (
                        <Dashboard
                            setActivePage={setActivePage}
                            resumeData={resumeData}
                            atsResult={atsResult}
                        />
                    )}

                    {activePage === "resume" && (
                        <ResumeAnalyzer
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                            atsResult={atsResult}
                            setAtsResult={setAtsResult}
                            setActivePage={setActivePage}
                            showToast={showToast}
                        />
                    )}

                    {activePage === "company-score" && (
                        <CompanyScoreView
                            resumeData={resumeData}
                            showToast={showToast}
                            setActivePage={setActivePage}
                        />
                    )}

                    {activePage === "job-match" && (
                        <JobMatcher
                            resumeData={resumeData}
                            showToast={showToast}
                            setActivePage={setActivePage}
                        />
                    )}

                    {activePage === "ai-feedback" && (
                        <AIFeedbackView
                            resumeData={resumeData}
                            showToast={showToast}
                            setActivePage={setActivePage}
                        />
                    )}

                    {activePage === "rewrite" && (
                        <ResumeRewriter
                            resumeData={resumeData}
                            showToast={showToast}
                        />
                    )}

                    {activePage === "skill-gap" && (
                        <SkillGapView
                            resumeData={resumeData}
                            showToast={showToast}
                            setActivePage={setActivePage}
                        />
                    )}

                    {activePage === "job-recommendations" && (
                        <JobRecommendations
                            resumeData={resumeData}
                            showToast={showToast}
                            setActivePage={setActivePage}
                        />
                    )}

                    {activePage === "history" && (
                        <ResumeHistoryView
                            currentUser={currentUser}
                            onOpenAuth={() => setIsAuthOpen(true)}
                            showToast={showToast}
                        />
                    )}
                </main>
                    </div>
                </>
            )}

            {/* User Auth Modal */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onAuthSuccess={(user) => {
                    setCurrentUser(user);
                    window.history.pushState({}, "", "/app");
                    setActivePage("dashboard");
                }}
                showToast={showToast}
            />

            {/* Toast Notifications */}
            {toast && (
                <div className="toast-container">
                    <div className={`toast toast-${toast.type}`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;