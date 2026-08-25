import { useState } from "react";
import { Edit3, Sparkles, Copy, Download, Check, RefreshCw } from "lucide-react";
import { rewriteResume } from "../services/api";

export default function ResumeRewriter({ resumeData, showToast }) {
    const [rawResume, setRawResume] = useState("");
    const [rewrittenText, setRewrittenText] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRewrite = async () => {
        let resumeContent = "";
        if (rawResume.trim()) {
            resumeContent = rawResume.trim();
        } else if (resumeData?.resume) {
            resumeContent = typeof resumeData.resume === "object"
                ? JSON.stringify(resumeData.resume)
                : String(resumeData.resume);
        } else {
            showToast("Please provide resume text to rewrite.", "error");
            return;
        }

        setLoading(true);
        try {
            const email = localStorage.getItem("careerpilot_email") || "user@careerpilot.ai";
            const data = await rewriteResume({
                resume: resumeContent,
                email,
                filename: resumeData?.filename || "resume.pdf"
            });
            setRewrittenText(data.rewritten_resume || "");
            showToast("Resume professionally rewritten and saved to history!", "success");
        } catch (err) {
            showToast(err.message || "Failed to rewrite resume", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!rewrittenText) return;
        navigator.clipboard.writeText(rewrittenText);
        setCopied(true);
        showToast("Copied rewritten resume to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!rewrittenText) return;
        const blob = new Blob([rewrittenText], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Rewritten_Resume.md";
        a.click();
        URL.revokeObjectURL(url);
        showToast("Downloaded Rewritten_Resume.md", "success");
    };

    return (
        <div>
            <div className="section-header">
                <h1>AI Resume Rewriter & Enhancement Studio</h1>
                <p>Transform your existing bullet points into ATS-optimized, high-impact statements loaded with action verbs and quantifiable metrics.</p>
            </div>

            <div className="grid-2" style={{ marginBottom: "24px" }}>
                {/* Input Card */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "16px" }}>
                        Source Resume Content
                    </h3>

                    <div className="form-group">
                        <label className="form-label">
                            {resumeData ? "Review or edit resume text before rewriting:" : "Paste your current resume:"}
                        </label>
                        <textarea
                            className="form-textarea"
                            style={{ minHeight: "340px", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
                            placeholder="Paste your raw resume text here..."
                            value={rawResume || (resumeData ? JSON.stringify(resumeData.resume, null, 2) : "")}
                            onChange={(e) => setRawResume(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={handleRewrite}
                        disabled={loading}
                    >
                        {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        <span>{loading ? "Rewriting Professionally..." : "Rewrite Resume with AI"}</span>
                    </button>
                </div>

                {/* Rewritten Output Card */}
                <div className="glass-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF" }}>
                            Polished ATS-Optimized Output
                        </h3>

                        {rewrittenText && (
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={handleCopy}>
                                    {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                                    <span>{copied ? "Copied" : "Copy"}</span>
                                </button>
                                <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={handleDownload}>
                                    <Download size={14} />
                                    <span>Export .md</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {rewrittenText ? (
                        <div style={{
                            background: "var(--bg-input)",
                            padding: "20px",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)",
                            minHeight: "340px",
                            maxHeight: "500px",
                            overflowY: "auto",
                            fontSize: "0.9rem",
                            lineHeight: 1.7,
                            whiteSpace: "pre-wrap",
                            color: "var(--text-primary)"
                        }}>
                            {rewrittenText}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "100px 20px", color: "var(--text-muted)" }}>
                            <Edit3 size={40} style={{ marginBottom: "12px", opacity: 0.4 }} />
                            <p>Click "Rewrite Resume with AI" on the left to generate your optimized resume version.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
