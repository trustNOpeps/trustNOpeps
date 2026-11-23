# GitHub Work continuation — 23 November 2026

## Scope and canonical repository
- GitHub account/repository: `trustNOpeps/trustNOpeps`.
- Main portfolio website: https://trustnopeps.github.io/trustNOpeps/
- Published site branch: `gh-pages`; documentation branch: `main`.
- Owner-approved visual direction: keep the original dark portfolio, natural Three.js scrollcraft, original type and layouts; avoid redesigning it as a generic AI-generated template.

## What the interrupted Work session completed
At `gh-pages` commit [0355063](https://github.com/trustNOpeps/trustNOpeps/commit/0355063ef656af56ef6d4cc253eb58e99b3c30cf), the Work session:
- Removed retired miniature 3D visuals from Engineering, Digital and Creative project galleries.
- Preserved full Three.js artwork in Hero, Concepts ("The thinking behind the build"), About and Contact.
- Guarded render columns smaller than 120px and scoped the Concepts 3D rendering to its chapter.
- Updated `immersive-world.js?v=gallery-clean-1`.
- Successfully deployed GitHub Pages: [run 45092391076](https://github.com/trustNOpeps/trustNOpeps/actions/runs/45092391076).

The remaining task when Work reached its limit was **post-change live browser QA**, especially scrolling forward and backward between Creative, Concepts and About.

## Continuation completed in this chat
1. **Live desktop QA at 1440×900: PASS.** Tested all seven chapters forward and backward. WebGL canvas stayed hidden throughout Engineering, Digital and Creative galleries, with no stray miniature 3D objects; normal-size scenes stayed visible on Hero/Concepts/About/Contact. Scissor transition entering Concepts was smooth; reversing Concepts → Creative had no artifacts. No observed browser console errors or unhandled rejections.
2. **HTML hygiene:** Removed duplicate `id` attributes on `#project-after-wanting` and `#project-book` without altering the design. [Commit 34b5e90](https://github.com/trustNOpeps/trustNOpeps/commit/34b5e9040b692bd62107b023a68ba242232e23f9).
3. **New mobile bug caught by live QA:** The Engineering Mechatronics preview ("SENSE / COMPUTE / MOVE") had a 426.7px wide grid card and was visibly clipped on 320px and 390px phones despite the absence of document-level horizontal scrolling.
4. **Targeted responsive fix:** Added `minmax(0,1fr)`, `min-width:0` and bounded width/padding for the Mechatronics card and diagram in `gh-pages/project-showcase.css`. Used a cache-busted CSS reference in `gh-pages/index.html`; original visual language and 3D engine remain unchanged. Latest code/deployment commit: [f495271](https://github.com/trustNOpeps/trustNOpeps/commit/f4952714832b545027206cec06deb856e33e003e).
5. **Live mobile QA after deployment: PASS.**
   - Phone 320×640: card/preview width 284px (x=18…302), inner system diagram width 256.8px, fully visible.
   - Phone 390×844: card/preview width 354.4px (x=18…372.4), inner diagram width 290px, fully visible.
   - Tablet 768px: card width 683.53px (x=38.4…721.93), fully visible.
   - Document `scrollWidth === clientWidth` at all three tested widths; menu accessible. All three diagram steps and labels were readable.
   - New CSS asset confirmed live: `project-showcase.css?v=phone-mechatronics-20261123`.
6. Latest successful Pages build: [run 45093768269](https://github.com/trustNOpeps/trustNOpeps/actions/runs/45093768269).

## Final status and constraints

**Final QA: PASS at the inspected views and transitions.** This does not certify untested physical devices, every project route, or all future browser versions.

Do not:
- Restore the retired gallery 3D scenes.
- Hide the Concepts exhibit or remove its intended scroll motion.
- Reintroduce prior experimental light/editorial layout or generic template styling.
- Use `overflow-x:hidden` as a substitute for responsive layout fixes.

For further work, edit the smallest affected selector or script function and validate the *published version* after GitHub Pages deployment, with explicit CSS/JS cache versions, at 320, 390 and 1440px.

## Latest follow-up: smoother Creative → Concepts scroll reveal

**Owner feedback:** The Concepts building exhibit was correctly positioned but popped into view abruptly when scrolling down from the Creative book. The earlier hard visibility gate was a design regression.

**Baseline, measured live on desktop 1440×900:** `scrollY=7438` hid the canvas, but `scrollY=7439` immediately revealed the full canvas at opacity 1. This was caused by `galleryWasHidden` + unconditional `visibility='visible'` and the direct camera reset on scene entry.

**Scoped fix deployed 23 Nov 2026:**
- `gh-pages/immersive-world.js`: Compute a reversible `smoothstep` reveal from the physical top of `#concepts` moving across approximately 48%→12% of viewport height, only when entering Concepts from the Creative showcase; give the camera a subtle depth/y offset that eases away as the 3D fades in.
- `gh-pages/immersive-world.css`: Apply `--concept-reveal` as opacity only while `.world-entering-concepts` is present; no CSS opacity interpolation is layered on top of the scroll-scrub.
- `gh-pages/index.html`: Cache-bust `immersive-world.js?v=concepts-scrub-1` and `immersive-world.css?v=concepts-scrub-1`.
- GitHub Pages deployment [45095285494](https://github.com/trustNOpeps/trustNOpeps/actions/runs/45095285494): **success** at commit `6a4ea701fe4c314b243e8e1b71e9779eabf268e0`.

**Post-deployment browser verification: PASS** after confirming both new asset URLs were loaded. At 1440×900, measured computed canvas opacity at `#concepts` top positions 430, 350, 260, 180 and 100px: **0.0002 → 0.1608 → 0.5476 → 0.8747 → 1.0**. Forward and reverse scroll transitions were smooth; no old Creative 3D behind the book. Hero, About and Contact retain their original full opacity 3D scenes. Mobile 320 and 390px: no horizontal overflow, working navigation and fitted Mechatronics graphic. No JavaScript runtime errors observed.

**Design constraint:** Do not revert to hard visibility toggling or reintroduce retired gallery 3D sculptures. Keep the user's approved dark visual design and original 3D geometry and typography. Future fixes must use a narrow scope and test scroll transitions in both directions.
