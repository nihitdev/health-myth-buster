/** Explicit language rules. These rewrite wording, never invent evidence. */
const replacements: [RegExp, string][] = [
  [
    /\b(?:antibiotic|antibotics|antibiotcs|antibiotcs|antiboitics)\b/g,
    "antibiotics",
  ],
  [/\b(?:vaccins|vacines|vaccinations)\b/g, "vaccines"],
  [/\b(?:mosquitos|mosqitoes)\b/g, "mosquitoes"],
  [/\bflu\b/g, "influenza"],
  [/\bcommon colds?\b/g, "cold"],
  [/\bcolds\b/g, "cold"],
  [/\bphysical (?:activity|exercise)\b/g, "exercise"],
  [/\b(?:cures|curing|cured)\b/g, "cure"],
  [/\b(?:treats|treating|treated)\b/g, "treat"],
  [/\b(?:kills|killing|killed)\b/g, "kill"],
  [/\b(?:causes|causing|caused)\b/g, "cause"],
  [/\b(?:spreads|spreading)\b/g, "spread"],
  [/\b(?:transmits|transmitted|transmitting)\b/g, "transmit"],
  [/\b(?:reduces|reducing|lowers|lower|lowering)\b/g, "reduce"],
  [/\b(?:increases|increasing|raises|raise)\b/g, "increase"],
  [/\b(?:helps|helping)\b/g, "help"],
  [/\b(?:improves|improving)\b/g, "improve"],
  [/\b(?:prevents|preventing)\b/g, "prevent"],
  [/\binfections\b/g, "infection"],
  [/\b(?:harmful chemicals|chemical pollution)\b/g, "toxic chemicals"],
  [/\b(?:sideeffects|side effect)\b/g, "side effects"],
  [/\b(?:dont|doesnt|didnt)\b/g, "do not"],
  [/\b(?:cant|cannot)\b/g, "can not"],
  [/\b(?:isnt|arent)\b/g, "is not"],
  [/\b(?:wont)\b/g, "will not"],
  [/\bget rid of\b/g, "cure"],
  [/\b(?:works?|working) (?:on|for|against)\b/g, "treat"],
  [/\b(?:effective against|effective for)\b/g, "treat"],
];
export function normalize(value: string): string {
  let text = value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const [pattern, replacement] of replacements)
    text = text.replace(pattern, replacement);
  return text.replace(/\s+/g, " ").trim();
}
export function unwrap(text: string): string {
  return text.replace(
    /^(?:i heard that|i heard|someone told me that|someone told me|my friend says that|my friend says|people say that|people say|is it true that|is it true|is it a fact that|fact check)\s+/,
    "",
  );
}
const stopWords = new Set(
  "a an the it is are was be been being can may could to by of for you your in with regular do does did through from that some actually really please".split(
    " ",
  ),
);
// Preserve quantifiers and negation: "some", "all" and "not" change meaning.
stopWords.delete("some");
export const contentWords = (text: string) =>
  text.split(" ").filter((word) => word && !stopWords.has(word));
export const fingerprint = (text: string) =>
  contentWords(normalize(unwrap(normalize(text)))).join(" ");
export const hasPhrase = (text: string, phrase: string) =>
  ` ${text} `.includes(` ${normalize(phrase)} `);
