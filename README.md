# BankShot

One-cushion bank and kick shot geometry for pool, drawn on the table. Static, no build, no dependencies. Open `app.html` or visit the GitHub Pages site.

## What it does

- Enter cue ball and object ball positions in diamond coordinates (x 0-8, y 0-4 on a 9-foot table).
- Get the aim point on each rail via the mirror method: reflect the target across the cushion; the straight line to the mirrored target crosses the rail at the aim point.
- Paths ranked by total length, with travel distances and incidence angles, drawn on an SVG table.

## Limits

Idealized geometry: no spin (english), no cushion compression, no throw. Real tables rebound shorter than the mirror angle, especially at slow speeds and steep angles. Use it to learn the system, then adjust by feel at the table.

## Development

Pure JS engine (`engine.js`), browser and Node compatible. Tests run the engine against a python oracle (`tests/build_corpus.py` generates `tests/expected.json`); comparisons use tolerance because JS rounds half-up and python rounds half-even:

```
python3 tests/build_corpus.py
node tests/run_tests.js
```

Built as app #398 of the app factory.
