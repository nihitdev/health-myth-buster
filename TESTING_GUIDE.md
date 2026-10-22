# Genuine human testing

No human outcomes are supplied. Automated regression results do not represent user-testing accuracy.

## Four students, at least five other people, at least 20 claims

Use [Student 1] through [Student 4] until actual names and contributions are agreed. Invite at least five distinct other people in total (for example a parent, teacher, older student and NGO volunteers). Each person enters at least four claims in their own words, producing at least 20 genuine claims. The four students can share setup, source review, recording and analysis; document only who actually did each task. Seek appropriate adult guidance for participation; do not record identities or health information.

1. Explain the prototype and its limits. Ask participants not to share diagnoses, symptoms, contact details or other sensitive information. Use general public-health claims.
2. Open `/testing`. Start in **Before improvement**. Ask people to enter their own wording, rather than copying all examples. Include supported facts, myths, unknown topics, negation and irrelevant wording.
3. Independently inspect reliable source evidence before setting the expected answer. An unsupported or out-of-scope wording should be expected UNVERIFIED under this tool's documented policy. Resolve disagreements with an adult/source review; do not choose expected answers merely to agree with the tool.
4. Run the actual checker. Record expected answer, observed answer, your Correct/Incorrect assessment and non-personal feedback. Save the evaluation. If correctness differs from exact verdict equality, explain why in feedback.
5. Record at least 20 claims. Export JSON and CSV before clearing browser data. Records stay on that device. Keep exports private and free of personal information.
6. Calculate Accuracy = Correct answers / Total tested claims × 100. Report correct, incorrect and total counts alongside the percentage. No tests means no measured accuracy. Do not confuse this small sample with clinical validation.

## Learn and retest

Inspect incorrect and cautious results. Identify missing synonyms, misleading overlap, negation or a genuinely absent evidence entry. Improve rules only when safe. Never add unsupported medical facts. Add regression tests for real failures with any personal details removed. Run `npm test`, `npm run lint`, `npm run build` and `npm run test:e2e`.

Load each saved baseline claim using **Load next baseline claim**, choose **After improvement**, and rerun the same wording with the same expected answer. Keep both records. The comparison cards summarize each phase; use equal claim sets and sample sizes, not different easy claims. Export both phases and retain the Git commit for each version. Record the exact change and any new failures. Further wording changes are new claims and should not be counted as direct before/after pairs.

## Manual device checks

Check Android/iOS and desktop, keyboard-only navigation, screen reader announcement, light/dark themes, 200% zoom and reduced motion. Read both sources for every published entry. Test copy/paste, empty input, the character limit, source tabs and downloads. Test direct routes on the deployed site in a signed-out browser on another device. Confirm the real public URL only after successful deployment. These checks are pending until people perform them.
