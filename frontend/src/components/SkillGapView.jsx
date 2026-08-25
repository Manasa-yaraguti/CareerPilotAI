import { useState } from "react";
import { GraduationCap, CheckCircle, XCircle, BookOpen, Clock, BarChart2, ArrowRight } from "lucide-react";
import { analyzeSkillGap } from "../services/api";

export default function SkillGapView({ resumeData, showToast, setActivePage }) {
    const roles = [
        "AI Engineer",
        "Data Scientist",
        "Backend Developer",
        "Full Stack Developer",
        "Cloud Engineer",
        "Software Engineer"
    ];

    const [selectedRole, setSelectedRole] = useState("AI Engineer");
    const [manualResume, setManualResume] = useState("");
    const [loading, setLoading] = useState(false);
    const [gapData, setGapData] = useState(null);

    const handleAnalyze = async () => {
        let resumeContent = "";
        if (resumeData?.resume) {
            resumeContent = typeof resumeData.resume === "object"
                ? JSON.stringify(resumeData.resume)
                : String(resumeData.resume);
        } else if (manualResume.trim()) {
            resumeContent = manualResume.trim();
        } else {
            showToast("Please provide a resume to analyze skill gaps.", "error");
            return;
        }

        setLoading(true);
        try {
            const data = await analyzeSkillGap({
                resume: resumeContent,
                jobRole: selectedRole
            });
            setGapData(data);
            showToast(`Analyzed skill gap for ${selectedRole}!`, "success");
        } catch (err) {
            showToast(err.message || "Failed to analyze skill gap", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="section-header">
                <h1>Skill Gap Analyzer & Personalized Learning Roadmaps</h1>
                <p>Pinpoint exact technical skills required for your target role and generate structured milestones with curated courses.</p>
            </div>

            <div className="grid-2" style={{ marginBottom: "24px" }}>
                {/* Role Selection & Input */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "16px" }}>
                        Select Desired Career Role
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "20px" }}>
                        {roles.map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setSelectedRole(r)}
                                style={{
                                    padding: "12px",
                                    borderRadius: "var(--radius-sm)",
                                    border: `1px solid ${selectedRole === r ? "var(--primary)" : "var(--border-color)"}`,
                                    background: selectedRole === r ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.02)",
                                    color: selectedRole === r ? "#FFF" : "var(--text-secondary)",
                                    fontWeight: 600,
                                    fontSize: "0.88rem",
                                    cursor: "pointer",
                                    textAlign: "left"
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {!resumeData && (
                        <div className="form-group">
                            <label className="form-label">Resume Text</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Paste your resume here..."
                                value={manualResume}
                                onChange={(e) => setManualResume(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        <GraduationCap size={16} />
                        <span>{loading ? "Analyzing Gaps..." : `Analyze Gaps for ${selectedRole}`}</span>
                    </button>
                </div>

                {/* Score & Skill Highlights */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "16px" }}>
                        Role Match Readiness
                    </h3>

                    {gapData ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "var(--radius-md)" }}>
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                                        {gapData.job_role} Match
                                    </div>
                                    <div style={{ fontSize: "2rem", fontWeight: 800, color: gapData.match_percentage >= 70 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                                        {gapData.match_percentage}%
                                    </div>
                                </div>
                                <div className={`badge ${gapData.match_percentage >= 70 ? "badge-excellent" : "badge-average"}`}>
                                    {gapData.matched_skills?.length} of {(gapData.matched_skills?.length || 0) + (gapData.missing_skills?.length || 0)} Skills Verified
                                </div>
                            </div>

                            {/* Matched Skills */}
                            <div>
                                <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-emerald)", textTransform: "uppercase", marginBottom: "8px" }}>
                                    ✓ Matched Skills ({gapData.matched_skills?.length || 0})
                                </h4>
                                <div className="tags-cloud">
                                    {gapData.matched_skills?.map((sk, i) => (
                                        <span key={i} className="tag-chip matched">
                                            {sk}
                                        </span>
                                    ))}
                                    {(!gapData.matched_skills || gapData.matched_skills.length === 0) && (
                                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No matching core skills identified.</span>
                                    )}
                                </div>
                            </div>

                            {/* Missing Skills */}
                            <div>
                                <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-rose)", textTransform: "uppercase", marginBottom: "8px" }}>
                                    ⚠ Missing Skills To Acquire ({gapData.missing_skills?.length || 0})
                                </h4>
                                <div className="tags-cloud">
                                    {gapData.missing_skills?.map((sk, i) => (
                                        <span key={i} className="tag-chip missing">
                                            {sk}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
                            <GraduationCap size={40} style={{ marginBottom: "12px", opacity: 0.4 }} />
                            <p>Select a target role on the left and run analysis to uncover your skill gaps.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Learning Roadmap Cards */}
            {gapData && gapData.learning_roadmap?.length > 0 && (
                <div className="glass-card" style={{ marginTop: "24px" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFF", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <BookOpen size={20} color="var(--primary)" />
                        <span>Recommended Learning Roadmap for Missing Skills</span>
                    </h3>

                    <div className="grid-3">
                        {gapData.learning_roadmap.map((step, idx) => (
                            <div key={idx} style={{ padding: "16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                                        Step {idx + 1}
                                    </span>
                                    <span className="badge badge-average" style={{ fontSize: "0.7rem" }}>
                                        {step.difficulty}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFF", marginBottom: "8px" }}>
                                    {step.skill}
                                </h4>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "10px" }}>
                                    <Clock size={13} />
                                    <span>Est. Duration: {step.duration}</span>
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                    Recommended: <strong>{step.course}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
