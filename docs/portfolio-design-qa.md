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

The `gh-pages` deployment for `9c82a118` completed successfully in GitHub Actions.

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

## Device / visual QA acceptance matrix

**Status: needs post-change visual verification**. A previous browser review covered desktop 1440×900, tablet 768×1024 and phone 390×844, but the current revision was published afterward. A broad automated visual re-audit was started but did not return a completed report at the time this log was authored. Do not treat code checks as a substitute for a completed visual test.

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

- Full manual visual QA on current revision, including Safari/iOS, Android, smaller laptops and the 320px edge case, **remains open**.
- Lighthouse performance, accessibility, SEO and networking scores **have not been measured**; do not invent scores.
- 3D rendering relies on WebGL and an external Three.js CDN; Google Fonts is also externally loaded. The basic fallback is present, but bandwidth/device testing remains useful.
- The Contact CTA uses **public GitHub Issues** (not a private inbox). If a verified business email or LinkedIn contact route is later supplied and approved, replace or complement it.
- Some concepts and engineering studies are documented prototypes/educational tools, not certified engineering analysis or delivered client work. Preserve these distinctions.

## Handoff for a future Astra / Work review

Ask the reviewer to use the **current live URL and `gh-pages` source**, review all seven scroll chapters at desktop/tablet/phone sizes and inspect actual click destinations and screenshots. Prioritize real regressions in visual balance, readability, performance and accessibility, not superficial redesign. Retain brand `haammkaki`, existing dark/lime/lavender system, working 3D-scene storytelling and documented project status. Submit discrete code changes, record tested viewports and verify the GitHub Pages deployment. Avoid claims of 100% QA without tested evidence.
