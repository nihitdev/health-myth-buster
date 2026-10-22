# Reproduce the local presentation pack

These helpers generate presentation files without changing the app. They use the user's original official template and downloaded narration as local inputs. Those inputs and the generated submission files are intentionally not published to the repository.

Run from the repository root. Requirements: npm dependencies installed, a Chromium browser installed through Playwright, Python 3.10+, FFmpeg and ffprobe.

```sh
python3 -m venv .venv-media
.venv-media/bin/pip install -r scripts/presentation/requirements.txt
npx playwright install chromium
npm run dev
```

In a second terminal:

```sh
node scripts/presentation/capture.mjs
.venv-media/bin/python scripts/presentation/build_deck.py /path/to/PPT_Template_Grade6_AI_HealthMythBuster.pptx
python3 scripts/presentation/write_human_script.py
node scripts/presentation/render.mjs
python3 scripts/presentation/assemble.py /path/to/narration.mp3
```

Outputs are written under `deliverables/health-myth-buster/`. The default template input is the supplied filename in `~/Downloads`. Capture defaults to localhost:5173; set `HMB_BASE_URL` if needed. The trailer is a synthetic-narrator extra, not the full human pitch required by the official instructions.

`build_deck.py` preserves all nine official slides and restores/verifies the first slide XML byte-for-byte. It uses real screenshots, actual source links and explicit unfinished fields for genuine participant data and independent student answers. `render.mjs` creates a layout-preview PDF from the deck's text, table and image positions. This is not an Office rendering engine; check the PPTX in PowerPoint or Google Slides. `assemble.py` muxes the supplied voiceover with actual browser recording and produces H.264/AAC MP4 with fast-start metadata, plus inspection frames.

Do not invent participant results, impersonate actual students with AI narration, or fill their independent understanding responses for them. Follow PRESENTATION_NOTES.md and the user's official instruction document.
