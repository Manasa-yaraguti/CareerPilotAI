import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Edit3, ArrowRight } from "lucide-react";
import { getAIFeedback } from "../services/api";

export default function AIFeedbackView({ resumeData, showToast, setActivePage }) {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [manualResume, setManualResume] = useState("");

    const fetchFeedback = async () => {
        let resumeContent = "";
        if (resumeData?.resume) {
            resumeContent = typeof resumeData.resume === "object"
                ? JSON.stringify(resumeData.resume)
                : String(resumeData.resume);
        } else if (manualResume.trim()) {
            resumeContent = manualResume.trim();
        } else {
            showToast("Please upload a resume or paste your resume text.", "error");
            return;
        }

        setLoading(true);
        try {
            const data = await getAIFeedback(resumeContent);
            setFeedback(data.feedback || "No feedback generated.");
            showToast("AI Recruiter Review generated!", "success");
        } catch (err) {
            showToast(err.message || "Failed to generate AI feedback", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="section-header">
                <h1>AI Recruiter Critique & Comprehensive Feedback</h1>
                <p>Senior HR recruiter and ATS expert review of your strengths, weaknesses, formatting flaws, and optimization steps.</p>
            </div>

            <div className="glass-card" style={{ marginBottom: "24px" }}>
                {!resumeData && (
                    <div className="form-group" style={{ marginBottom: "16px" }}>
                        <label className="form-label">Resume Text</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Paste your resume here to receive AI feedback..."
                            value={manualResume}
                            onChange={(e) => setManualResume(e.target.value)}
                        />
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                        {resumeData ? (
                            <span>Analyzing document: <strong style={{ color: "var(--text-primary)" }}>{resumeData.filename || "Uploaded Resume"}</strong></span>
                        ) : (
                            <span>Paste resume text or upload a PDF from the Resume Analyzer tab.</span>
                        )}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={fetchFeedback}
                        disabled={loading}
                    >
                        {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        <span>{loading ? "Analyzing With AI..." : "Generate AI Recruiter Review"}</span>
                    </button>
                </div>
            </div>

            {feedback && (
                <div className="glass-card" style={{ borderLeft: "4px solid var(--primary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid var(--border-color)" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Sparkles size={20} color="var(--primary)" />
                            <span>Executive Summary & Analysis</span>
                        </h3>
                        <button className="btn btn-secondary" onClick={() => setActivePage("rewrite")}>
                            <Edit3 size={15} />
                            <span>Rewrite Resume</span>
                        </button>
                    </div>

                    <div style={{
                        color: "var(--text-primary)",
                        lineHeight: 1.8,
                        fontSize: "0.95rem",
                        whiteSpace: "pre-wrap",
                        fontFamily: "inherit"
                    }}>
                        {feedback}
                    </div>
                </div>
            )}
        </div>
    );
}
