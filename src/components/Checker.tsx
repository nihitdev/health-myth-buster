import { useState } from "react";
import { ScanLine, ArrowRight, LockKeyhole, RotateCcw } from "lucide-react";
import { myths } from "../data/myths";
import { checkClaim, MAX_LENGTH, type Result } from "../engine";
import ResultCard from "./ResultCard";
import ClaimExamples from "./ClaimExamples";
export default function Checker() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<Result>();
  const [error, setError] = useState("");
  function submit() {
    if (!claim.trim()) {
      setError("Please enter a health claim first.");
      return;
    }
    setError("");
    setResult(checkClaim(claim));
  }
  return (
    <div className="checker" id="checker">
      <div className="checker-heading">
        <span className="icon-tile">
          <ScanLine size={23} />
        </span>
        <div>
          <h2>Heard a health claim?</h2>
          <p>Let’s check the evidence.</p>
        </div>
        <span className="live-dot">Ready to check</span>
      </div>
      <p className="checker-coverage">
        {myths.length} reviewed claims ·{" "}
        {new Set(myths.map((m) => m.category)).size} health categories ·
        everyday wording welcome
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="claim">Enter a health claim</label>
        <textarea
          id="claim"
          value={claim}
          maxLength={MAX_LENGTH}
          placeholder="e.g. Antibiotics cure the common cold."
          aria-describedby="input-help input-error"
          aria-invalid={!!error}
          onChange={(e) => {
            setClaim(e.target.value);
            setResult(undefined);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="input-meta" id="input-help">
          <span>One claim at a time · Enter to check</span>
          <span>
            {claim.length}/{MAX_LENGTH}
          </span>
        </div>
        <p id="input-error" role="alert" className="error">
          {error}
        </p>
        <button className="primary check-button" type="submit">
          Check Claim <ArrowRight size={19} />
        </button>
      </form>
      <ClaimExamples
        onSelect={(claim) => {
          setClaim(claim);
          setResult(checkClaim(claim));
          setError("");
        }}
      />
      <div role="status" aria-live="polite" aria-atomic="true">
        {result ? (
          <>
            <ResultCard result={result} />
            <button
              className="text-button"
              onClick={() => {
                setClaim("");
                setResult(undefined);
                document.getElementById("claim")?.focus();
              }}
            >
              <RotateCcw size={15} />
              Check another claim
            </button>
          </>
        ) : (
          <div className="checker-foot">
            <LockKeyhole size={14} />
            Your claim stays in your browser. No accounts. No tracking.
          </div>
        )}
      </div>
    </div>
  );
}
