# Myth database

Target: 50 claims. Published now: **12 evidence-reviewed**, with **38 pending-review** candidates. Do not call this a 50-verified-myth database.

Each reviewed `Myth` includes ID, canonical claim, alternate phrasings, required groups of whole-word keywords/synonyms, negation sensitivity, TRUE/FALSE verdict, explanation, category, two official sources (organization/title/exact URL/evidence section), review status and actual content-review date. `required` is AND across groups and OR within a group. Shared conservative guards in engine.ts are the negation-sensitive patterns for every entry. A separate data type ensures pending candidates have no verdict, citations or review date.

## Promotion procedure

1. Write one precise claim, avoiding compound statements, guarantees or personal medical advice.
2. Open at least two relevant official pages. Read the content; check that both support the exact verdict. Prefer WHO, MoHFW, PIB and UNICEF; CDC and NHS are also official public-health sources.
3. Record exact existing URLs, real titles, organizations and section-level notes. Record the date only after reading. If a page fails, is a general homepage, or does not address the claim, do not count it.
4. Use a short original explanation without diagnosis, treatment instruction or overstating evidence. Cite sources, not a fabricated research study.
5. Write required concept groups and alternate phrases. Test negated, contradictory, unrelated and mixed claims. Err toward UNVERIFIED.
6. Move the candidate to the reviewed array, remove its pending entry, regenerate SOURCE_AUDIT.md, run all checks, and have a teacher/clinician independently review if possible.

The current content was reviewed during development, not by an independent medical panel. Official guidance can change. No review expiry is automated; the team should recheck sources before each public submission and remove entries if evidence becomes uncertain. The NHS antibiotic page has an older publisher review date, disclosed in the audit. Indian-specific candidate claims remain pending rather than being filled with insufficient evidence.
