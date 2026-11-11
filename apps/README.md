# Portfolio Labs

Five independent browser projects, also maintained as standalone repositories, from **trustNOpeps**. These are personal learning experiments, not delivered client products.

| Project | Focus | Live demo |
|---|---|---|
| [MechLabs](https://github.com/trustNOpeps/mechlabs) | React/TypeScript engineering workbench with unit tests and CI | [Open MechLabs](https://mechlabs-engineering.lovable.app/) |
| [Little World](https://github.com/trustNOpeps/little-world) | Isometric creative internet café, scripted coworker routines, local tasks and saved progress | [Explore Little World](https://trustnopeps.github.io/trustNOpeps/apps/little-world/) |
| [Pixel Desk](https://github.com/trustNOpeps/pixel-desk) | Retro project explorer, 16 × 16 pixel pad and PNG export | [Open Pixel Desk](https://trustnopeps.github.io/trustNOpeps/apps/pixel-desk/) |
| [Tensile Desk](https://github.com/trustNOpeps/tensile-desk) | Stress–strain calculations, input validation, SVG graph and CSV export | [Open Tensile Desk](https://trustnopeps.github.io/trustNOpeps/apps/tensile-desk/) |
| [Request Desk](https://github.com/trustNOpeps/request-desk) | Procurement request editing and CSV/JSON export | [Open Request Desk](https://trustnopeps.github.io/trustNOpeps/apps/request-desk/) |

## Test

From the repository root (Node.js 20+):

```bash
npm test
```

The test command runs the pure logic tests for Tensile Desk, Request Desk and Little World. MechLabs has a separate Bun/Vitest test and build workflow. Pixel Desk is a small UI-only experiment with no automated logic suite. Browser behavior should be checked separately.

Little World uses JavaScript ES modules and requires an HTTP server to load reliably; the other static apps can be opened directly. No API keys or backend services are needed for these demos.

## Scope and attribution

These projects were created with AI-assisted development as part of practical learning. No fabricated customer outcomes, autonomous agent capabilities, or professional deployment claims are made. Project limitations are documented within each folder.
