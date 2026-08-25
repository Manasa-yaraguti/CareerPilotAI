import { useState } from "react";
import { X, Lock, Mail, User, ArrowRight, CheckCircle } from "lucide-react";
import { loginUser, registerUser } from "../services/api";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const data = await loginUser({ email, password });
                if (data.access_token) {
                    localStorage.setItem("careerpilot_token", data.access_token);
                    localStorage.setItem("careerpilot_email", email);
                    onAuthSuccess({ email, sub: email });
                    showToast("Successfully signed in!", "success");
                    onClose();
                }
            } else {
                if (!fullName) {
                    throw new Error("Please enter your full name.");
                }
                await registerUser({ email, password, full_name: fullName });
                showToast("Account created successfully! Signing you in...", "success");
                
                // Automatically log in
                const data = await loginUser({ email, password });
                if (data.access_token) {
                    localStorage.setItem("careerpilot_token", data.access_token);
                    localStorage.setItem("careerpilot_email", email);
                    onAuthSuccess({ email, sub: email, full_name: fullName });
                    onClose();
                }
            }
        } catch (err) {
            setError(err.message || "Authentication failed");
            showToast(err.message || "Authentication error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                        {isLogin ? "Welcome Back" : "Create Candidate Account"}
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        {isLogin
                            ? "Sign in to save resume analyses and track ATS history"
                            : "Unlock personalized career roadmaps and interview simulations"}
                    </p>
                </div>

                {error && (
                    <div style={{ padding: "10px 14px", background: "rgba(244, 63, 94, 0.15)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "var(--radius-sm)", color: "#FDA4AF", fontSize: "0.85rem", marginBottom: "16px" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ paddingLeft: "36px" }}
                                    placeholder="Jane Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: "36px" }}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="password"
                                className="form-input"
                                style={{ paddingLeft: "36px" }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", marginTop: "12px", padding: "12px" }}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : (
                            <>
                                <span>{isLogin ? "Sign In" : "Register Account"}</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                        style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
}
