# haammkaki — Portfolio design system & QA handoff

**Audit date:** 2026-11-12  
**Public site:** https://trustnopeps.github.io/trustNOpeps/  
**GitHub profile:** https://github.com/trustNOpeps  
**Source of live website:** `gh-pages` branch (`index.html`, `immersive-world.css`, `immersive-world.js`)  
**Repository documentation:** `main` branch

## Product intent

A seven-chapter, scroll-led personal portfolio. It should feel like a deliberately art-directed engineering and creative studio, not a generic AI-generated template. Display identity is **haammkaki**. **trustNOpeps** remains the GitHub account and part of the technical URL; do not expose the legal name in the site or repository.

1. Overview / introduction
2. Engineering workbench
3. Digital playground
4. Creative practice
5. Concept studies
6. About
7. Contact

The seven 3D scenes are original procedural Three.js compositions made from geometric primitives. They are atmospheric illustrations, **not** proofs of physical engineering designs.

## Visual system

| Element | Choice | Intent |
| --- | --- | --- |
| Foundation | `#0b1116` | Deep technical charcoal, avoid pure black |
| Main text | `#eeeae2` | Warm off-white for readable editorial typography |
| Accent | `#c4f06b` | Restrained lime for progress, selection and primary action |
| Secondary accent | `#afa0dc` | Soft lavender for emphasized concept language |
| Third accent | `#a8d2c7` | Soft sage/ice to support physical-model geometry |
| Display type | Space Grotesk | Headlines with controlled negative tracking |
| Body type | DM Sans | Calm readable paragraphs and project descriptions |
| Metadata | System monospace | Chapter numbering, material labels and provenance |

**Design constraints:** consistent typography and scene scale; real project status; no fake metrics, fictional employers or fabricated validations; no decorative stock art, watermarks or copied 3D models; retain sufficient negative space around 3D objects. Mobile text and controls take precedence over artwork.

## Implemented improvements

Two live-site commits:
- `c4943d92`: responsive chapter-content navigation, 3D Contact composition, mobile layout refinements, fixed-header handling and URL navigation.
- `9c82a118`: fixed favicon initial, added Concept Studies to desktop navigation, tablet menu, better mobile anchor landing, mobile active navigation, responsive scene spacing, font preconnect, and actionable public GitHub Issues contact option with privacy caveat.

- `e2d8928e`: addressed three measured UI issues from the four-viewport browser audit: desktop rail/content collision, tablet's nearly invisible rail, and mobile undersized link targets.

The `gh-pages` deployments for `9c82a118` and `e2d8928e` completed successfully in GitHub Actions.

## Verified checks

The following were checked **in the GitHub source/deployment**, not claimed as exhaustive visual tests:

- [x] GitHub Pages workflow for current production revision completed successfully.
- [x] All in-page anchor destinations used by site navigation exist.
- [x] No duplicate `id` values in the primary page.
- [x] Internal relative links resolve to files or `index.html` pages in `gh-pages`.
- [x] Portfolio thumbnail has descriptive alt text.
- [x] The linked project repositories exist.
- [x] Hash navigation, back/forward hooks, Escape for mobile menu, responsive 3D spacing and reduced-motion scroll handling are present in source.
- [x] GitHub Issues is enabled on the main repository; issue conversations are public and require a GitHub sign-in to submit.

## Measured baseline findings and fixes

| Baseline browser evidence | Corrective action |
| --- | --- |
| At desktop 1440×900, fixed right rail overlapped right-column content by ~101px | Added dedicated right-column rail gutter above 1150px |
| At tablet 768×1024, rail links collapsed to ~26×1 CSS px and there was no header Concepts link | Added Concepts to the header, provided a tablet menu and hid unusably small rail |
| At phone width 390px, card action links were ~14px tall; footer back-to-top was ~12px | Set minimum 44px tap areas at mobile sizes |
| Seven anchor targets exposed the heading and first visible content at all four widths | Retained readable-content anchor behavior for every viewport |
| No horizontal overflow or captured JS/network errors across four baseline sizes | Retained responsive, fallback and reduced-motion behavior |

## Post-fix browser regression results (PASS)

- **1440×900 desktop:** Concepts rail/content overlap = 0px², minimum gap 28.64px; Contact rail/content overlap = 0px², minimum gap 50.64px; contact CTAs visible, 48.4px tall.
- **768×1024 tablet:** Menu visible, 44px tall; Concept Studies reachable in menu; unusable right rail hidden (0×0px).
- **390×844 phone:** Engineering heading y=123–204.6px; Contact heading y=267.33–355.9px after navigation; all 11 project-action links 44px tall; footer anchor 44px tall; scrollWidth matches viewport (390px); zero captured browser-console errors.

These measurements are browser test results, not a guarantee of identical geometry on all devices.

## Device / visual QA acceptance matrix

**Status: PASS for tested browser criteria.** An automated browser review checked desktop 1440×900, tablet 768×1024, phone 390×844 and compact phone 320×640. Seven chapter anchors exposed headings and first content; no horizontal overflow or browser errors were detected. Three measured issues were patched in `e2d8928e` and targeted post-fix browser testing passed on desktop, tablet and 390px phone. Physical-device/Safari checks and Lighthouse scores are not covered by this PASS.

| Viewport | Acceptance criteria |
| --- | --- |
| 1440×900 desktop | All seven chapters, titles, 3D models, cards and progress rail feel balanced; no text/3D collision |
| 1024×768 compact desktop | Header fits; scene and copy have safe margin; no clipped headlines |
| 768×1024 tablet | Tablet menu works and closes; no horizontal scrolling; all cards readable |
| 390×844 phone | Menu, anchors and buttons work; content heading visible after jumping; content does not overflow |
| 320×640 compact phone | No horizontal scrolling, unreachable calls-to-action or unreadable paragraph width |
| Keyboard navigation | Skip link, menu, focus outline and anchor links are usable |
| Reduced motion / WebGL failure | Readable site remains available without relying on animation or remote 3D load |
| Orientation change | 3D scene spacing, camera and header do not break after switching widths |

## Honest limitations / remaining decisions

- Physical-device visual QA, especially iOS Safari, Android Chrome and smaller laptops, **remains open**. Automated browser checks did include 320px, but not a physical device.
- Lighthouse performance, accessibility, SEO and networking scores **have not been measured**; do not invent scores.
- 3D rendering relies on WebGL and an external Three.js CDN; Google Fonts is also externally loaded. The basic fallback is present, but bandwidth/device testing remains useful.
- The Contact CTA uses **public GitHub Issues** (not a private inbox). If a verified business email or LinkedIn contact route is later supplied and approved, replace or complement it.
- Some concepts and engineering studies are documented prototypes/educational tools, not certified engineering analysis or delivered client work. Preserve these distinctions.

## Handoff for a future Astra / Work review

Ask the reviewer to use the **current live URL and `gh-pages` source**, review all seven scroll chapters at desktop/tablet/phone sizes and inspect actual click destinations and screenshots. Prioritize real regressions in visual balance, readability, performance and accessibility, not superficial redesign. Retain brand `haammkaki`, existing dark/lime/lavender system, working 3D-scene storytelling and documented project status. Submit discrete code changes, record tested viewports and verify the GitHub Pages deployment. Avoid claims of 100% QA without tested evidence.
