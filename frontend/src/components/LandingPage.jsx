import { ArrowRight, BarChart3, CheckCircle2, FileSearch, LogIn, Sparkles, Target } from "lucide-react";

export default function LandingPage({ onLogin, onGetStarted, onExplore }) {
    return (
        <div className="simple-home">
            <header className="simple-home-nav">
                <button className="simple-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="simple-brand-icon"><Sparkles size={18} /></span><span><strong>CareerPilot</strong><small>AI Career Engine</small></span></button>
                <nav className="simple-nav-links"><a href="#features">Features</a><a href="#how-it-works">How It Works</a></nav>
                <div className="simple-nav-actions"><button className="simple-login" onClick={onLogin}><LogIn size={15} /> Login</button><button className="btn btn-primary" onClick={onGetStarted}>Get Started <ArrowRight size={16} /></button></div>
            </header>
            <main>
                <section className="simple-hero">
                    <div className="simple-hero-copy"><span className="simple-eyebrow"><span /> Your career, made clearer</span><h1>Build your next career move with confidence.</h1><p>CareerPilot brings your resume, ATS score, skills, interviews, and career goals into one simple workspace.</p><div className="simple-hero-actions"><button className="btn btn-primary btn-large" onClick={onGetStarted}>Get Started <ArrowRight size={17} /></button><button className="simple-secondary-button" onClick={onExplore}>See how it works</button></div><div className="simple-trust"><CheckCircle2 size={16} /> Everything you need for your career journey</div></div>
                    <div className="simple-preview"><div className="simple-preview-header"><span><i /> <i /> <i /></span><strong>CareerPilot Workspace</strong><small>● Online</small></div><div className="simple-preview-content"><div className="simple-preview-welcome"><small>YOUR CAREER COMMAND CENTER</small><h2>Welcome back.</h2><p>Choose your next best step.</p></div><div className="simple-preview-score"><div className="simple-score-circle"><strong>--</strong><small>Readiness</small></div><div><strong>Start with your resume</strong><p>Analyze your profile to see your real career metrics.</p><button onClick={onGetStarted}>Open workspace <ArrowRight size={13} /></button></div></div><div className="simple-preview-actions"><span><FileSearch size={15} /> Resume analysis</span><span><Target size={15} /> Target roles</span><span><BarChart3 size={15} /> Career progress</span></div></div></div>
                </section>
                <section className="simple-section" id="features"><div className="simple-section-heading"><span className="simple-eyebrow">One place to move forward</span><h2>Everything you need, without the confusion.</h2><p>Use clear insights and practical tools to make better career decisions.</p></div><div className="simple-feature-grid"><Feature icon={FileSearch} title="Understand your resume" text="See your ATS score and the strengths and gaps recruiters notice." /><Feature icon={Target} title="Choose the right direction" text="Compare your profile with roles, companies, and career paths." /><Feature icon={BarChart3} title="Track your progress" text="Keep improving with focused recommendations and practice tools." /></div></section>
                <section className="simple-how" id="how-it-works"><div><span className="simple-eyebrow">How it works</span><h2>Start with one simple step.</h2></div><div className="simple-steps"><div><b>1</b><span><strong>Upload your resume</strong><small>Give CareerPilot your starting point.</small></span></div><div><b>2</b><span><strong>See your opportunities</strong><small>Understand what to improve next.</small></span></div><div><b>3</b><span><strong>Take action</strong><small>Use your personalized career tools.</small></span></div></div></section>
            </main>
        </div>
    );
}

function Feature({ icon: Icon, title, text }) { return <article className="simple-feature"><span><Icon size={20} /></span><h3>{title}</h3><p>{text}</p></article>; }