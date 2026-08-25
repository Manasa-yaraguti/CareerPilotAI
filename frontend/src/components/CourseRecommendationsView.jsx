import { useState, useEffect } from "react";
import { BookOpen, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { getCourseRecommendations } from "../services/api";

export default function CourseRecommendationsView({ showToast }) {
    const availableSkills = [
        "python",
        "fastapi",
        "docker",
        "postgresql",
        "react",
        "machine learning",
        "tensorflow",
        "aws",
        "azure",
        "uipath"
    ];

    const [selectedSkills, setSelectedSkills] = useState(["python", "docker", "fastapi"]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCourses = async (skills) => {
        setLoading(true);
        try {
            const data = await getCourseRecommendations(skills);
            setCourses(data || []);
        } catch (err) {
            showToast(err.message || "Failed to load course recommendations", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(selectedSkills);
    }, [selectedSkills]);

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((s) => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    return (
        <div>
            <div className="section-header">
                <h1>Curated Technical Courses & Certifications</h1>
                <p>Verified industry courses from top learning platforms mapped directly to target skills.</p>
            </div>

            {/* Skill Filter Chips */}
            <div className="glass-card" style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFF", marginBottom: "12px" }}>
                    Filter by Skills:
                </h3>
                <div className="tags-cloud">
                    {availableSkills.map((sk) => {
                        const isSelected = selectedSkills.includes(sk);
                        return (
                            <button
                                key={sk}
                                type="button"
                                onClick={() => toggleSkill(sk)}
                                className={`tag-chip ${isSelected ? "matched" : ""}`}
                                style={{ cursor: "pointer", textTransform: "capitalize", padding: "6px 14px" }}
                            >
                                {sk} {isSelected && "✓"}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid-3">
                {courses.map((c, idx) => (
                    <div key={idx} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <span className="badge badge-good" style={{ textTransform: "uppercase", fontSize: "0.75rem" }}>
                                    {c.skill}
                                </span>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                    {c.platform}
                                </span>
                            </div>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFF", marginBottom: "8px" }}>
                                {c.course}
                            </h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                Official certification curriculum on {c.platform}.
                            </p>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(c.platform + " " + c.course)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-secondary"
                                style={{ width: "100%", textDecoration: "none" }}
                            >
                                <ExternalLink size={15} />
                                <span>Explore Course</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="glass-card" style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                    <BookOpen size={40} style={{ marginBottom: "12px", opacity: 0.4 }} />
                    <p>Select one or more skill tags above to discover recommended courses.</p>
                </div>
            )}
        </div>
    );
}
