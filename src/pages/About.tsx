import { ShieldCheck } from "lucide-react";
import { myths } from "../data/myths";
import { pendingMyths } from "../data/pending";
import { SAFETY } from "../engine";
export default function About() {
  return (
    <section className="page prose">
      <span className="eyebrow">OPEN BY DESIGN</span>
      <h1>
        No magic.
        <br />
        <em>A method you can see.</em>
      </h1>
      <p className="lead">
        A transparent, rule-based prototype for health literacy. No machine
        learning, LLM, or AI API is used.
      </p>
      <div className="panel">
        <h2>From a claim to an answer</h2>
        <ol>
          <li>You enter one short health claim.</li>
          <li>
            We normalize case, punctuation, spaces and a small list of spelling
            variations.
          </li>
          <li>
            Rules look for whole words and required groups of keywords and
            synonyms in the reviewed database.
          </li>
          <li>
            We recognize common word forms, spelling variants, synonyms and
            clear questions. Explicitly reviewed negated wording has its own
            verdict. Unreviewed negation, compound claims and overlapping
            matches stay UNVERIFIED.
          </li>
          <li>
            A reliable match shows TRUE or FALSE. Everything else shows
            UNVERIFIED.
          </li>
          <li>
            Each matched answer includes an explanation and at least two
            official sources.
          </li>
        </ol>
      </div>
      <h2>What does each verdict mean?</h2>
      <p>
        <strong>TRUE:</strong> The matched claim is supported by its sources.{" "}
        <strong>FALSE:</strong> The matched claim is contradicted.{" "}
        <strong>UNVERIFIED:</strong> This tool cannot reliably check the
        wording. It does not mean the claim is false.
      </p>
      <h2>Our evidence standard</h2>
      <p>
        Our target is 50 carefully reviewed claims. Currently {myths.length}{" "}
        have had their source content reviewed during development;{" "}
        {pendingMyths.length} remain pending. This is not a clinical or
        independent expert review. Sources include WHO, CDC, NHS, UNAIDS and
        ANACS, MoHFW (Government of India) and NCI; citations are references,
        not endorsements. Review dates record our evidence check, not source
        publication dates.
      </p>
      <h2>Honest limitations</h2>
      <p>
        This English-language prototype has limited coverage. Rules can miss
        valid paraphrases and can still misunderstand a sentence. A match score
        measures wording overlap, not medical certainty. Only explicitly
        reviewed negated phrasings receive a verdict; other negation stays
        UNVERIFIED. Broad wording gets clarification and links to related
        evidence, not a guessed answer.
      </p>
      <p>
        It is not a medical professional or autonomous AI fact checker. It
        cannot diagnose disease, prescribe treatment, assess symptoms or replace
        urgent medical care. The AI Revolution & Digital Futures theme inspires
        responsible digital tools; this prototype does not pretend to use AI.
      </p>
      <h2>Your privacy</h2>
      <p>
        Claims are processed locally. Only Testing Lab records are saved in this
        browser, with no automatic upload. Do not enter personal or sensitive
        information. Hosting providers may keep standard access logs. Clearing
        browser storage deletes local records.
      </p>
      <p className="doctor">
        <ShieldCheck size={18} />
        {SAFETY}
      </p>
    </section>
  );
}
