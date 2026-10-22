import { useState } from "react";
import {
  Plus,
  Sun,
  Moon,
  Info,
  HeartPulse,
  ArrowUpRight,
  Github,
} from "lucide-react";
import { SAFETY } from "./engine";
import Home from "./pages/Home";
import Library from "./pages/Library";
import About from "./pages/About";
import Testing from "./pages/Testing";
import Presentation from "./pages/Presentation";
const routes = [
  ["/", "Check a claim"],
  ["/library", "Myth Library"],
  ["/about", "How it works"],
  ["/testing", "Testing Lab"],
  ["/presentation", "For judges"],
];
export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("hmb-theme") === "dark";
    } catch {
      return false;
    }
  });
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  function toggle() {
    setDark((v) => !v);
    try {
      localStorage.setItem("hmb-theme", dark ? "light" : "dark");
    } catch {
      /* Theme remains available for this session. */
    }
  }
  return (
    <div className={dark ? "app dark" : "app"}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header>
        <div className="nav-shell">
          <a href="/" className="brand">
            <span className="brand-icon">
              <Plus size={27} strokeWidth={3} />
            </span>
            <span>
              health<span className="brand-light">myth</span>
              <strong> BUSTER</strong>
            </span>
          </a>
          <nav aria-label="Main navigation">
            {routes.map(([url, label]) => (
              <a
                key={url}
                href={url}
                aria-current={path === url ? "page" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <button
            className="theme-button"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggle}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
        <div className="top-credits-wrap">
          <div className="top-credits">
            <div className="team-credit">
              <p className="developer-credit">
                Built and developed by <strong>Nihit Sunhare</strong>
              </p>
              <span className="credit-label">Team members</span>
              <ul aria-label="Team members">
                <li>Rudransh Sahu</li>
                <li>Priyushi Agrawal</li>
                <li>Ahika Porwal</li>
              </ul>
            </div>
            <a
              className="github-link github-box"
              href="https://github.com/nihitdev/health-myth-buster"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={19} aria-hidden="true" />
              View project on GitHub
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </header>
      <main id="main">
        {path === "/" ? (
          <Home />
        ) : path === "/library" ? (
          <Library />
        ) : path === "/about" ? (
          <About />
        ) : path === "/testing" ? (
          <Testing />
        ) : path === "/presentation" || path === "/demo" ? (
          <Presentation />
        ) : (
          <section className="page">
            <h1>Page not found</h1>
            <a href="/">Return to the claim checker</a>
          </section>
        )}
      </main>
      <footer>
        <div className="safety">
          <Info size={19} />
          <p>
            For awareness, not medical advice. This tool cannot diagnose or
            recommend treatment. <strong>{SAFETY}</strong>
          </p>
        </div>
        <div className="footer-bottom">
          <a className="footer-brand" href="/">
            <HeartPulse size={19} />
            Health Myth Buster
          </a>
          <span>HCL Jigsaw 7.0 · Round 2 · Grade 6</span>
          <span>AI Revolution & Digital Futures</span>
          <a href="/about">
            Methodology & privacy <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="footer-credits">
          <div className="team-credit">
            <p className="developer-credit">
              Built and developed by <strong>Nihit Sunhare</strong>
            </p>
            <span className="credit-label">Team members</span>
            <ul aria-label="Team members">
              <li>Rudransh Sahu</li>
              <li>Priyushi Agrawal</li>
              <li>Ahika Porwal</li>
            </ul>
          </div>
          <a
            className="github-link"
            href="https://github.com/nihitdev/health-myth-buster"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={19} aria-hidden="true" />
            View project on GitHub
            <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
