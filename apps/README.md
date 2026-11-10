# Portfolio Labs

Four independent applications for the trustNOpeps portfolio. These are runnable code projects, separate from the earlier concept notes in `/projects`.

| Project | Focus | Start |
|---|---|---|
| [Tensile Desk](tensile-desk) | Mechanical engineering calculations, input validation, SVG chart | Open `tensile-desk/index.html` |
| [Request Desk](request-desk) | Procurement workflow, safe text handling, structured export | Open `request-desk/index.html` |\n| [Pixel Desk](pixel-desk) | Colorful project explorer, pixel pad and PNG export | Open `pixel-desk/index.html` |\n| [Little World](little-world) | Isometric creative office, simulated coworker tasks and local progress | Run a local static server, then open `little-world/` |

Use `npm test` at the repository root for the dependency-free calculation and export tests. No npm installation is needed. Each folder is self-contained and can be extracted into its own repository later.

## Validation

- 19 Node tests cover numerical examples, invalid input, numeric overflow, acquisition order, CSV escaping, spreadsheet formula neutralisation, and unit-aware summaries.
- Browser JavaScript syntax checked with `node --check`.
- Automated local Chromium testing was attempted but could not start because the execution environment denied socket creation. Visual and browser interaction verification is therefore not claimed here.

## Design

An off-white work surface, forest-green actions, clear units, keyboard focus outlines, and a single-column layout below 760 px. These apps keep processing local and require explicit exports rather than saving personal data silently.

## Development attribution

Created as independent learning projects for trustNOpeps with AI-assisted implementation. There are no client-delivery, adoption, or advanced-expertise claims.
