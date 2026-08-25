import {
    ArrowUpRight,
    BarChart3,
    BriefcaseBusiness,
    CheckCircle2,
    FileSearch,
    MessageSquare,
    Sparkles,
    Target,
    WandSparkles,
} from "lucide-react";

const toolGroups = [
    {
        title: "Resume Intelligence",
        label: "SIGNAL",
        items: [
            ["resume", "Resume Analyzer", "See the score recruiters see.", FileSearch, "#635BFF"],
            ["rewrite", "AI Resume Rewriter", "Turn experience into impact.", WandSparkles, "#8B5CF6"],
            ["job-match", "Resume vs JD Matcher", "Close the gap to a role.", Target, "#1C9BEF"],
            ["ai-feedback", "AI Recruiter Feedback", "Get a sharper first read.", MessageSquare, "#F59E0B"],
        ],
    },
    {
        title: "Career Intelligence",
        label: "DIRECTION",
        items: [
            ["company-score", "Target Company ATS", "Aim your profile precisely.", BriefcaseBusiness, "#1C9BEF"],
            ["skill-gap", "Skill Gap & Learning", "Know what to learn next.", BarChart3, "#22A06B"],
            ["job-recommendations", "Job Recommendations", "Find your strongest matches.", Sparkles, "#635BFF"],
        ],
    },
    {
        title: "Career Preparation",
        label: "MOMENTUM",
        items: [
            ["history", "Resume History", "See how far you have come.", FileSearch, "#1C9BEF"],
        ],
    },
];

export default function Dashboard({ setActivePage, resumeData, atsResult }) {
    const score = atsResult?.overall_ats_score;
    const readinessMetrics = [
        ["Resume score", atsResult?.overall_ats_score, "resume"],
        ["ATS compatibility", atsResult?.ats_compatible === undefined ? null : (atsResult.ats_compatible ? 100 : 0), "ats"],
        ["Skill strength", atsResult?.skill_score, "skill"],
        ["Profile strength", atsResult?.section_score, "profile"],
    ];
    const displayName = resumeData?.name || resumeData?.full_name || "there";

    return (
        <div className="command-center">
            <section className="command-welcome">
                <div>
                    <span className="section-kicker"><span className="live-dot" /> AI CAREER COMMAND CENTER</span>
                    <h1>Welcome back, {displayName}.</h1>
                    <p>Here is your career intelligence for today. One focused move at a time.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setActivePage("resume")}>
                    <FileSearch size={17} /> Analyze resume
                </button>
            </section>

            <section className="command-grid">
                <div className="readiness-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="overline">CAREER READINESS</span>
                            <h2>Your signal, at a glance.</h2>
                        </div>
                        <span className={score !== undefined ? "data-badge" : "quiet-badge"}>
                            {score !== undefined ? "Live analysis" : "Awaiting analysis"}
                        </span>
                    </div>

                    <div className="readiness-main">
                        <div
                            className={`readiness-ring ${score === undefined ? "empty" : ""}`}
                            style={score !== undefined ? { "--score": `${score * 3.6}deg` } : undefined}
                        >
                            <div>
                                <strong>{score !== undefined ? Math.round(score) : "--"}</strong>
                                <span>{score !== undefined ? "%" : "No score"}</span>
                            </div>
                        </div>

                        <div className="readiness-copy">
                            <strong>{score !== undefined ? (score >= 75 ? "Strong foundation" : "Room to grow") : "Your score appears after analysis"}</strong>
                            <p>
                                {score !== undefined
                                    ? `Based on your latest analysis of ${resumeData?.filename || "your resume"}.`
                                    : "Upload and analyze a resume to unlock your personalized readiness view."}
                            </p>
                            <button className="text-link" onClick={() => setActivePage("resume")}>
                                {score !== undefined ? "Open scorecard" : "Start with resume analysis"}
                                <ArrowUpRight size={15} />
                            </button>
                        </div>
                    </div>

                    <div className="readiness-metrics">
                        {readinessMetrics.map(([label, value, key]) => (
                            <div className="readiness-metric" key={key}>
                                <span>{label}</span>
                                <strong>{value === null || value === undefined ? "Not measured" : `${Math.round(value)}%`}</strong>
                                <div className="metric-track">
                                    <i style={{ width: value === null || value === undefined ? "0%" : `${Math.min(value, 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="coach-panel">
                    <div className="coach-orbit"><Sparkles size={23} /></div>
                    <span className="overline">AI CAREER COACH</span>
                    <h2>Make your next move count.</h2>
                    <p>
                        {score !== undefined
                            ? "Your resume has a clear starting point. Let the Coach turn your score into a focused action plan."
                            : "Your personal career strategist is ready when your first resume analysis is complete."}
                    </p>
                    <div className="coach-action">
                        <span><CheckCircle2 size={16} /> {score !== undefined ? "1 priority identified" : "Waiting for your signal"}</span>
                        <button className="btn btn-light" onClick={() => setActivePage(score !== undefined ? "ai-feedback" : "resume")}>
                            {score !== undefined ? "View recommendation" : "Ask AI"} <ArrowUpRight size={15} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="progress-panel">
                <div className="panel-heading">
                    <div>
                        <span className="overline">CAREER PROGRESS</span>
                        <h2>Your journey has a shape.</h2>
                    </div>
                    <span className="quiet-badge">{score !== undefined ? "1 of 5 steps active" : "Not started"}</span>
                </div>

                <div className="progress-rail">
                    {[
                        ["Resume analysis", "resume", FileSearch],
                        ["ATS optimization", "company-score", Target],
                        ["Skill gap", "skill-gap", BarChart3],
                    ].map(([label, id, Icon], index) => (
                        <button
                            className={`progress-step ${index === 0 && score !== undefined ? "complete" : ""}`}
                            key={id}
                            onClick={() => setActivePage(id)}
                        >
                            <span className="step-icon"><Icon size={16} /></span>
                            <span>{label}</span>
                            {index < 2 && <i />}
                        </button>
                    ))}
                </div>
            </section>

            <section className="tools-section">
                <div className="section-heading-row">
                    <div>
                        <span className="overline">YOUR TOOLKIT</span>
                        <h2>Recommended for you.</h2>
                        <p>Every tool has a job in your career operating system.</p>
                    </div>
                    <button className="text-link" onClick={() => setActivePage("resume")}>
                        Explore workspace <ArrowUpRight size={15} />
                    </button>
                </div>

                {toolGroups.map((group) => (
                    <div className="tool-group" key={group.title}>
                        <div className="group-title">
                            <span>{group.label}</span>
                            <h3>{group.title}</h3>
                        </div>

                        <div className="tool-grid">
                            {group.items.map(([id, title, desc, Icon, color]) => (
                                <button className="tool-card" key={id} onClick={() => setActivePage(id)}>
                                    <span className="tool-icon" style={{ color, background: `${color}12` }}>
                                        <Icon size={20} />
                                    </span>
                                    <span className="tool-card-copy">
                                        <strong>{title}</strong>
                                        <span>{desc}</span>
                                    </span>
                                    <ArrowUpRight className="tool-arrow" size={17} />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
