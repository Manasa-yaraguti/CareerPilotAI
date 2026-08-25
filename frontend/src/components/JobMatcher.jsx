import { useState } from "react";
import { Briefcase, CheckCircle, XCircle, Sparkles, ArrowRight, Percent } from "lucide-react";
import { matchResumeJob } from "../services/api";

export default function JobMatcher({ resumeData, showToast, setActivePage }) {
    const [jobDescription, setJobDescription] = useState("");
    const [customResume, setCustomResume] = useState("");
    const [loading, setLoading] = useState(false);
    const [matchResult, setMatchResult] = useState(null);

    const handleMatch = async () => {
        let resumeContent = "";
        if (customResume.trim()) {
            resumeContent = customResume.trim();
        } else if (resumeData?.resume) {
            resumeContent = typeof resumeData.resume === "object"
                ? JSON.stringify(resumeData.resume)
                : String(resumeData.resume);
        } else {
            showToast("Please provide a resume by uploading or pasting text.", "error");
            return;
        }

        if (!jobDescription.trim()) {
            showToast("Please paste the job description.", "error");
            return;
        }

        setLoading(true);
        try {
            const data = await matchResumeJob({
                resume: resumeContent,
                jobDescription: jobDescription.trim()
            });
            setMatchResult(data);
            showToast("Calculated resume vs job match!", "success");
        } catch (err) {
            showToast(err.message || "Failed to compare job description", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="section-header">
                <h1>Resume vs Job Description Matcher</h1>
                <p>Paste a job posting description to analyze keyword coverage and optimize your application for automated screens.</p>
            </div>

            <div className="grid-2" style={{ marginBottom: "24px" }}>
                {/* Inputs Card */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "16px" }}>
                        Target Job Description
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Paste Job Description / Requirements</label>
                        <textarea
                            className="form-textarea"
                            style={{ minHeight: "180px" }}
                            placeholder="Paste the full job posting, roles, and required qualifications here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    {!resumeData && (
                        <div className="form-group">
                            <label className="form-label">Resume Text</label>
                            <textarea
                                className="form-textarea"
                                style={{ minHeight: "120px" }}
                                placeholder="Paste your resume content here (or upload a PDF in the Resume Analyzer)..."
                                value={customResume}
                                onChange={(e) => setCustomResume(e.target.value)}
                            />
                        </div>
                    )}

                    {resumeData && (
                        <div style={{ padding: "10px 14px", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "var(--radius-sm)", color: "#A5B4FC", fontSize: "0.85rem", marginBottom: "16px" }}>
                            Using active uploaded resume: <strong>{resumeData.filename || "Uploaded File"}</strong>
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={handleMatch}
                        disabled={loading}
                    >
                        <Briefcase size={16} />
                        <span>{loading ? "Matching Keywords..." : "Calculate Job Match"}</span>
                    </button>
                </div>

                {/* Match Results Card */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "16px" }}>
                        Match Analysis & Keyword Coverage
                    </h3>

                    {matchResult ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {/* Score Display */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "var(--radius-md)" }}>
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                                        Job Relevance Score
                                    </div>
                                    <div style={{ fontSize: "2rem", fontWeight: 800, color: matchResult.match_percentage >= 70 ? "var(--accent-emerald)" : matchResult.match_percentage >= 50 ? "var(--accent-amber)" : "var(--accent-rose)" }}>
                                        {matchResult.match_percentage}%
                                    </div>
                                </div>
                                <div className={`badge ${matchResult.match_percentage >= 70 ? "badge-excellent" : matchResult.match_percentage >= 50 ? "badge-average" : "badge-poor"}`}>
                                    {matchResult.match_percentage >= 70 ? "High Match" : matchResult.match_percentage >= 50 ? "Moderate Match" : "Low Keyword Overlap"}
                                </div>
                            </div>

                            {/* Matched Keywords */}
                            <div>
                                <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-emerald)", textTransform: "uppercase", marginBottom: "8px" }}>
                                    ✓ Matched Keywords ({matchResult.matched_keywords?.length || 0})
                                </h4>
                                <div className="tags-cloud" style={{ maxHeight: "150px", overflowY: "auto" }}>
                                    {matchResult.matched_keywords?.map((kw, i) => (
                                        <span key={i} className="tag-chip matched">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Missing Keywords */}
                            <div>
                                <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-rose)", textTransform: "uppercase", marginBottom: "8px" }}>
                                    ⚠ Missing JD Keywords ({matchResult.missing_keywords?.length || 0})
                                </h4>
                                <div className="tags-cloud" style={{ maxHeight: "150px", overflowY: "auto" }}>
                                    {matchResult.missing_keywords?.slice(0, 30).map((kw, i) => (
                                        <span key={i} className="tag-chip missing">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button className="btn btn-secondary" style={{ width: "100%" }} onClick={() => setActivePage("rewrite")}>
                                <Sparkles size={16} />
                                <span>Optimize Resume With AI Rewriter</span>
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
                            <Briefcase size={40} style={{ marginBottom: "12px", opacity: 0.4 }} />
                            <p>Paste a job description on the left and run analysis to uncover keyword alignment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
