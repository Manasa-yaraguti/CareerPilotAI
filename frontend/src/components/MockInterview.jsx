import { useState, useEffect } from "react";
import { MessagesSquare, Sparkles, CheckCircle2, AlertTriangle, Send, RefreshCw, Award } from "lucide-react";
import { getMockInterviewQuestions, evaluateInterviewAnswer } from "../services/api";

export default function MockInterview({ showToast }) {
    const roles = ["Backend Developer", "AI Engineer", "Full Stack Developer"];
    const [selectedRole, setSelectedRole] = useState("Backend Developer");
    const [questionsData, setQuestionsData] = useState(null);
    const [activeCategory, setActiveCategory] = useState("technical");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState("");

    const fetchQuestions = async (role) => {
        setLoadingQuestions(true);
        setEvaluationResult("");
        setUserAnswer("");
        try {
            const data = await getMockInterviewQuestions(role);
            setQuestionsData(data.questions || {});
            const techList = data.questions?.technical || [];
            if (techList.length > 0) {
                setSelectedQuestion(techList[0]);
            }
        } catch (err) {
            showToast(err.message || "Failed to load interview questions", "error");
        } finally {
            setLoadingQuestions(false);
        }
    };

    useEffect(() => {
        fetchQuestions(selectedRole);
    }, [selectedRole]);

    const handleEvaluate = async () => {
        if (!selectedQuestion) {
            showToast("Please select an interview question.", "error");
            return;
        }
        if (!userAnswer.trim()) {
            showToast("Please provide your answer before submitting for evaluation.", "error");
            return;
        }

        setEvaluating(true);
        try {
            const data = await evaluateInterviewAnswer({
                question: selectedQuestion,
                answer: userAnswer.trim()
            });
            setEvaluationResult(data.evaluation || "Evaluation completed.");
            showToast("AI Interview Answer evaluated!", "success");
        } catch (err) {
            showToast(err.message || "Failed to evaluate interview answer", "error");
        } finally {
            setEvaluating(false);
        }
    };

    const currentQuestions = questionsData ? (questionsData[activeCategory] || []) : [];

    return (
        <div>
            <div className="section-header">
                <h1>AI Mock Interview Room & Answer Evaluator</h1>
                <p>Simulate realistic interview rounds (HR, Technical, Coding) with real-time scoring and critique from an AI interviewer.</p>
            </div>

            {/* Role & Category Selector */}
            <div className="glass-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-secondary)" }}>Target Track:</span>
                        {roles.map((r) => (
                            <button
                                key={r}
                                type="button"
                                className={`btn ${selectedRole === r ? "btn-primary" : "btn-secondary"}`}
                                style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                                onClick={() => setSelectedRole(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                        {["technical", "hr", "coding"].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={`btn ${activeCategory === cat ? "btn-outline-primary" : "btn-secondary"}`}
                                style={{ padding: "6px 12px", fontSize: "0.8rem", textTransform: "uppercase" }}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    if (questionsData?.[cat]?.length > 0) {
                                        setSelectedQuestion(questionsData[cat][0]);
                                    }
                                }}
                            >
                                {cat} Round
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Interactive Split View */}
            <div className="grid-2">
                {/* Questions List & Answer Box */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "14px" }}>
                        Interview Question Bank ({activeCategory.toUpperCase()})
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                        {currentQuestions.map((q, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    setSelectedQuestion(q);
                                    setEvaluationResult("");
                                }}
                                style={{
                                    padding: "12px 14px",
                                    borderRadius: "var(--radius-sm)",
                                    border: `1px solid ${selectedQuestion === q ? "var(--primary)" : "var(--border-color)"}`,
                                    background: selectedQuestion === q ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.02)",
                                    color: selectedQuestion === q ? "#FFF" : "var(--text-primary)",
                                    fontSize: "0.88rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.15s ease"
                                }}
                            >
                                {idx + 1}. {q}
                            </div>
                        ))}
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: "var(--text-primary)" }}>
                            Selected Question: <strong>{selectedQuestion}</strong>
                        </label>
                        <textarea
                            className="form-textarea"
                            style={{ minHeight: "180px" }}
                            placeholder="Type or paste your answer here as you would speak in an actual interview..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={handleEvaluate}
                        disabled={evaluating || !userAnswer.trim()}
                    >
                        {evaluating ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                        <span>{evaluating ? "Evaluating Answer..." : "Submit Answer For AI Evaluation"}</span>
                    </button>
                </div>

                {/* AI Evaluation Report */}
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Award size={18} color="var(--primary)" />
                        <span>AI Interviewer Evaluation & Score</span>
                    </h3>

                    {evaluationResult ? (
                        <div style={{
                            background: "var(--bg-input)",
                            padding: "20px",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)",
                            fontSize: "0.9rem",
                            lineHeight: 1.7,
                            whiteSpace: "pre-wrap",
                            color: "var(--text-primary)"
                        }}>
                            {evaluationResult}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
                            <MessagesSquare size={40} style={{ marginBottom: "12px", opacity: 0.4 }} />
                            <p>Select a question, type your response, and click submit to receive a score and ideal model answer.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
