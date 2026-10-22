import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import { myths } from "../data/myths";
import { pendingMyths } from "../data/pending";
import Checker from "../components/Checker";
import How from "../components/How";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">
            <span className="dot" />
            EVIDENCE BEFORE FORWARDS
          </span>
          <h1>
            Health claims.
            <br />
            Less confusion.
            <br />
            <em>More clarity.</em>
          </h1>
          <p className="hero-description">
            That health tip in the family group?
            <br />
            Check it before you share it.
          </p>
          <p className="hero-detail">
            A free, evidence-first health myth checker for students, families,
            and curious minds across India.
          </p>
          <div className="hero-promises">
            <span>
              <Check size={15} />
              Official sources
            </span>
            <span>
              <Check size={15} />
              No sign-up
            </span>
            <span>
              <Check size={15} />
              100% free
            </span>
          </div>
          <div className="hero-note">
            <span className="mini-shield">
              <ShieldCheck size={23} />
            </span>
            <p>
              Built for better health literacy.
              <br />
              <strong>Powered by evidence. Guided by caution.</strong>
            </p>
          </div>
        </div>
        <Checker />
      </section>
      <div className="evidence-strip">
        <span>EVIDENCE FROM PUBLIC-HEALTH AUTHORITIES</span>
        <strong>
          WHO <small>World Health Organization</small>
        </strong>
        <strong>
          CDC <small>Centers for Disease Control</small>
        </strong>
        <strong>
          NHS <small>National Health Service</small>
        </strong>
        <span className="no-affiliation">
          Source references,
          <br />
          no affiliation or endorsement.
        </span>
      </div>
      <How />
      <section className="library-promo">
        <div>
          <span className="eyebrow">KNOW MORE. SHARE BETTER.</span>
          <h2>Small library. Carefully checked.</h2>
          <p>
            {myths.length} evidence-reviewed claims. {pendingMyths.length}{" "}
            awaiting review.
            <br />
            We publish evidence, not a promise to know everything.
          </p>
        </div>
        <a className="primary" href="/library">
          Explore the Myth Library <ArrowRight size={18} />
        </a>
      </section>
    </>
  );
}
