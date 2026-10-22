# Architecture

React + strict TypeScript + Vite; Tailwind CSS Vite plugin with reusable CSS design tokens, Lucide icons and Vitest. All production processing is local. Static files deploy without a backend. No runtime medical or AI API requests.

## Structure

`src/App.tsx` is the layout, theme and pathname route switch. `src/pages` contains Home, Library, About, Testing and Presentation. `src/components` shares Checker, ResultCard, Sources and How. `src/data/myths.ts` is the reviewed typed dataset. `pending.ts` is isolated from matching. `language.ts` supplies controlled phrasing rules; `expanded.ts` holds the added evidence topics; `engine.ts` is pure; `storage.ts` handles test serialization and browser downloads.

## Claim flow

Input → length/personal-request checks → case, punctuation and controlled language normalization → one-proposition guards → exact reviewed wording patterns → required concept groups → coverage and extra-content checks → unique candidate → evidence-backed result. Zero or multiple candidates → UNVERIFIED, with clarification and separately labeled related evidence where possible.

`language.ts` normalizes word forms (cures/cure, causes/cause), a bounded spelling dictionary, phrases such as “works for”, and leading wrappers such as “I heard that”. It preserves negation and quantifiers. Clear questions about one proposition are allowed; open-ended medical questions are not. No fuzzy edit-distance guess or embedding model is used.

Whole phrase matches use word boundaries. Required groups are OR within each group and AND between groups. Precompiled fingerprints preserve content-word order and polarity. Explicitly reviewed negated variants carry their own verdict and canonical statement; nothing is inverted automatically. For other wording, all groups must match, the numerical threshold is 85%, and any unsupported content word vetoes the match even if the threshold passes. Direction checks prevent reversal of medicine/illness and cause/effect in selected patterns.

Exact reviewed patterns allow carefully scoped quantified claims such as “Antibiotics cure every illness” without allowing arbitrary “all” or “always” wording. Compound assertions are blocked unless the whole phrase is explicitly reviewed (for example a comparison of HIV and AIDS). Related suggestions are navigation to reviewed facts, not evidence that verifies the unverified input. Broad “common illness” wording gets a specific request to name the illness. Rules remain limited, not semantic language understanding or medical certainty. Some malformed sentences may still match; read the canonical statement and sources.

## UI and accessibility

Semantic landmarks, labels, live result regions, native buttons/selects, keyboard Enter submission, Shift+Enter newline, skip link, visible focus, explicit verdict words/icons, responsive grid and reduced-motion overrides. Source links announce new tabs. System fonts avoid external font requests. The library and testing tables remain usable with horizontal scrolling where necessary.

## Persistence

Only local Testing Lab records and a theme preference are saved. Versioned localStorage key `hmb-tests-v1`; malformed records are filtered, storage failures are surfaced, exports remain user initiated. CSV fields are quoted and potential formula prefixes neutralized. Before/after records preserve actual historical answers rather than silently recomputing them. Baseline loading reruns one claim through the current engine. No analytics, cookies, names or account system.

## Deployment and tests

Vercel and Netlify rewrite document routes to index.html. Vite assets are hashed. Unit tests exercise every canonical and alternate wording, safeguards, source structure and evaluation utilities. Browser tests exercise UI, persistence, downloads, theme, routes, mobile overflow and automated accessibility. Source relevance is established by reading content and documented separately; tests cannot prove medical truth. There is no server/API boundary to verify.
