import { myths, type Myth, type Verdict } from "./data/myths";
export const SAFETY = "Always ask a doctor.";
export const MAX_LENGTH = 300;
export interface Result {
  verdict: Verdict;
  explanation: string;
  reason: string;
  myth?: Myth;
  score: number;
}
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\bantibiotic\b|\bantibotics\b|\bantibiotcs\b/g, "antibiotics")
    .replace(/\bmosquitos\b/g, "mosquitoes")
    .replace(/\bflu\b/g, "influenza")
    .replace(/\s+/g, " ")
    .trim();
}
const contains = (text: string, phrase: string) =>
  ` ${text} `.includes(` ${normalize(phrase)} `);
const unknown = (reason: string): Result => ({
  verdict: "UNVERIFIED",
  explanation: `This claim has not been checked by this tool, or the wording is too uncertain for a reliable match. Consult reliable public-health sources. ${SAFETY}`,
  reason,
  score: 0,
});
export function checkClaim(input: string): Result {
  const text = normalize(input);
  if (!text) return unknown("Enter one short health claim.");
  if (input.length > MAX_LENGTH)
    return unknown(`Use at most ${MAX_LENGTH} characters.`);
  // Abstain on negation, questions, personal medical requests and compound assertions.
  if (
    /\b(no|not|never|cannot|cant|dont|doesnt|isnt|arent|without|unlikely|neither|nor|false|untrue|wrong|myth|except|unless|only|always|every|all)\b/.test(
      text,
    )
  )
    return unknown(
      "Negation or absolute wording needs a separate evidence review.",
    );
  if (
    input.includes("?") ||
    /\b(should i|do i|my symptoms|i have|what dose|how much|whether|maybe|perhaps|might|and|but|or)\b/.test(
      text,
    )
  )
    return unknown(
      "A question, uncertain wording, personal request or multiple claims cannot be safely matched.",
    );
  const candidates = myths
    .map((myth) => {
      const groups = myth.required.map((group) =>
        group.some((phrase) => contains(text, phrase)),
      );
      const words = new Set(
        normalize(
          [myth.claim, ...myth.alternates, ...myth.required.flat()].join(" "),
        ).split(" "),
      );
      const significant = text
        .split(" ")
        .filter(
          (word) =>
            ![
              "a",
              "an",
              "the",
              "it",
              "is",
              "are",
              "can",
              "may",
              "to",
              "by",
              "of",
              "for",
              "you",
              "your",
              "in",
              "with",
              "regular",
            ].includes(word),
        );
      const coverage =
        significant.filter((word) => words.has(word)).length /
        Math.max(1, significant.length);
      return { myth, score: groups.every(Boolean) ? coverage : 0 };
    })
    .filter((item) => item.score >= 0.85)
    .sort((a, b) => b.score - a.score);
  if (candidates.length !== 1)
    return unknown(
      candidates.length
        ? "Multiple evidence entries overlap; try one specific claim."
        : "Required concepts or wording confidence did not meet the matching threshold.",
    );
  const { myth, score } = candidates[0];
  return {
    verdict: myth.verdict,
    explanation: `${myth.explanation} ${SAFETY}`,
    myth,
    score,
    reason: `All ${myth.required.length} required concept groups matched; wording coverage ${Math.round(score * 100)}% (minimum 85%). This is a rule score, not medical certainty. Matched: “${myth.claim}”`,
  };
}
