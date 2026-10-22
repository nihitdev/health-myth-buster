import { myths, type Myth, type Verdict } from "./data/myths";
import {
  normalize,
  unwrap,
  contentWords,
  fingerprint,
  hasPhrase,
} from "./language";
export { normalize } from "./language";
export const SAFETY = "Always ask a doctor.";
export const MAX_LENGTH = 300;
export interface Result {
  verdict: Verdict;
  explanation: string;
  reason: string;
  myth?: Myth;
  score: number;
  matchedClaim?: string;
  related?: Myth[];
  suggestion?: string;
}
function relatedTo(text: string): Myth[] {
  return myths
    .map((m) => ({
      myth: m,
      score: m.required.filter((g) => g.some((p) => hasPhrase(text, p))).length,
      topic: m.required[0].some((p) => hasPhrase(text, p)),
    }))
    .filter((m) => m.topic && m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((m) => m.myth);
}
function unknown(reason: string, text = "", explanation?: string): Result {
  const related = relatedTo(text);
  return {
    verdict: "UNVERIFIED",
    explanation: `${explanation || "This tool cannot reliably verify this exact claim. It may be outside our evidence library or need more specific wording. An unknown claim is not automatically false."} ${SAFETY}`,
    reason,
    score: 0,
    related,
    suggestion: related.length
      ? "Name the specific illness or effect. These related claims have been reviewed separately; they do not verify your original statement."
      : "Try a specific statement about one health topic, or explore the reviewed library.",
  };
}
function answer(
  myth: Myth,
  verdict: Verdict,
  matchedClaim: string,
  reason: string,
  score: number,
): Result {
  return {
    verdict,
    myth,
    matchedClaim,
    explanation: `${myth.explanation} ${SAFETY}`,
    reason,
    score,
  };
}
const uncertainty =
  /\b(?:maybe|perhaps|might|whether|probably|possibly|i think|i guess)\b/;
const polarity =
  /\b(?:no|not|never|without|unlikely|neither|nor|false|untrue|wrong|myth|except|unless|only|always|every|all|any|none|impossible|guaranteed|guarantees|cannot|denies|fails|ineffective)\b/;
function directionIsSafe(text: string, myth: Myth): boolean {
  if (/^ant-(?:cold|flu|virus|bacteria)$/.test(myth.id)) {
    const subject = text.indexOf("antibiotics");
    const relation = text.search(/\b(?:treat|cure|kill)\b/);
    return (
      subject < relation ||
      /\b(?:treat|cure|kill)\b.*\b(?:by|with) antibiotics\b/.test(text)
    );
  }
  if (myth.id === "vaccine-autism")
    return (
      text.search(/\b(?:vaccines|vaccination|vaccine)\b/) <
        text.indexOf("cause") || /cause.*by.*vaccin/.test(text)
    );
  if (myth.id === "smoke-cancer")
    return (
      text.indexOf("smoking") < text.indexOf("cause") ||
      /cause.*by.*smoking/.test(text)
    );
  return true;
}
const reviewedPatterns = myths.flatMap((m) => [
  ...[m.claim, ...m.alternates].map((claim) => ({
    myth: m,
    claim: m.claim,
    verdict: m.verdict,
    signature: fingerprint(claim),
  })),
  ...(m.reviewedVariants || []).flatMap((v) =>
    [v.claim, ...v.alternates].map((claim) => ({
      myth: m,
      claim: v.claim,
      verdict: v.verdict,
      signature: fingerprint(claim),
    })),
  ),
]);
const conceptIndex = myths.map((myth) => ({
  myth,
  vocabulary: new Set(
    contentWords(
      normalize(
        [myth.claim, ...myth.alternates, ...myth.required.flat()].join(" "),
      ),
    ),
  ),
}));
export function checkClaim(input: string): Result {
  if (input.length > MAX_LENGTH)
    return unknown(`Use at most ${MAX_LENGTH} characters.`);
  const text = unwrap(normalize(input));
  if (!text) return unknown("Enter one short health claim.");
  if (
    /\b(?:should i|do i need|my symptoms|i have|my child|my baby|i was bitten|i got bitten|what dose|how much|take medicine|prescribe)\b/.test(
      text,
    )
  )
    return unknown(
      "Personal symptoms, diagnosis and treatment decisions require a healthcare professional.",
      text,
    );
  if (uncertainty.test(text))
    return unknown(
      "Uncertain or conditional wording does not establish one clear claim.",
      text,
    );
  // Check only one proposition. A single trailing question mark can ask about a clear claim.
  if (
    (input.includes("?") && !/\?[\s!]*$/.test(input)) ||
    (input.match(/\?/g) || []).length > 1 ||
    /\b(?:but|or|unless|except|however)\b/.test(text) ||
    /\b(?:why|how|what|when|where)\b/.test(text)
  )
    return unknown(
      "Use one specific claim rather than a conditional statement or open-ended question.",
      text,
    );
  if (
    /\bcommon (?:illness|illnesses|disease|diseases)\b/.test(text) &&
    hasPhrase(text, "antibiotics")
  )
    return unknown(
      "“Common illness” does not identify a cause or a specific illness. The database cannot assign one verdict to that broad phrase.",
      text,
      "“Common illness” is too broad to check reliably. Please name the illness, for example the common cold, influenza, or a particular bacterial infection. Read the separately reviewed related claims below.",
    );
  const signature = fingerprint(text);
  const exact = reviewedPatterns.filter(
    (v) => v.signature === signature && directionIsSafe(text, v.myth),
  );
  const unique = new Map(exact.map((v) => [`${v.myth.id}:${v.verdict}`, v]));
  if (unique.size === 1) {
    const item = [...unique.values()][0];
    return answer(
      item.myth,
      item.verdict,
      item.claim,
      "A reviewed wording pattern matched after controlled synonym, word-form and question normalization. Negated wording is accepted only when explicitly reviewed; no verdict was automatically reversed. Wording coverage 100% (minimum 85% for concept matching).",
      1,
    );
  }
  if (unique.size > 1)
    return unknown("More than one reviewed interpretation matches.", text);
  if (polarity.test(text))
    return unknown(
      "Negation or a strong qualifier has no exact reviewed wording pattern. Try a separately reviewed statement below.",
      text,
    );
  if (/\band\b/.test(text))
    return unknown("Multiple assertions need separate checks.", text);
  const significant = contentWords(text);
  const candidates = conceptIndex
    .map(({ myth: m, vocabulary }) => {
      const groups = m.required.every((g) => g.some((p) => hasPhrase(text, p)));
      const unmatched = significant.filter((word) => !vocabulary.has(word));
      const score =
        (significant.length - unmatched.length) /
        Math.max(significant.length, 1);
      return {
        myth: m,
        score:
          groups && directionIsSafe(text, m) && unmatched.length === 0
            ? score
            : 0,
      };
    })
    .filter((v) => v.score >= 0.85);
  if (candidates.length !== 1)
    return unknown(
      candidates.length
        ? "Required concepts overlap with multiple entries; narrow the wording."
        : "Required concepts or wording confidence did not meet the matching threshold, or extra content changed the scope.",
      text,
    );
  const { myth, score } = candidates[0];
  return answer(
    myth,
    myth.verdict,
    myth.claim,
    `All ${myth.required.length} required concept groups matched; wording coverage ${Math.round(score * 100)}% (minimum 85%). No unsupported content words remained. This rule score is not medical certainty. Matched: “${myth.claim}”`,
    score,
  );
}
