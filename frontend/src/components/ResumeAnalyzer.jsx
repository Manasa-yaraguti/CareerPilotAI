import { useState, useRef } from "react";
import {
    Upload,
    FileText,
    CheckCircle,
    AlertTriangle,
    Sparkles,
    Check,
    XCircle,
    Building2,
    ArrowRight,
    Code,
    Award,
    Briefcase,
    BookOpen
} from "lucide-react";
import { uploadResume, calculateATSScore } from "../services/api";

export default function ResumeAnalyzer({
    resumeData,
    setResumeData,
    atsResult,
    setAtsResult,
    setActivePage,
    showToast
}) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
            setError("Please upload a PDF document (.pdf).");
            showToast("Only PDF format is supported for file parsing.", "error");
            return;
        }
        setFile(selectedFile);
        setError("");
    };

    const handleUploadAndAnalyze = async () => {
        if (!file) {
            setError("Please choose a PDF file first.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // 1. Upload & Parse PDF
            showToast("Parsing resume text from PDF...", "info");
            const uploadRes = await uploadResume(file);
            setResumeData(uploadRes);

            // 2. Calculate ATS Score
            const rawResumeString = typeof uploadRes.resume === "object"
                ? JSON.stringify(uploadRes.resume)
                : String(uploadRes.resume);

            showToast("Analyzing ATS compatibility and metrics...", "info");
            const atsRes = await calculateATSScore({
                resume: rawResumeString,
                company: "General"
            });

            setAtsResult(atsRes);
            showToast("Resume analyzed successfully!", "success");
        } catch (err) {
            setError(err.message || "Failed to analyze resume.");
            showToast(err.message || "Error analyzing resume", "error");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 85) return "#22C55E";
        if (score >= 70) return "#06B6D4";
        if (score >= 55) return "#8B5CF6";
        return "#EF4444";
    };

    const scoreMetrics = atsResult ? [
        { label: "Technical Skills", score: atsResult.skill_score || 0, icon: Code },
        { label: "Section Completeness", score: atsResult.section_score || 0, icon: CheckCircle },
        { label: "Format & Structure", score: atsResult.format_score || 0, icon: FileText },
        { label: "Keywords Match", score: atsResult.keyword_score || 0, icon: Sparkles },
        { label: "Experience & Impact", score: atsResult.experience_score || 0, icon: Briefcase },
        { label: "Education Details", score: atsResult.education_score || 0, icon: BookOpen },
        { label: "Projects & Tech", score: atsResult.project_score || 0, icon: Code },
        { label: "Certifications", score: atsResult.certification_score || 0, icon: Award },
    ] : [];

    return (
        <div>
            <div className="section-header">
                <h1>Resume Analyzer & ATS Scorecard</h1>
                <p>Upload your PDF resume to evaluate ATS screening compatibility, structure, and keyword density.</p>
            </div>

            {/* Upload Zone Card */}
            <div className="glass-card" style={{ marginBottom: "32px" }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                />

                <div
                    className="upload-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                    }}
                >
                    <div className="upload-icon-circle">
                        <Upload size={28} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                            {file ? file.name : "Click to browse or drag & drop PDF resume"}
                        </h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            Supports PDF documents up to 10MB
                        </p>
                    </div>
                </div>

                {error && (
                    <div style={{ padding: "10px 16px", background: "var(--error-light)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "var(--radius-sm)", color: "var(--error)", fontSize: "0.85rem", marginTop: "16px", fontWeight: 600 }}>
                        {error}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "12px" }}>
                    {file && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setFile(null);
                                setError("");
                            }}
                        >
                            Clear
                        </button>
                    )}
                    <button
                        className="btn btn-primary"
                        onClick={handleUploadAndAnalyze}
                        disabled={loading || !file}
                    >
                        <Sparkles size={16} />
                        <span>{loading ? "Analyzing Document..." : "Analyze Resume"}</span>
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {atsResult && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Overall Score Card + Quick Breakdown */}
                    <div className="grid-2">
                        {/* Gauge Card */}
                        <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "16px" }}>
                                Overall ATS Compatibility
                            </h3>

                            <div
                                className="score-circle"
                                style={{
                                    borderColor: getScoreColor(atsResult.overall_ats_score),
                                    boxShadow: `0 4px 20px ${getScoreColor(atsResult.overall_ats_score)}25`
                                }}
                            >
                                <span className="score-number">
                                    {Math.round(atsResult.overall_ats_score)}
                                </span>
                                <span className="score-max">/ 100</span>
                            </div>

                            <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
                                <span className={`badge ${
                                    atsResult.overall_ats_score >= 80 ? "badge-excellent" :
                                    atsResult.overall_ats_score >= 65 ? "badge-good" :
                                    atsResult.overall_ats_score >= 50 ? "badge-average" : "badge-poor"
                                }`}>
                                    Grade: {atsResult.grade}
                                </span>

                                <span className={`badge ${atsResult.ats_compatible ? "badge-excellent" : "badge-poor"}`}>
                                    {atsResult.ats_compatible ? <Check size={12} /> : <XCircle size={12} />}
                                    ATS Ready: {atsResult.ats_compatible ? "Yes" : "Needs Fixes"}
                                </span>
                            </div>

                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "14px", maxWidth: "340px" }}>
                                {atsResult.overall_ats_score >= 75
                                    ? "Strong resume! High probability of passing automated enterprise screening systems."
                                    : "Consider reviewing the suggestions below to boost keyword density and structure."}
                            </p>
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "18px" }}>
                                Metric Breakdown
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {scoreMetrics.map((m, idx) => (
                                    <div key={idx} className="progress-bar-container" style={{ margin: 0 }}>
                                        <div className="progress-bar-label">
                                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <m.icon size={14} color="var(--primary)" />
                                                {m.label}
                                            </span>
                                            <span style={{ fontWeight: 700, color: getScoreColor(m.score) }}>
                                                {Math.round(m.score)}%
                                            </span>
                                        </div>
                                        <div className="progress-track">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${Math.min(m.score, 100)}%`,
                                                    backgroundColor: getScoreColor(m.score)
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Extracted Skills & Suggestions Grid */}
                    <div className="grid-2">
                        {/* Skills & Sections */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
                                Detected Technical & Soft Skills
                            </h3>

                            {atsResult.skills?.technical_skills?.length > 0 ? (
                                <div style={{ marginBottom: "18px" }}>
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
                                        Technical Stack ({atsResult.skills.technical_skills.length})
                                    </div>
                                    <div className="tags-cloud">
                                        {atsResult.skills.technical_skills.map((skill, i) => (
                                            <span key={i} className="tag-chip matched">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No technical skills detected.</p>
                            )}

                            {atsResult.skills?.soft_skills?.length > 0 && (
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
                                        Soft Skills ({atsResult.skills.soft_skills.length})
                                    </div>
                                    <div className="tags-cloud">
                                        {atsResult.skills.soft_skills.map((skill, i) => (
                                            <span key={i} className="tag-chip">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Found vs Missing Sections */}
                            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--border-color)" }}>
                                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
                                    Resume Section Audit
                                </h4>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {atsResult.sections?.found_sections?.map((sec, i) => (
                                        <span key={i} className="badge badge-excellent" style={{ textTransform: "capitalize" }}>
                                            <Check size={12} /> {sec}
                                        </span>
                                    ))}
                                    {atsResult.sections?.missing_sections?.map((sec, i) => (
                                        <span key={i} className="badge badge-poor" style={{ textTransform: "capitalize" }}>
                                            <XCircle size={12} /> Missing: {sec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actionable Suggestions */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <AlertTriangle size={18} color="var(--secondary)" />
                                <span>Optimization Recommendations</span>
                            </h3>

                            <div className="suggestion-list">
                                {atsResult.suggestions?.map((sug, i) => (
                                    <div key={i} className="suggestion-item">
                                        <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                                        <span>{sug}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setActivePage("company-score")}>
                                    <Building2 size={16} />
                                    <span>Target Companies</span>
                                </button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setActivePage("ai-feedback")}>
                                    <Sparkles size={16} />
                                    <span>AI Recruiter Review</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}