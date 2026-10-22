import { useState } from "react";
import {
  LockKeyhole,
  FlaskConical,
  Plus,
  RotateCcw,
  Download,
} from "lucide-react";
import type { Verdict } from "../data/myths";
import { checkClaim, MAX_LENGTH, type Result } from "../engine";
import { readRecords, summary, csv, download, STORAGE_KEY } from "../storage";
import ResultCard from "../components/ResultCard";
import ClaimExamples from "../components/ClaimExamples";
export default function Testing() {
  const [records, setRecords] = useState(readRecords);
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<Result>();
  const [expected, setExpected] = useState<Verdict>("UNVERIFIED");
  const [phase, setPhase] = useState<"before" | "after">("before");
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState<boolean | undefined>();
  const [notice, setNotice] = useState("");
  const [isExample, setIsExample] = useState(false);
  const stats = summary(records);
  function save() {
    if (!result || correct === undefined || isExample) return;
    const next = [
      ...records,
      {
        id: crypto.randomUUID(),
        claim,
        actual: result.verdict,
        expected,
        correct,
        feedback,
        phase,
        created: new Date().toISOString(),
      },
    ];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setRecords(next);
      setNotice("Evaluation saved on this device.");
      setResult(undefined);
      setClaim("");
      setFeedback("");
      setCorrect(undefined);
    } catch {
      setNotice(
        "Browser storage is unavailable or full. Export your records before leaving.",
      );
    }
  }
  return (
    <section className="page">
      <span className="eyebrow">REAL TESTS. REAL LEARNING.</span>
      <h1>
        Testing Lab<span className="title-dot">.</span>
      </h1>
      <p className="lead">
        Try your own wording. Record what worked. Improve what didn’t.
      </p>
      <p className="privacy">
        <LockKeyhole size={17} />
        Stored only on this device. Do not enter names, contact details,
        symptoms or other sensitive information.
      </p>
      <div className="stats">
        {[
          ["Total tests", stats.total],
          ["Correct", stats.correct],
          ["Incorrect", stats.incorrect],
          ["Accuracy", stats.total ? stats.accuracy.toFixed(1) + "%" : "—"],
        ].map(([k, v]) => (
          <div key={k}>
            <strong>{v}</strong>
            <span>{k}</span>
          </div>
        ))}
      </div>
      <p className="muted">
        Accuracy = Correct answers / Total tested claims × 100. Correctness is
        the tester’s assessment, not an independently measured medical accuracy.
      </p>
      <div className="lab-grid">
        <div className="panel">
          <h2>Evaluate a claim</h2>
          <ClaimExamples
            practice
            onSelect={(claim) => {
              setClaim(claim);
              setResult(checkClaim(claim));
              setCorrect(undefined);
              setFeedback("");
              setNotice(
                "Example preview only. No evaluation has been recorded.",
              );
              setIsExample(true);
            }}
          />
          {isExample && (
            <div className="practice-note">
              <strong>Practice example</strong>
              <p>
                This preview does not count toward your testing accuracy. Enter
                a claim in your own words to record a genuine evaluation.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsExample(false);
                  setClaim("");
                  setResult(undefined);
                  setNotice("");
                  document.getElementById("lab-claim")?.focus();
                }}
              >
                Write my own claim
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (claim.trim()) {
                setResult(checkClaim(claim));
                setCorrect(undefined);
                setNotice("");
              }
            }}
          >
            <label htmlFor="lab-claim">Claim in your own words</label>
            <textarea
              id="lab-claim"
              required
              maxLength={MAX_LENGTH}
              value={claim}
              onChange={(e) => {
                setClaim(e.target.value);
                setResult(undefined);
                setIsExample(false);
                setCorrect(undefined);
                setNotice("");
              }}
              placeholder="One health claim, without personal details"
            />
            <label htmlFor="expected">
              Expected answer (check evidence first)
            </label>
            <select
              id="expected"
              value={expected}
              onChange={(e) => setExpected(e.target.value as Verdict)}
            >
              {["TRUE", "FALSE", "UNVERIFIED"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <label htmlFor="phase">Evaluation phase</label>
            <select
              id="phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value as "before" | "after")}
            >
              <option value="before">Before improvement</option>
              <option value="after">After improvement</option>
            </select>
            <button className="primary" type="submit">
              Run actual checker <FlaskConical size={17} />
            </button>
          </form>
          {result && (
            <>
              <div role="status">
                <ResultCard result={result} />
              </div>
              {!isExample && (
                <>
                  <fieldset>
                    <legend>Was the tool correct?</legend>
                    {[true, false].map((v) => (
                      <label className="radio" key={String(v)}>
                        <input
                          type="radio"
                          name="correct"
                          checked={correct === v}
                          onChange={() => setCorrect(v)}
                        />
                        {v ? "Correct" : "Incorrect"}
                      </label>
                    ))}
                  </fieldset>
                  <label htmlFor="feedback">
                    Optional feedback (no personal details)
                  </label>
                  <textarea
                    id="feedback"
                    maxLength={500}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <button
                    className="primary"
                    disabled={correct === undefined}
                    onClick={save}
                  >
                    Save evaluation <Plus size={17} />
                  </button>
                </>
              )}
            </>
          )}
          <p role="status">{notice}</p>
        </div>
        <div>
          <div className="panel">
            <h2>Before → after</h2>
            <p>
              Reuse the same claims after a rule change. Compare equal test sets
              for a fair comparison.
            </p>
            {(["before", "after"] as const).map((p) => {
              const s = summary(records.filter((r) => r.phase === p));
              return (
                <div className="comparison" key={p}>
                  <strong>
                    {p === "before"
                      ? "Before improvement"
                      : "After improvement"}
                  </strong>
                  <span>
                    {s.total} tests ·{" "}
                    {s.total ? s.accuracy.toFixed(1) + "%" : "No results yet"}
                  </span>
                </div>
              );
            })}
            <button
              className="text-button"
              disabled={!records.some((r) => r.phase === "before")}
              onClick={() => {
                const r = records.find(
                  (r) =>
                    r.phase === "before" &&
                    !records.some(
                      (a) => a.phase === "after" && a.claim === r.claim,
                    ),
                );
                if (r) {
                  setClaim(r.claim);
                  setIsExample(false);
                  setExpected(r.expected);
                  setPhase("after");
                  setResult(undefined);
                  setCorrect(undefined);
                  setNotice("Baseline claim loaded. Run the checker again.");
                } else
                  setNotice(
                    "All baseline claim wordings have an after record.",
                  );
              }}
            >
              <RotateCcw size={15} />
              Load next baseline claim
            </button>
          </div>
          <div className="panel">
            <h2>Your test records</h2>
            <p>
              No sample results are pre-filled. Export genuine tests for your
              team and presentation.
            </p>
            <div className="button-row">
              <button
                disabled={!records.length}
                onClick={() =>
                  download(
                    JSON.stringify(records, null, 2),
                    "application/json",
                    "health-myth-tests.json",
                  )
                }
              >
                <Download size={16} />
                JSON
              </button>
              <button
                disabled={!records.length}
                onClick={() =>
                  download(
                    csv(records),
                    "text/csv;charset=utf-8",
                    "health-myth-tests.csv",
                  )
                }
              >
                <Download size={16} />
                CSV
              </button>
            </div>
            <details>
              <summary>Delete local records</summary>
              <p>This removes all saved evaluations from this browser.</p>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem(STORAGE_KEY);
                    setRecords([]);
                    setNotice("Local test records deleted.");
                  } catch {
                    setNotice("Could not access browser storage.");
                  }
                }}
              >
                Delete all records
              </button>
            </details>
          </div>
        </div>
      </div>
      {records.length > 0 && (
        <div
          className="table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Saved evaluations, scroll horizontally for all columns"
        >
          <table>
            <caption>Genuine evaluations saved on this device</caption>
            <thead>
              <tr>
                {[
                  "Claim",
                  "Actual",
                  "Expected",
                  "Assessment",
                  "Phase",
                  "Feedback",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.claim}</td>
                  <td>{r.actual}</td>
                  <td>{r.expected}</td>
                  <td>{r.correct ? "Correct" : "Incorrect"}</td>
                  <td>{r.phase}</td>
                  <td>{r.feedback || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
