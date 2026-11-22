# Mobile portfolio audit and repair log
Date: 23 November 2026 (Asia/Makassar)
Owner: trustNOpeps / haammkaki
Public portfolio: https://trustnopeps.github.io/trustNOpeps/

## Scope and evidence
- GitHub repository inventory inspected for ten linked projects.
- The canonical site is published from the portfolio repository's `gh-pages` branch; `main` contains project sources and documentation.
- A browser audit examined the homepage, Little World, Pixel Pad, AFTER WANTING, VI Fieldnotes and BOURN (plus planner), at 320 px and 390 px, and discovered a reproducible 427 px Mechatronics Lab illustration overflow.
- A follow-up browser run measured 320 px and 390 px with viewport-matching document scroll width, Mechatronics visual width 284 px and 354 px, respectively, no visual clipping, and working Creative/Contact chapter dots.
- AFTER WANTING filter controls were measured 44 px tall at 320 px.
- Pixel Pad still displayed cached `styles.css` at follow-up. Its HTML CSS reference was subsequently versioned to `?v=mobile-controls-20261123`. Another browser measurement after that final cache-busting revision has **not** been performed. Treat updated mobile toolbar/palette behavior as source-verified, not browser-verified.

## Changes applied directly to GitHub
| Component | Change | Branch / source |
| --- | --- | --- |
| Portfolio | Persistent seven-point mobile chapter shortcuts, active progress, safe-area spacing, slightly more readable small captions | `trustNOpeps/trustNOpeps:gh-pages` |
| Mechatronics case study | Fluid-width artwork and `minmax(0,1fr)` card sizing to stop phone clipping | `gh-pages/project-showcase.css` |
| Little World | Direct mobile links to crew, console, work orders, projects; 44 px tap targets; 16 px form inputs | `Little-World:main`, portfolio `main` and `gh-pages` copies |
| Pixel Pad | 3-column palette on <=390 px phones, planned 2-by-2 toolbar, larger utility links, CSS cache-busting | `Pixel-Desk:main`, portfolio `main` and `gh-pages` copies |
| AFTER WANTING | Mobile collection filters, saved buttons and selectors have >=44 px touch areas | `gh-pages/showroom/index.html` |
| VI Fieldnotes | Larger mobile menu and consent buttons | `vi-fieldnotes:main/style.css` |
| Tensile Desk, Request Desk | Mobile forms render 16 px inputs, minimum 44 px controls | source repositories and both portfolio branches |
| BOURN | Mobile header exposes Explore and Plan, compact brand sizing | `bourn:main/app/page.tsx`; **not yet rebuilt into the static GitHub Pages snapshot** |
| Pixel Pad CI | Replaced obsolete `pixel-desk-art.png` requirement with actual editor HTML checks, syntax checks and unit tests | `Pixel-Desk:main/.github/workflows/tests.yml` |
| VI Fieldnotes CI | Accept valid existing `Last reviewed` and `Last fact-checked` dates rather than a single hard-coded legacy date | `vi-fieldnotes:main/tests/check_site.py` |

## Observed automated checks
- Pixel Pad Static checks: PASS, https://github.com/trustNOpeps/Pixel-Desk/actions/runs/45046244249
- VI Fieldnotes Static site quality gate: PASS, https://github.com/trustNOpeps/vi-fieldnotes/actions/runs/45046197472
- VI Fieldnotes Pages deployment: PASS, https://github.com/trustNOpeps/vi-fieldnotes/actions/runs/45046196714
- Little World Tests: PASS, https://github.com/trustNOpeps/Little-World/actions/runs/45045460215
- Tensile Desk Tests: PASS, https://github.com/trustNOpeps/Tensile-Desk/actions/runs/45045919228
- Request Desk Tests: PASS, https://github.com/trustNOpeps/Request-Desk/actions/runs/45045931518
- Main portfolio Pages deployment of preceding revisions: PASS, https://github.com/trustNOpeps/trustNOpeps/actions/runs/45045939876
- The latest main-portfolio deploy must be checked after the CSS cache-bust revision; previous intermediate runs may be cancelled when superseded.

## Open items / limitations
1. Root `https://trustnopeps.github.io/` is a 404. Canonical working public URL is `https://trustnopeps.github.io/trustNOpeps/`. No user-site repository or redirect was created in this audit. Advertise the canonical URL until one is created.
2. BOURN mobile header source is fixed, but its `bourn/` live GitHub Pages directory is an independently generated static Next.js export; rebuild with `npm run build:demo` and publish the generated `.demo-build/out` to `gh-pages/bourn/` to expose the new nav. Do not hand-edit generated React HTML.
3. Full device farm and real iOS Safari/Android hardware checks remain untested. Mobile layouts for MechLabs, ELSEWHERE, Tamuform and the other secondary portfolio pages were inspected at source/repository level, but not independently device-tested in this run.
4. Pixel Pad after cache-bust requires another measured browser regression at 320px; automated GitHub CI does not replace visual regression.
5. Root-level lighthouse performance, keyboard-only navigation and screen-reader testing were not completed.
6. BOURN auth, concierge features, and pixel studio AI agents should not be presented as verified production services. Preserve prototype disclosures.

## Handoff regression checklist
- Phones: 320, 360, 390, 430 px. Tablets: 768, 1024 px. Desktops: 1280, 1440 px.
- Assert no global horizontal overflow; image/cards never clip, all mobile options visibly discoverable.
- Check navigation position updates, menu open/close and Escape, focus indicators, 44 px touch controls, reduced motion, landscape.
- Validate project links and maintain GitHub Actions green for each changed repository.
- Rebuild BOURN's static preview from its current source before closing that issue.

Avoid claiming that every project is bug-free or that a physical phone test has been conducted without evidence.
