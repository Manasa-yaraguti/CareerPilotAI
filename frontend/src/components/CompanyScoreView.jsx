import { useState } from "react";
import { Building2, CheckCircle, XCircle, Sparkles, ArrowRight } from "lucide-react";
import { calculateCompanyScore } from "../services/api";

export default function CompanyScoreView({ resumeData, showToast, setActivePage }) {
    const companies = [
        { id: "google", name: "Google", desc: "System Design, Algorithms, GCP, ML, Python, Go" },
        { id: "microsoft", name: "Microsoft", desc: "Azure, C#, .NET, Cloud, SQL, Python" },
        { id: "amazon", name: "Amazon", desc: "AWS, Microservices, Java, Linux, System Design" },
        { id: "meta", name: "Meta", desc: "React, GraphQL, PyTorch, ML, Distributed Systems" },
        { id: "apple", name: "Apple", desc: "Swift, Objective-C, C++, iOS, Algorithms" },
        { id: "netflix", name: "Netflix", desc: "Spring Boot, Kafka, AWS, Microservices, Redis" },
        { id: "infosys", name: "Infosys", desc: "Java, Python, SQL, React, Web Foundations" },
        { id: "tcs", name: "TCS", desc: "Java, Python, SQL, HTML/CSS, Problem Solving" },
        { id: "wipro", name: "Wipro", desc: "Python, Java, Linux, SQL, REST APIs" },
        { id: "accenture", name: "Accenture", desc: "Cloud, Docker, SQL, Java, Enterprise Tech" }
    ];

    const [selectedCompany, setSelectedCompany] = useState("google");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [manualResume, setManualResume] = useState("");

    const handleCalculate = async () => {
        let resumeContent = "";
        if (resumeData?.resume) {
            resumeContent = typeof resumeData.resume === "object"
                ? JSON.stringify(resumeData.resume)
                : String(resumeData.resume);
        } else if (manualResume.trim()) {
            resumeContent = manualResume.trim();
        } else {
            showToast("Please upload a resume or paste your resume text below.", "error");
            return;
        }

        setLoading(true);
        try {
            const data = await calculateCompanyScore({
                resume: resumeContent,
                company: selectedCompany
            });
            setResult(data);
            showToast(`Evaluated hiring match for ${selectedCompany.toUpperCase()}`, "success");
        } catch (err) {
            showToast(err.message || "Failed to calculate company match", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="section-header">
                <h1>Target Company ATS Evaluation</h1>
                <p>Compare your technical stack against specific hiring standards and profiles of premier tech companies.</p>
            </div>

            <div className="grid-2" style={{ marginBottom: "24px" }}>
                {/* Company Selection Panel */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
                        Select Target Company
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "20px" }}>
                        {companies.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => setSelectedCompany(c.id)}
                                style={{
                                    padding: "12px",
                                    borderRadius: "var(--radius-sm)",
                                    border: `1px solid ${selectedCompany === c.id ? "var(--primary)" : "var(--border-color)"}`,
                                    background: selectedCompany === c.id ? "var(--primary-light)" : "var(--bg-main)",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease"
                                }}
                            >
                                <div style={{ fontWeight: 700, color: selectedCompany === c.id ? "var(--primary)" : "var(--text-primary)", fontSize: "0.95rem" }}>
                                    {c.name}
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
                                    {c.desc}
                                </div>
                            </div>
                        ))}
                    </div>

                    {!resumeData && (
                        <div className="form-group">
                            <label className="form-label">Or Paste Resume Text (No PDF Uploaded Yet)</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Paste your resume content here..."
                                value={manualResume}
                                onChange={(e) => setManualResume(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={handleCalculate}
                        disabled={loading}
                    >
                        <Building2 size={16} />
                        <span>{loading ? "Matching Requirements..." : `Evaluate for ${selectedCompany.toUpperCase()}`}</span>
                    </button>
                </div>

                {/* Results Panel */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
                        Company ATS Screening Report
                    </h3>

                    {result ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "var(--bg-main)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                                        {result.company_analysis?.company || selectedCompany} Match Score
                                    </div>
                                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: (result.company_score || result.company_analysis?.match_percentage || 0) >= 70 ? "var(--success)" : "#D97706" }}>
                                        {result.company_score || result.company_analysis?.match_percentage || 0}%
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                                        Overall ATS Score
                                    </div>
                                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)" }}>
                                        {result.overall_ats_score}%
                                    </div>
                                </div>
                            </div>

                            {/* Matched Skills */}
                            <div>
                                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#15803D", textTransform: "uppercase", marginBottom: "8px" }}>
                                    ✓ Matched Company Requirements ({result.company_analysis?.matched?.length || 0})
                                </h4>
                                <div className="tags-cloud">
                                    {result.company_analysis?.matched?.map((sk, i) => (
                                        <span key={i} className="tag-chip matched">
                                            {sk}
                                        </span>
                                    ))}
                                    {(!result.company_analysis?.matched || result.company_analysis.matched.length === 0) && (
                                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No direct keyword overlaps detected yet.</span>
                                    )}
                                </div>
                            </div>

                            {/* Missing Skills */}
                            <div>
                                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--error)", textTransform: "uppercase", marginBottom: "8px" }}>
                                    ⚠ Missing Key Requirements ({result.company_analysis?.missing?.length || 0})
                                </h4>
                                <div className="tags-cloud">
                                    {result.company_analysis?.missing?.map((sk, i) => (
                                        <span key={i} className="tag-chip missing">
                                            {sk}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <button className="btn btn-secondary" style={{ width: "100%" }} onClick={() => setActivePage("skill-gap")}>
                                    <Sparkles size={16} />
                                    <span>Generate Targeted Skill Roadmap</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                            <Building2 size={36} style={{ marginBottom: "12px", opacity: 0.5 }} />
                            <p>Select a company on the left and click evaluate to see your hiring match score.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
