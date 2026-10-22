import { writeFile } from "node:fs/promises";
import { myths } from "../src/data/myths.ts";
import { pendingMyths } from "../src/data/pending.ts";
const report =
  `# Source audit\n\nEvidence content reviewed during development on 2026-10-22. This is an editorial source-content check, not independent clinical certification. **${myths.length} evidence-reviewed entries; ${pendingMyths.length} pending; target 50.** No human evaluation outcomes are claimed.\n\n## Review method\n\nOfficial page content was opened and read using the browsing tool. Each published claim has two relevant official pages. Review notes below identify the supporting sections; titles and URLs come from the opened pages. A successful HTTP response alone is not evidence. The NHS page reports a 2022 source review date; this is older guidance and should receive a team recheck. Development review date is separate from publisher dates.\n\n## Reviewed entries\n\n` +
  myths
    .map(
      (m) =>
        `### ${m.id}: ${m.claim}\n\n- Verdict: ${m.verdict}; category: ${m.category}; status: ${m.reviewStatus}; reviewed: ${m.lastReviewed}.\n- Reason: ${m.explanation}\n` +
        m.sources
          .map(
            (s) =>
              `- [${s.organization}: ${s.title}](${s.url}) — ${s.evidence}`,
          )
          .join("\n") +
        "\n",
    )
    .join("\n") +
  `\n## Unresolved candidates\n\nThese are research prompts, not published facts. No verdict, fabricated source or review date is assigned. They are excluded from matching.\n\n` +
  pendingMyths.map((m) => `- ${m.id}: ${m.claim} — ${m.reason}`).join("\n") +
  `\n\n## Rejected source attempts\n\n- WHO coronavirus mythbusters Q&A URL returned 404; not used.\n- WHO antimicrobial-resistance Q&A URL opened a news listing without relevant evidence; not used.\n- WHO antimicrobial-resistance factsheet was readable but was not needed for this release's claim-specific evidence pairs.\n- WHO healthy-diet factsheet was readable but nutrition candidates remain pending until a second relevant source and exact scope are reviewed.\n\n## Release review checklist\n\nA student or teacher should open each link, compare the exact claim scope with both sources, check for updates, and record corrections in Git. For new entries, add source-section notes, a real review date and engine regression cases before publishing. Never promote candidates just to reach 50.\n`;
await writeFile("SOURCE_AUDIT.md", report);
console.log(
  `Source audit generated: ${myths.length} reviewed, ${pendingMyths.length} pending. This command regenerates the report; it does not reverify medical evidence.`,
);
