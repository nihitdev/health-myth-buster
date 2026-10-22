import { useState } from "react";
import { Plus, Sun, Moon, Info, HeartPulse, ArrowUpRight } from "lucide-react";
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
      </footer>
    </div>
  );
}
