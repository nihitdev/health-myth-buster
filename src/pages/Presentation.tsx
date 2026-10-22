import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { myths } from "../data/myths";
import { checkClaim } from "../engine";
import ResultCard from "../components/ResultCard";
import Checker from "../components/Checker";
export default function Presentation() {
  const [step, setStep] = useState(0);
  const screens = [
    [
      "Start with a question",
      "A user enters a health claim in their own words.",
    ],
    [
      "Evidence over assumptions",
      "A reviewed claim returns a real verdict and official sources.",
    ],
    [
      "Knowing our limits",
      "An unknown claim stays UNVERIFIED. We never guess.",
    ],
  ];
  return (
    <section className="page presentation">
      <span className="eyebrow">HCL JIGSAW 7.0 · LIVE PRODUCT DEMO</span>
      <div className="demo-tabs">
        {screens.map((s, i) => (
          <button
            aria-pressed={step === i}
            className={step === i ? "active" : ""}
            key={s[0]}
            onClick={() => setStep(i)}
          >
            Screen {i + 1}
            <span>{s[0]}</span>
          </button>
        ))}
      </div>
      <h1>
        {screens[step][0]}
        <span className="title-dot">.</span>
      </h1>
      <p className="lead">{screens[step][1]}</p>
      <div className="demo-content">
        {step === 0 ? (
          <Checker />
        ) : (
          <>
            <div className="demo-claim">
              <span className="eyebrow">THE USER’S CLAIM</span>
              <h2>
                {step === 1
                  ? myths[0].claim
                  : "Blue notebooks prevent headaches."}
              </h2>
            </div>
            <ResultCard
              result={checkClaim(
                step === 1
                  ? myths[0].claim
                  : "Blue notebooks prevent headaches.",
              )}
            />
            <a className="text-button" href="/">
              Try your own claim <ArrowRight size={16} />
            </a>
          </>
        )}
      </div>
      <p className="muted">
        All verdicts use the actual matching engine. No staged test outcomes.
      </p>
    </section>
  );
}
