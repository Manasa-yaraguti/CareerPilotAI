import { useState, useEffect } from "react";
import { Zap, Building2, CheckCircle, ExternalLink, ArrowRight, RefreshCw } from "lucide-react";
import { getJobRecommendations } from "../services/api";

export default function JobRecommendations({ resumeData, showToast, setActivePage }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [manualResume, setManualResume] = useState("");

    const fetchJobs = async () => {
        let resumeContent = "";
        if (resumeData?.resume) {
            resumeContent = typeof resumeData.resume === "object"
                ? JSON.stringify(resumeData.resume)
                : String(resumeData.resume);
        } else if (manualResume.trim()) {
            resumeContent = manualResume.trim();
        } else {
            showToast("Please upload a resume or paste resume text.", "error");
            return;
        }

        setLoading(true);
        try {
            const data = await getJobRecommendations(resumeContent);
            setJobs(data.recommended_jobs || []);
            showToast("Fetched AI job recommendations!", "success");
        } catch (err) {
            showToast(err.message || "Failed to fetch jobs", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (resumeData) {
            fetchJobs();
        }
    }, [resumeData]);

    return (
        <div>
            <div className="section-header">
                <h1>AI Job Role Recommendations</h1>
                <p>Opportunities matched against your technical strengths and verified resume competencies.</p>
            </div>

            <div className="glass-card" style={{ marginBottom: "24px" }}>
                {!resumeData && (
                    <div className="form-group" style={{ marginBottom: "16px" }}>
                        <label className="form-label">Resume Text</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Paste your resume here to find matching jobs..."
                            value={manualResume}
                            onChange={(e) => setManualResume(e.target.value)}
                        />
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        {resumeData ? `Matching against: ${resumeData.filename || "Uploaded Resume"}` : "Paste resume text to match openings."}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={fetchJobs}
                        disabled={loading}
                    >
                        {loading ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                        <span>{loading ? "Matching Roles..." : "Refresh Job Matches"}</span>
                    </button>
                </div>
            </div>

            {/* Jobs List Grid */}
            <div className="grid-2">
                {jobs.map((job, idx) => (
                    <div key={idx} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFF" }}>
                                        {job.title}
                                    </h3>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "2px" }}>
                                        <Building2 size={15} color="var(--primary)" />
                                        <span>{job.company}</span>
                                    </div>
                                </div>
                                <div className={`badge ${job.match_percentage >= 70 ? "badge-excellent" : job.match_percentage >= 50 ? "badge-average" : "badge-poor"}`} style={{ fontSize: "0.85rem", padding: "4px 12px" }}>
                                    {job.match_percentage}% Match
                                </div>
                            </div>

                            {/* Matched Skills */}
                            <div style={{ marginTop: "16px" }}>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>
                                    Matched Skills
                                </div>
                                <div className="tags-cloud">
                                    {job.matched_skills?.map((sk, i) => (
                                        <span key={i} className="tag-chip matched">
                                            {sk}
                                        </span>
                                    ))}
                                    {(!job.matched_skills || job.matched_skills.length === 0) && (
                                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>None yet</span>
                                    )}
                                </div>
                            </div>

                            {/* Required Skills */}
                            {job.required_skills && (
                                <div style={{ marginTop: "14px" }}>
                                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>
                                        All Required Skills
                                    </div>
                                    <div className="tags-cloud">
                                        {job.required_skills.map((sk, i) => (
                                            <span key={i} className="tag-chip">
                                                {sk}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            {jobs.length === 0 && !loading && (
                <div className="glass-card" style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                    <Zap size={44} style={{ marginBottom: "14px", opacity: 0.4 }} />
                    <p>Click "Refresh Job Matches" above to generate role opportunities matching your profile.</p>
                </div>
            )}
        </div>
    );
}
