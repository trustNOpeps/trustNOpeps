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
