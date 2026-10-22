import { describe, it, expect } from "vitest";
import { checkClaim, normalize, SAFETY } from "./engine";
import { myths } from "./data/myths";
import { pendingMyths } from "./data/pending";
import { csv, summary, type TestRecord } from "./storage";
describe("reviewed claims", () => {
  for (const myth of myths) {
    it(myth.id, () => {
      expect(checkClaim(myth.claim).verdict).toBe(myth.verdict);
    });
    for (const alt of myth.alternates)
      it(alt, () => expect(checkClaim(alt).myth?.id).toBe(myth.id));
  }
});
describe("normalization", () => {
  it("case punctuation and spaces", () =>
    expect(
      checkClaim("  ANTIBIOTICS   cure, the common COLD!!! ").verdict,
    ).toBe("FALSE"));
  it("common spelling", () =>
    expect(checkClaim("Antibotics treat colds").verdict).toBe("FALSE"));
  it("singular spelling", () =>
    expect(normalize("Antibiotic")).toBe("antibiotics"));
});
describe("conservative abstention", () => {
  const inputs = [
    "",
    "   ",
    "Drinking water is important",
    "Hot water cures cancer",
    "Antibiotics do not cure colds",
    "Antibiotics never cure flu",
    "Antibiotics cure colds and flu",
    "Antibiotics cure cold sores",
    "Antibiotics cure colds but cause side effects",
    "Maybe antibiotics cure colds",
    "Antibiotics cure colds?",
    "Antibiotics cure severe dengue",
    "My symptoms are a fever",
    "Antibiotics are not without side effects",
    "Dengue spreads through water",
    "Antibiotics cure colds and prevent cancer",
    "Dengue is a viral infection caused by mosquitoes",
    "Antibiotics do cure colds except in children",
    "Antibiotics cure colds is false",
    "Antibiotics cure colds or flu",
    "Antibiotics kill viruses in a petri dish",
    "x".repeat(301),
  ];
  for (const input of inputs)
    it(`UNVERIFIED: ${input.slice(0, 60)}`, () => {
      expect(checkClaim(input).verdict).toBe("UNVERIFIED");
      expect(checkClaim(input).explanation.endsWith(SAFETY)).toBe(true);
    });
  it("all pending candidates stay unverified", () => {
    for (const m of pendingMyths)
      expect(checkClaim(m.claim).verdict, m.claim).toBe("UNVERIFIED");
  });
});
describe("database integrity", () => {
  it("50 editorial slots with unique IDs", () => {
    expect(myths.length + pendingMyths.length).toBe(50);
    expect(new Set([...myths, ...pendingMyths].map((m) => m.id)).size).toBe(50);
  });
  for (const m of myths)
    it(`${m.id} has complete evidence`, () => {
      expect(m.reviewStatus).toBe("evidence-reviewed");
      expect(m.sources.length).toBeGreaterThanOrEqual(2);
      expect(new Set(m.sources.map((s) => s.url)).size).toBe(m.sources.length);
      for (const s of m.sources) {
        expect(new URL(s.url).protocol).toBe("https:");
        expect(s.title.length).toBeGreaterThan(3);
        expect(s.evidence.length).toBeGreaterThan(10);
        expect(s.organization).toBeTruthy();
      }
      expect(m.required.length).toBeGreaterThan(1);
      expect(m.negationSensitive).toBe(true);
      expect(m.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(checkClaim(m.claim).explanation.endsWith(SAFETY)).toBe(true);
    });
  it("pending entries have no fabricated verdict/date/source", () => {
    for (const m of pendingMyths) {
      expect(m).not.toHaveProperty("verdict");
      expect(m).not.toHaveProperty("lastReviewed");
      expect(m).not.toHaveProperty("sources");
    }
  });
});
describe("evaluation utilities", () => {
  const r: TestRecord = {
    id: "1",
    claim: '=HYPERLINK("example")',
    actual: "FALSE",
    expected: "FALSE",
    correct: true,
    feedback: "two, words\nnew line",
    phase: "before",
    created: "2026-10-22T00:00:00Z",
  };
  it("does not invent empty accuracy", () =>
    expect(summary([])).toEqual({
      total: 0,
      correct: 0,
      incorrect: 0,
      accuracy: 0,
    }));
  it("calculates actual recorded accuracy", () =>
    expect(summary([r, { ...r, id: "2", correct: false }]).accuracy).toBe(50));
  it("quotes CSV and guards formula injection", () => {
    expect(csv([r])).toContain("\"'=HYPERLINK");
    expect(csv([r])).toContain('"two, words\nnew line"');
  });
});
