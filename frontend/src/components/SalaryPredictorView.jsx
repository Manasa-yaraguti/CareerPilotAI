import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Briefcase, Award, ArrowRight } from "lucide-react";
import { predictSalary } from "../services/api";

export default function SalaryPredictorView({ showToast }) {
    const roles = [
        "AI Engineer",
        "Backend Developer",
        "Full Stack Developer",
        "Data Scientist"
    ];

    const [selectedRole, setSelectedRole] = useState("AI Engineer");
    const [experience, setExperience] = useState(2);
    const [salaryData, setSalaryData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        try {
            const data = await predictSalary({
                role: selectedRole,
                experience: Number(experience)
            });
            setSalaryData(data);
        } catch (err) {
            showToast(err.message || "Failed to predict salary", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handlePredict();
    }, [selectedRole, experience]);

    const formatCurrency = (val) => {
        if (!val) return "₹0";
        const inLakhs = (val / 100000).toFixed(1);
        return `₹${val.toLocaleString("en-IN")} (${inLakhs} LPA)`;
    };

    return (
        <div>
            <div className="section-header">
                <h1>Tech Salary Estimator & Market Compensation</h1>
                <p>Calculate current market compensation benchmarks based on job role demand and verified experience tier.</p>
            </div>

            <div className="grid-2" style={{ marginBottom: "28px" }}>
                {/* Inputs Card */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "18px" }}>
                        Role & Experience Parameters
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Select Job Role</label>
                        <select
                            className="form-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {roles.map((r) => (
                                <option key={r} value={r} style={{ background: "#0F172A", color: "#FFF" }}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginTop: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <label className="form-label">Years of Experience</label>
                            <span style={{ fontWeight: 700, color: "var(--primary)" }}>{experience} {experience === 1 ? "Year" : "Years"}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="8"
                            step="1"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            style={{ width: "100%", accentColor: "var(--primary)" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                            <span>Entry (0-1 Yrs)</span>
                            <span>Mid (2-3 Yrs)</span>
                            <span>Senior (4+ Yrs)</span>
                        </div>
                    </div>
                </div>

                {/* Predicted Salary Result */}
                <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "18px" }}>
                            Estimated Compensation Package
                        </h3>

                        {salaryData ? (
                            <div style={{
                                padding: "24px",
                                borderRadius: "var(--radius-md)",
                                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.08))",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                textAlign: "center"
                            }}>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>
                                    Predicted Annual Salary ({salaryData.role})
                                </div>
                                <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#FFF", letterSpacing: "-0.03em" }}>
                                    {formatCurrency(salaryData.predicted_salary)}
                                </div>
                                <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-emerald)", fontSize: "0.85rem", fontWeight: 600 }}>
                                    <TrendingUp size={16} />
                                    <span>Based on active hiring trends in India / Global Tech</span>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)" }}>Calculating compensation...</p>
                        )}
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                        <div style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Entry Level</div>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>5 - 7 LPA</div>
                        </div>
                        <div style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Mid Level</div>
                            <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>10 - 14 LPA</div>
                        </div>
                        <div style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Senior Tier</div>
                            <div style={{ fontWeight: 700, color: "var(--accent-emerald)", fontSize: "0.9rem" }}>16 - 22+ LPA</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
