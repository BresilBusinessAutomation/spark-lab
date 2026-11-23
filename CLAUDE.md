# Spark Lab

A kids' electronics game. Static site: no build step, no dependencies, no `package.json`.

## Running it

Open `index.html` in a browser, or serve the folder with any static server. There is
nothing to install, build or test.

## Layout

- `index.html` — markup plus all CSS (one inline `<style>`)
- `js/core.js` — colours, characters, audio, speech/voices, dialogue, scene engine
- `js/circuit.js` — circuit board: parts with pins, wires drawn pin to pin, small nodal
  simulator (`Board` class)
- `js/chapters.js` — the story chapters, `ch1`..`ch12`, each an async function
- `js/app.js` — menus, story map, workshop, pals, grown-up corner, progress

The four scripts are plain (non-module) `<script>` tags loaded in this order:
**core, circuit, chapters, app**. Top-level `const`/`function` declarations are shared
globals, so the order matters — `app.js` refers to `ch1`..`ch12` from `chapters.js`, and
`chapters.js` uses helpers from `core.js` and `circuit.js`.

## Chapters

`CHAPS` in `js/app.js` is the ordered list shown on the story map; each entry's `run`
points at a `chN` function in `js/chapters.js`. Twelve chapters, "Meet Zip" through
"Pip & the guitar".

## Saved state

`localStorage`, two keys: `sparklab-v2` (chapter progress, workshop) and `sparklab-voice`
(speech speed, subtitles on/off). No backend, no accounts.

## Deployment

Push to `main` on GitHub (`BresilBusinessAutomation/spark-lab`) and Vercel deploys
production automatically. Live at https://spark-lab-tawny.vercel.app — no build command
and no output directory; Vercel serves the repo root as-is.
