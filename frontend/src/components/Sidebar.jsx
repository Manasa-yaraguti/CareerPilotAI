import {
    LayoutDashboard,
    FileSearch,
    Building2,
    Briefcase,
    Sparkles,
    Edit3,
    GraduationCap,
    History,
    Zap,
    Home
} from "lucide-react";

export default function Sidebar({ activePage, setActivePage, currentUser, onGoHome }) {
    const navSections = [
        {
            title: "Core Tools",
            items: [
                { id: "home", label: "Home", icon: Home, action: onGoHome },
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "resume", label: "Resume Analyzer & ATS", icon: FileSearch },
                { id: "company-score", label: "Target Company ATS", icon: Building2 },
                { id: "job-match", label: "Resume vs Job Matcher", icon: Briefcase },
            ]
        },
        {
            title: "AI Career Intelligence",
            items: [
                { id: "ai-feedback", label: "AI Recruiter Review", icon: Sparkles },
                { id: "rewrite", label: "AI Resume Rewriter", icon: Edit3 },
                { id: "skill-gap", label: "Skill Gap & Learning", icon: GraduationCap },
                { id: "job-recommendations", label: "Job Recommendations", icon: Zap },
            ]
        },
        {
            title: "Preparation",
            items: [
                { id: "history", label: "Resume History", icon: History },
            ]
        }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="brand-logo">
                    <Sparkles size={22} />
                </div>
                <div className="brand-info">
                    <h2>CareerPilot</h2>
                    <span>AI operating system</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navSections.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: "8px" }}>
                        <div className="nav-section-title">{section.title}</div>
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activePage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    className={`nav-item ${isActive ? "active" : ""}`}
                                    onClick={() => item.action ? item.action() : setActivePage(item.id)}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-quick-card">
                    <div className="user-avatar">
                        {currentUser?.sub ? currentUser.sub.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="user-details">
                        <div className="user-name">
                            {currentUser?.sub || "Guest Candidate"}
                        </div>
                        <div className="user-role">
                            {currentUser ? "Verified Candidate" : "Free Plan"}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
