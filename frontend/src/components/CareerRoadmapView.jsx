import { useState, useEffect } from "react";
import { Compass, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { getCareerRoadmap } from "../services/api";

export default function CareerRoadmapView({ showToast }) {
    const tracks = ["AI Engineer", "Backend Developer"];
    const [selectedCareer, setSelectedCareer] = useState("AI Engineer");
    const [roadmapData, setRoadmapData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRoadmap = async (career) => {
        setLoading(true);
        try {
            const data = await getCareerRoadmap(career);
            setRoadmapData(data.roadmap || []);
        } catch (err) {
            showToast(err.message || "Failed to fetch career roadmap", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoadmap(selectedCareer);
    }, [selectedCareer]);

    return (
        <div>
            <div className="section-header">
                <h1>Career Path Planner & Milestones</h1>
                <p>Structured progression roadmap from foundational tools to enterprise production deployments.</p>
            </div>

            {/* Track Selector */}
            <div className="glass-card" style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-secondary)" }}>Choose Specialization:</span>
                    {tracks.map((t) => (
                        <button
                            key={t}
                            type="button"
                            className={`btn ${selectedCareer === t ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => setSelectedCareer(t)}
                        >
                            <Compass size={16} />
                            <span>{t}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Step-by-Step Roadmap Timeline */}
            <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{
                    position: "absolute",
                    left: "20px",
                    top: "10px",
                    bottom: "10px",
                    width: "2px",
                    background: "linear-gradient(180deg, var(--primary) 0%, rgba(99, 102, 241, 0.1) 100%)",
                    zIndex: 0
                }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 1 }}>
                    {roadmapData.map((step, idx) => (
                        <div
                            key={idx}
                            className="glass-card"
                            style={{
                                marginLeft: "48px",
                                position: "relative",
                                padding: "18px 24px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "12px"
                            }}
                        >
                            {/* Marker Node */}
                            <div style={{
                                position: "absolute",
                                left: "-48px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: "var(--bg-main)",
                                border: "2px solid var(--primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                color: "#FFF",
                                boxShadow: "0 0 12px rgba(99, 102, 241, 0.4)"
                            }}>
                                {step.step || idx + 1}
                            </div>

                            <div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "4px" }}>
                                    {step.title}
                                </h3>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                    Milestone {step.step || idx + 1} for {selectedCareer}
                                </p>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", background: "rgba(99, 102, 241, 0.12)", padding: "6px 12px", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 600 }}>
                                <Clock size={14} />
                                <span>{step.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
