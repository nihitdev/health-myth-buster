# Architecture

React + strict TypeScript + Vite; Tailwind CSS Vite plugin with reusable CSS design tokens, Lucide icons and Vitest. All production processing is local. Static files deploy without a backend. No runtime medical or AI API requests.

## Structure

`src/App.tsx` is the layout, theme and pathname route switch. `src/pages` contains Home, Library, About, Testing and Presentation. `src/components` shares Checker, ResultCard, Sources and How. `src/data/myths.ts` is the reviewed typed dataset. `pending.ts` is isolated from matching. `engine.ts` is pure; `storage.ts` handles test serialization and browser downloads.

## Claim flow

Input → length validation → normalization → caution guards → all required concept groups → minimum 85% wording coverage → unique candidate → evidence-backed result. Zero or multiple candidates → UNVERIFIED.

Whole phrase matches use padded word boundaries, not arbitrary substrings. A small explicit spelling map normalizes antibiotic variants and influenza. Required groups represent synonyms with OR inside a group and AND between groups. A word-coverage rule rejects unrelated additional concepts. Negation, absolutes, uncertain words, questions, personal requests and conjunctions cause abstention; no automatic reversal. Rules are explainable but are not semantic language understanding. 85% is an engineering threshold, not a calibrated probability. Some malformed sentences may still match; users should read the displayed canonical claim.

## UI and accessibility

Semantic landmarks, labels, live result regions, native buttons/selects, keyboard Enter submission, Shift+Enter newline, skip link, visible focus, explicit verdict words/icons, responsive grid and reduced-motion overrides. Source links announce new tabs. System fonts avoid external font requests. The library and testing tables remain usable with horizontal scrolling where necessary.

## Persistence

Only local Testing Lab records and a theme preference are saved. Versioned localStorage key `hmb-tests-v1`; malformed records are filtered, storage failures are surfaced, exports remain user initiated. CSV fields are quoted and potential formula prefixes neutralized. Before/after records preserve actual historical answers rather than silently recomputing them. Baseline loading reruns one claim through the current engine. No analytics, cookies, names or account system.

## Deployment and tests

Vercel and Netlify rewrite document routes to index.html. Vite assets are hashed. Unit tests exercise every canonical and alternate wording, safeguards, source structure and evaluation utilities. Browser tests exercise UI, persistence, downloads, theme, routes, mobile overflow and automated accessibility. Source relevance is established by reading content and documented separately; tests cannot prove medical truth. There is no server/API boundary to verify.
