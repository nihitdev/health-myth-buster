import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { claimExamples } from "../data/examples";
export default function ClaimExamples({
  onSelect,
  practice = false,
}: {
  onSelect: (claim: string) => void;
  practice?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="claim-examples" aria-label="Example health claims">
      <p className="examples-title">Not sure what to type?</p>
      <p className="examples-help">
        Tap an example to {practice ? "preview" : "check"} it instantly. These
        are example claims, not health advice.
      </p>
      <div className="example-grid">
        {(expanded ? claimExamples : claimExamples.slice(0, 4)).map(
          (example) => (
            <button
              type="button"
              className="example-card"
              key={example.claim}
              onClick={() => onSelect(example.claim)}
            >
              <span>
                <span className="example-topic">{example.topic}</span>
                <span className="example-claim">{example.claim}</span>
              </span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        className="text-button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? "Show fewer examples" : "Show 4 more examples"}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </section>
  );
}
