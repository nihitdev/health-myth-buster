# Verification report

Development check performed 2026-10-22. These are automated engineering checks, not human testing results or independent medical validation.

**Story:** A user enters a claim → local rules search the reviewed dataset → a verdict and evidence render; a tester can record an evaluation locally, export it and rerun a baseline claim.

| Boundary                        | Result     | Evidence                                                                                                                                                                     |
| ------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Matching and evidence structure | Pass       | 247 Vitest tests; all canonical/alternate claims, negation, punctuation, spelling, unknown/ambiguous claims, false-positive safeguards, pending exclusion and data integrity |
| UI to actual checker            | Pass       | Playwright input, Enter submission, FALSE verdict, source links, match details, reset and explicitly reviewed negation                                                       |
| Local evaluation persistence    | Pass       | Save a genuine automated test record in isolated browser storage, reload, inspect table                                                                                      |
| Export and before/after         | Pass       | CSV download initiated and baseline claim loaded into after phase                                                                                                            |
| Routes and mobile layout        | Pass       | Home, Library, About, Testing, Presentation and demo alias load; no page overflow at 390px and 1440px                                                                        |
| Accessibility automation        | Pass       | Axe reports zero detected violations on checked route states; home checked in light and dark themes                                                                          |
| Browser runtime                 | Pass       | No page errors during checker flow                                                                                                                                           |
| Backend/API                     | Not needed | Entire application runs locally; no API keys or server data boundary                                                                                                         |
| Production build                | Pass       | Strict TypeScript and Vite build; about 86.7 kB gzipped JavaScript and 5.0 kB gzipped CSS                                                                                    |
| Lint and dependency audit       | Pass       | ESLint clean; npm audit reports zero known vulnerabilities                                                                                                                   |

The browser suite runs against the production bundle using `npm run build && npm run preview`. Six Playwright tests pass across desktop and mobile Chromium emulation. These use isolated test storage and do not prefill the app with fake participant records. Earlier checks identified contrast, library heading order and keyboard scrolling issues; all were corrected. The expanded checker additionally verifies everyday questions, explicitly reviewed negation, broad-claim clarification and navigation to related sources.

## Still manual

- Real participation: at least five other people, at least 20 original claims, honest expected answers and before/after analysis.
- Independent adult/clinical content review, rechecking all official source links and reviewing 31 pending candidates.
- Physical Android/iOS, Safari, screen readers, browser storage/download restrictions and zoom checks.
- Import the repository into Vercel, confirm a successful public deployment, then test signed out on another device. No public URL has been claimed.
- Fill actual team contributions/results/URL in presentation documents; compare proposed PPT answers with the real official template.
