import { CheckCircle2, XCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { SAFETY, type Result } from "../engine";
import Sources from "./Sources";
export default function ResultCard({ result }: { result: Result }) {
  const Icon =
    result.verdict === "TRUE"
      ? CheckCircle2
      : result.verdict === "FALSE"
        ? XCircle
        : HelpCircle;
  return (
    <article
      className={`result ${result.verdict.toLowerCase()}`}
      aria-label="Claim result"
    >
      <div className="result-top">
        <span className="eyebrow">THE EVIDENCE SAYS</span>
        <span className="badge">
          <Icon size={16} />
          {result.verdict}
        </span>
      </div>
      {result.myth && <h3>{result.myth.claim}</h3>}
      <p>{result.explanation.slice(0, -SAFETY.length)}</p>
      {result.myth ? (
        <>
          <Sources myth={result.myth} />
          <small className="muted">
            Evidence reviewed {result.myth.lastReviewed} ·{" "}
            {result.myth.category}
          </small>
        </>
      ) : (
        <a
          href="https://www.who.int/health-topics"
          target="_blank"
          rel="noreferrer"
        >
          Explore WHO health topics ↗
        </a>
      )}
      <details>
        <summary>Why this matched</summary>
        <p>{result.reason}</p>
      </details>
      <p className="doctor">
        <ShieldCheck size={18} />
        {SAFETY}
      </p>
    </article>
  );
}
