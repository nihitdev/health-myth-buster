# Health Myth Buster

A working, free health-literacy prototype for HCL Jigsaw 7.0, Round 2, Grade 6: AI Revolution & Digital Futures. Built for Indian students, families, teachers and NGO volunteers.

Enter one English health claim and receive TRUE, FALSE or an honest UNVERIFIED response. Every matched result has two official source links; every answer ends with **Always ask a doctor.**

## Honest scope

36 evidence-reviewed database entries and 31 separate pending candidates, targeting 50. Editorial source review during development is not independent clinical review. Transparent deterministic rules; **no machine learning, LLM, backend, API keys or paid services**. Unknown claims are never automatically false. This tool does not diagnose or prescribe.

## Run

Use Node 22.18+ (development verified with Node 26) and npm.

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run preview
npm run test:e2e
npm run audit:sources
```

For browser tests, first run `npx playwright install chromium`. The browser suite builds the production bundle and starts its own Vite preview server on port 5174, leaving the development server on port 5173 available. `audit:sources` regenerates the audit from stored review notes; it does not verify source content anew.

## Everyday wording

The checker recognizes controlled paraphrases, common word forms, simple questions and explicitly reviewed negative statements. For example:

| Input                            | Result                                              |
| -------------------------------- | --------------------------------------------------- |
| Do antibiotics work for the flu? | FALSE                                               |
| Vaccines do not cause autism     | TRUE                                                |
| Can mosquitoes spread HIV?       | FALSE                                               |
| Antibiotics cure all diseases    | FALSE                                               |
| Antibiotics cure common illness  | UNVERIFIED, with clarification and related evidence |

Related evidence does not verify an unknown original claim. This is a bounded rule-based tool, not general medical reasoning. Negation is never automatically inverted.

## Routes and features

- `/`: keyboard-friendly checker, one-click topic examples, clear verdicts and match transparency.
- `/library`: searchable evidence library, category/verdict filters and separate pending list.
- `/about`: methodology, limitations and privacy.
- `/testing`: empty-by-default local evaluations, expected/actual answers, manual correctness, feedback, CSV/JSON export and before/after reruns. One-click examples are practice previews and cannot be saved as genuine evaluations.
- `/presentation` (also `/demo`): three judge-friendly screens using the actual engine.

Light/dark themes persist on this device. Reduced motion is respected. Fonts are system-local, and claims never leave the browser. Reading source links requires internet. No personal details should be entered into test records.

## Deploy free on Vercel

No public deployment is claimed. Import the public GitHub repository into Vercel; select Vite, `npm run build`, output `dist`. No environment variables are needed. `vercel.json` provides SPA deep-link rewrites. Keep Vercel Authentication/Deployment Protection off for the intended public production site. The repository is open source; the deployed website should also be publicly accessible.

After deployment actually succeeds, record the real production URL. On a second device, open that URL in a private/incognito tab while signed out. Test a known claim, an unknown claim, two source links, `/library` and `/presentation` by direct navigation and refresh, the mobile layout and local test export. Confirm no login screen appears. Do not present a preview URL as a confirmed public deployment. Netlify is also supported: build `npm run build`, publish `dist`, with the included `_redirects` fallback.

See ARCHITECTURE.md, MYTH_DATABASE.md, SOURCE_AUDIT.md, TESTING_GUIDE.md, PRESENTATION_NOTES.md and VIDEO_SCRIPT.md for handover.

## Open source and contributions

Licensed under the [MIT License](LICENSE). Contributions are welcome through issues and pull requests. For evidence or matching changes, follow MYTH_DATABASE.md, include relevant official sources and regression tests, and run the quality checks before submitting. Do not submit personal health information or fabricated testing results. Linked third-party source material remains subject to its own terms; the license covers this project’s original code and documentation.
