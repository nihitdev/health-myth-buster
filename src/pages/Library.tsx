import { useState } from "react";
import { Search } from "lucide-react";
import { myths } from "../data/myths";
import { pendingMyths } from "../data/pending";
import { SAFETY } from "../engine";
import ResultCard from "../components/ResultCard";
export default function Library() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All categories");
  const [verdict, setVerdict] = useState("All verdicts");
  const filtered = myths.filter(
    (m) =>
      (m.claim + " " + m.explanation).toLowerCase().includes(q.toLowerCase()) &&
      (category === "All categories" || m.category === category) &&
      (verdict === "All verdicts" || m.verdict === verdict),
  );
  return (
    <section className="page">
      <span className="eyebrow">THE EVIDENCE SHELF</span>
      <h1>
        Myth Library<span className="title-dot">.</span>
      </h1>
      <p className="lead">
        Explore {myths.length} evidence-reviewed claims, with sources you can
        read for yourself.
      </p>
      <div className="filters">
        <label className="search-box">
          <Search size={18} />
          <input
            aria-label="Search myth library"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search health claims…"
          />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["All categories", ...new Set(myths.map((m) => m.category))].map(
              (c) => (
                <option key={c}>{c}</option>
              ),
            )}
          </select>
        </label>
        <label>
          <span className="sr-only">Verdict</span>
          <select value={verdict} onChange={(e) => setVerdict(e.target.value)}>
            {["All verdicts", "TRUE", "FALSE"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="muted" role="status">
        Showing {filtered.length} of {myths.length} reviewed entries
      </p>
      <h2 className="sr-only">Reviewed claims and evidence</h2>
      <div className="library-grid">
        {filtered.map((m) => (
          <ResultCard
            key={m.id}
            result={{
              verdict: m.verdict,
              myth: m,
              explanation: m.explanation + " " + SAFETY,
              reason: `Required concept groups: ${m.required.map((g) => g.join(" / ")).join("; ")}. Negation-sensitive. Minimum wording coverage: 85%.`,
              score: 1,
            }}
          />
        ))}
      </div>
      {!filtered.length && (
        <p className="empty">
          No reviewed claims match these filters. Try a broader search.
        </p>
      )}
      <details className="panel">
        <summary>
          {pendingMyths.length} pending-review candidates · excluded from
          checker
        </summary>
        <p>
          These claims have no verdict here. Two relevant sources and matching
          rules still need review.
        </p>
        <ul>
          {pendingMyths.map((m) => (
            <li key={m.id}>{m.claim}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
