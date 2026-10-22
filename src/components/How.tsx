import { MessageSquare, Search, ShieldCheck, ArrowUpRight } from "lucide-react";
export default function How() {
  return (
    <section className="how">
      <div className="section-heading">
        <div>
          <span className="eyebrow">CLARITY, IN THREE STEPS</span>
          <h2>A little check. A better decision.</h2>
        </div>
        <a href="/about">
          Our methodology <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="steps">
        {[
          [
            MessageSquare,
            "01",
            "Share the claim",
            "Paste something you heard, read, or received in a forward.",
          ],
          [
            Search,
            "02",
            "We check our evidence",
            "Transparent rules search our reviewed health library.",
          ],
          [
            ShieldCheck,
            "03",
            "Understand the answer",
            "Get a clear verdict, a simple explanation, and official sources.",
          ],
        ].map(([Icon, n, title, desc]) => {
          const I = Icon as typeof Search;
          return (
            <article key={String(n)}>
              <div className="step-top">
                <I size={22} />
                <span>{String(n)}</span>
              </div>
              <h3>{String(title)}</h3>
              <p>{String(desc)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
