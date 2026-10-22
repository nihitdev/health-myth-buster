import { ArrowUpRight } from "lucide-react";
import type { Myth } from "../data/myths";
export default function Sources({ myth }: { myth: Myth }) {
  return (
    <div className="sources">
      {myth.sources.map((s) => (
        <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
          <span className="source-mark">{s.organization.slice(0, 1)}</span>
          <span>
            <strong>{s.organization}</strong>
            <small>{s.title}</small>
          </span>
          <ArrowUpRight size={16} />
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      ))}
    </div>
  );
}
