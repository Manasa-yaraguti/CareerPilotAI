import { Sparkles, User, LogIn, LogOut, CheckCircle2, Shield } from "lucide-react";

export default function Navbar({ currentUser, onOpenAuth, onLogout, activeTabTitle }) {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <div className="page-badge">
                    <Sparkles size={14} />
                    <span>CareerPilot workspace</span>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>/</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                    {activeTabTitle || "Dashboard"}
                </span>
            </div>

            <div className="navbar-right">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-emerald)", fontSize: "0.78rem", fontWeight: 600, padding: "4px 10px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "9999px" }}>
                    <CheckCircle2 size={13} />
                    <span>AI Backend Online</span>
                </div>

                {currentUser ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                            <Shield size={14} color="var(--primary)" />
                            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{currentUser.sub || currentUser.email || "Candidate"}</span>
                        </div>
                        <button className="btn btn-secondary" onClick={onLogout} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                            <LogOut size={14} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={onOpenAuth} style={{ padding: "7px 14px", fontSize: "0.82rem" }}>
                        <LogIn size={15} />
                        <span>Sign In / Register</span>
                    </button>
                )}
            </div>
        </header>
    );
}
