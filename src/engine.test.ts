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
    "Antibiotics never cure flu",
    "Antibiotics cure colds and flu",
    "Antibiotics cure cold sores",
    "Antibiotics cure colds but cause side effects",
    "Maybe antibiotics cure colds",
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
  it("at least 50 editorial slots with unique IDs", () => {
    expect(myths.length + pendingMyths.length).toBeGreaterThanOrEqual(50);
    expect(new Set([...myths, ...pendingMyths].map((m) => m.id)).size).toBe(
      myths.length + pendingMyths.length,
    );
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
describe("expanded natural-language understanding", () => {
  const cases: [string, string][] = [
    ["Antibiotics cures a common cold", "FALSE"],
    ["Do antibiotics work for the flu?", "FALSE"],
    ["Can antibiotics cure a cold?", "FALSE"],
    ["Is it true that antibiotics cure common colds?", "FALSE"],
    ["My friend says antibiotics cure the common cold", "FALSE"],
    ["I heard that vaccines cause autism", "FALSE"],
    ["Does vaccination cause autism?", "FALSE"],
    ["Can mosquitos transmit HIV?", "FALSE"],
    ["Antibiotics don't work against viruses", "TRUE"],
    ["Antibiotics don't cure colds", "TRUE"],
    ["Antibiotics cannot treat the flu", "TRUE"],
    ["Vaccines do not cause autism", "TRUE"],
    ["Is it true that vaccines do not cause autism?", "TRUE"],
    ["HIV does not spread through hugging", "TRUE"],
    ["Antibiotics are effective against the common cold", "FALSE"],
    ["A cold can be treated with antibiotics", "FALSE"],
    ["Autism is caused by vaccination", "FALSE"],
    ["Exercise improves mental health", "TRUE"],
    ["Smoking causes lung cancer", "TRUE"],
    ["Gutkha is harmless", "FALSE"],
    ["Antibiotics cure all diseases", "FALSE"],
    ["Every bacterial infection needs antibiotics", "FALSE"],
    ["Boiling water removes toxic chemicals", "FALSE"],
  ];
  for (const [claim, verdict] of cases)
    it(claim, () => {
      expect(checkClaim(claim).verdict).toBe(verdict);
      expect(checkClaim(claim).myth?.sources.length).toBeGreaterThanOrEqual(2);
    });
  for (const m of myths)
    for (const v of m.reviewedVariants || [])
      for (const claim of [v.claim, ...v.alternates])
        it(`reviewed polarity: ${claim}`, () => {
          const r = checkClaim(claim);
          expect(r.verdict).toBe(v.verdict);
          expect(r.matchedClaim).toBe(v.claim);
          expect(r.explanation.endsWith(SAFETY)).toBe(true);
        });
});
describe("scope and semantic regression guards", () => {
  const claims = [
    "The common cold cures antibiotics",
    "Viruses kill antibiotics",
    "Autism causes vaccines",
    "All antibiotics do not cure the common cold",
    "Vaccines do not never cause autism",
    "Antibiotics cure the common cold during pregnancy",
    "Antibiotics cure common colds in animals",
    "Boiling water cures cancer",
    "Warm drinking water kills germs in the body",
    "Antibiotics cure a cold instantly",
    "Vaccines cure autism",
    "Smoking prevents lung cancer",
    "Antibiotics? cure colds",
    "How do antibiotics cure a cold?",
    "Is it true that antibiotics cure colds and cancer?",
    "Should I take antibiotics for a cold?",
    "I was bitten by a dog and have rabies",
    "Cold sores can be cured by antibiotics",
    "No evidence that vaccines do not cause autism",
    "Dengue is not a viral infection",
  ];
  for (const claim of claims)
    it(`abstains: ${claim}`, () =>
      expect(checkClaim(claim).verdict).toBe("UNVERIFIED"));
  for (const m of myths)
    it(`does not swallow an appended medical assertion: ${m.id}`, () =>
      expect(checkClaim(m.claim + " and cure cancer").verdict).toBe(
        "UNVERIFIED",
      ));
  it("clarifies broad illness without guessing", () => {
    const r = checkClaim("Antibiotics cure common illness");
    expect(r.verdict).toBe("UNVERIFIED");
    expect(r.explanation).toContain("too broad");
    expect(r.related?.length).toBeGreaterThan(0);
    expect(r.suggestion).toContain("do not verify");
    expect(r.myth).toBeUndefined();
  });
  it("does not suggest unrelated evidence for a notebook claim", () =>
    expect(checkClaim("Blue notebooks prevent headaches").related).toEqual([]));
  it("normalization preserves negation and is stable", () => {
    for (const claim of [
      "Antibiotics do not work for viruses",
      "Vaccines don't cause autism",
      "HIV spreads through mosquito bites",
    ]) {
      const n = normalize(claim);
      expect(normalize(n)).toBe(n);
    }
    expect(normalize("Vaccines don't cause autism")).toContain("not");
  });
});
