# Pixel Pad

A focused pixel art editor by haammkaki. The repository and published URL retain the Pixel-Desk name for existing links.

[Open Pixel Pad](https://trustnopeps.github.io/trustNOpeps/apps/pixel-desk/)

## Features

Large canvas with 16, 32 and 64 pixel grids; pencil, eraser, flood fill and colour picker; four palettes and custom colours; horizontal mirror; undo/redo; grid toggle; heart/checker patterns; nearest-neighbour resizing; transparent PNG export; editable JSON project import/export; browser autosave.

The old Project Explorer has been removed. Keyboard users can focus the canvas, move with arrow keys and paint with Space. Project imports validate grid sizes, pixel count and colour values. No account or server is required.

## Run and verify

Serve this directory with a static HTTP server (ES modules need HTTP).

```sh
python3 -m http.server 8000
node --test core.test.mjs
node --check app.mjs
```

Tests cover flood fill boundaries, continuous strokes, resizing and malformed project files. Local storage can be cleared by the browser; download a project file to keep a portable copy.
