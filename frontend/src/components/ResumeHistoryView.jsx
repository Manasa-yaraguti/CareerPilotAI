import { useState, useEffect } from "react";
import { History, FileText, Calendar, Award, Building2, RefreshCw } from "lucide-react";
import { getResumeHistory } from "../services/api";

export default function ResumeHistoryView({ currentUser, onOpenAuth, showToast }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const email = currentUser?.sub || currentUser?.email || localStorage.getItem("careerpilot_email") || "user@careerpilot.ai";

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await getResumeHistory(email);
            setHistory(data || []);
        } catch (err) {
            showToast(err.message || "Failed to load resume history", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [email]);

    return (
        <div>
            <div className="section-header">
                <h1>Resume Evaluation & Version History</h1>
                <p>Track your ATS improvements and score progression across analyzed documents.</p>
            </div>

            <div className="glass-card" style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    Showing historical scans for: <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
                </div>
                <button className="btn btn-secondary" onClick={fetchHistory} disabled={loading}>
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                    <span>Refresh History</span>
                </button>
            </div>

            {/* History Table / Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {history.map((item, idx) => (
                    <div
                        key={idx}
                        className="glass-card"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "16px",
                            padding: "16px 20px"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <div style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "var(--radius-sm)",
                                background: "rgba(99, 102, 241, 0.15)",
                                border: "1px solid rgba(99, 102, 241, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--primary)"
                            }}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", overflowWrap: "anywhere" }}>
                                    {item.filename || "resume.pdf"}
                                </h4>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Calendar size={13} /> {item.created_at || "Recent"}
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Building2 size={13} /> {item.company || "General"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                                    ATS Score
                                </div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: (item.ats_score || 0) >= 70 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                                    {item.ats_score || 0}%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {history.length === 0 && !loading && (
                    <div className="glass-card" style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                        <History size={40} style={{ marginBottom: "12px", opacity: 0.4 }} />
                        <p>No previous resume evaluations found for {email}.</p>
                        <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
                            Resumes analyzed with AI Rewriter are automatically saved here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
