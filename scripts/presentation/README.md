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

## Assemble the supplied four-speaker pitch

The four original audio inputs are read from Downloads: `nihit.mp3`, `rudrash.mp4` (audio-only container), `prushi.ogg`, and `ahika.ogg`. Names shown in the presentation are Nihit, Rudransh, Priyushi and Ahika. Original recordings and generated media stay local and are excluded from Git.

```sh
.venv-media/bin/pip install -r scripts/presentation/requirements-audio.txt
python3 scripts/presentation/prepare_pitch_audio.py
# Optional local timing review; downloads a public model, not an audio service:
.venv-media/bin/python scripts/presentation/transcribe_pitch.py
node scripts/presentation/capture_full_pitch.mjs
.venv-media/bin/python scripts/presentation/assemble_full_pitch.py
```

Start the app first with `npm run dev`. Full-pitch outputs go to `deliverables/full-pitch`. Audio is normalized per speaker without speed changes. For these recordings, Priyushi's first 2.05 seconds contain a full-name introduction and are omitted to follow the official first-name-only instruction; the original file is not changed. Review that edit point before reusing these timing settings with different recordings.

The full capture uses real app actions aligned to the recorded sections. It checks the FALSE and UNVERIFIED results and the reviewed-library count rather than substituting mock results. The final assembler calibrates startup timing from the first presenter highlight, adds speaker chapters, exports H.264/AAC 1080p MP4, verifies its duration is between two and three minutes, checks decoding and audio peaks, and saves inspection frames. Automatic transcripts are timing aids; they are not perfect captions and are not burned into the video. No faces or synthetic avatars are created.

The short AI trailer remains a separate optional extra. The existing PPT is still a draft until a genuine collected example, actual participant evaluation and each student's independent understanding response are supplied.
