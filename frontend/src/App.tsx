import { NavLink, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Icon from "./components/Icon";
import Home from "./pages/Home";
import Enrollment from "./pages/Enrollment";
import Maintenance from "./pages/Maintenance";
import Renewal from "./pages/Renewal";
import AIAssistant from "./pages/AIAssistant";

const navigation = [
  { to: "/", label: "Overview", icon: "home" as const, end: true },
  { to: "/enrollment", label: "Explore plans", icon: "shield" as const },
  { to: "/maintenance", label: "My policy", icon: "file" as const },
  { to: "/renewal", label: "Renewal", icon: "refresh" as const },
  { to: "/assistant", label: "AI assistant", icon: "sparkles" as const },
];

function Shell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          className="mobile-menu-button icon-button"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Icon name={mobileMenuOpen ? "close" : "menu"} />
        </button>
        <NavLink to="/" className="brand" aria-label="HealthBridge AI home">
          <span className="brand-mark"><Icon name="heart" size={22} /></span>
          <span className="brand-name">healthbridge<span>AI</span></span>
        </NavLink>
        <div className="topbar-right">
          <span className="environment-pill"><span /> Demo environment</span>
          <div className="avatar" aria-label="Demo member">JL</div>
        </div>
      </header>

      <div className="shell-body">
        <aside className={`sidebar${mobileMenuOpen ? " sidebar-open" : ""}`}>
          <div className="side-label">YOUR HEALTH</div>
          <nav className="side-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `side-link${isActive ? " active" : ""}`}
              >
                <Icon name={item.icon} size={19} />
                <span>{item.label}</span>
                {item.to === "/assistant" && <span className="new-tag">AI</span>}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-help">
            <div className="help-icon"><Icon name="chat" size={19} /></div>
            <strong>Here to help</strong>
            <p>Questions about your coverage? Our AI assistant is a good place to start.</p>
            <NavLink to="/assistant" className="text-link">
              Ask a question <Icon name="arrow" size={15} />
            </NavLink>
          </div>
          <div className="sidebar-foot"><Icon name="lock" size={14} /> Your information stays private</div>
        </aside>
        {mobileMenuOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} />}

        <div className="main-column">
          <div className="demo-banner">
            <Icon name="alert" size={16} />
            <span><strong>Fictional Hackathon Demo</strong> — All plans, policies, and transactions are synthetic. No real insurance coverage is offered.</span>
          </div>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/enrollment" element={<Enrollment />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/renewal" element={<Renewal />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <footer className="site-footer">
            <span>HealthBridge AI <span className="footer-dot">•</span> A fictional demonstration</span>
            <span>Built to make health coverage easier to understand.</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <Shell />;
}
