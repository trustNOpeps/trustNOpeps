# Final visual rollback and 3D scrollcraft QA · 23 November 2026 (Asia/Makassar)

## Decision: preserve the approved original visual direction

The owner rejected the later "independent maker's archive" editorial redesign because it removed the prior visual character and made sections/overlays appear inconsistent. The live homepage HTML was explicitly restored from stable pre-redesign commit `78174a499b4143839ce87829c0714ed4d07e1b11` while preserving critical mobile styling and removing two duplicate HTML IDs. Neither `studio-archive.css` nor `motion-restoration.css` is loaded by the live HTML. The original Space Grotesk / DM Sans, dark background, work showcases and Three.js procedural scroll world are intact.

## Confirmed issue and cause

At desktop 1440×900 before repair, the dense showcase chapter `.content` filled almost the entire container. The old renderer calculated its scissor viewport from the right of that content to the progress rail, shrinking the usable width drastically: Engineering and Creative **18.586 CSS px** each, Digital **108 CSS px**. `camera.zoom` fell to approximately `0.02176` or `0.12643` respectively. This produced the tiny stray floating objects in screenshots. It was a viewport sizing problem, not a Three.js model sizing or font problem.

## Surgical fixes applied

1. Restore the pre-redesign homepage structure, removing the experimental editorial stylesheet.
2. In `gh-pages/immersive-world.js`, detect full-width `showcase-chapter` and calculate a safe art gutter rather than the negative/near-zero free-space region.
3. Guard the interpolated scissor width against degenerate values.
4. In `gh-pages/immersive-world.css`, fade the canvas to zero during Engineering, Digital and Creative gallery reading, using the existing CSS opacity transition. Keep full, scroll-driven Three.js on Overview/Hero, Concepts, About and Contact.
5. Preserve original mobile responsive exhibit images and seven chapter-dot navigation. Browser cache-bust version strings:
   - `immersive-world.js?v=render-column-fix-1`
   - `immersive-world.css?v=gallery-fade-final-1`

## Published and independently verified

GitHub Pages deployment: **success**, [run 45049548065](https://github.com/trustNOpeps/trustNOpeps/actions/runs/45049548065).

Fresh public browser re-check (not the pre-deployment cached version), at desktop 1440×900 and mobile 320×640 and 390×844:

| Desktop location | Showcase reading | Canvas opacity after >1.2 sec | Three.js scene |
| --- | --- | --- | --- |
| Hero | false | 1 | visible |
| Engineering gallery | true | ~0.0039 fading to 0 | hidden |
| Digital gallery | true | 0 | hidden |
| Creative gallery | true | 0 | hidden |
| Concepts | false | ~0.9788 fading to 1 | visible |
| About | false | 1 | visible |
| Contact | false | 1 | visible |

At the tested positions:
- No stray tiny 3D models in the gallery chapters.
- Original full-sized 3D artworks visible in the designated sections.
- Fixed progress navigation remains usable.
- Text contrast and headings remain legible, and dark visual system is consistent.
- No page-level horizontal overflow at 320 or 390 px.
- Mobile menu and seven chapter-dot links work with touch; project links are active.
- Mobile intentionally uses lightweight responsive scene images, not WebGL rendering.

**QA status: PASS for the tested pages and viewports.** This is not a physical-device test on Safari/iOS and is not a claim that every external app and every future viewport has been tested.

## Future work guidance

Do not reintroduce editorial light-panel redesign or 3D canvas overlays within full-width project galleries without user approval. Prioritize stable responsive behavior and functional navigation. All future changes to the scrollytelling camera/viewport require before-and-after browser tests of at least one project-gallery midpoint and one dedicated 3D scene, not merely a successful GitHub build.

## Additional Creative → Concepts transition regression and fix

A later real user screenshot showed stray partial 3D models behind the last **Berpikir di Era AI** creative card and the opening of **The thinking behind the build**. The earlier gallery-midpoint QA passed but did not explicitly inspect this cross-chapter boundary. It was premature to call the transition finished.

**Cause:** `readScroll()` previously removed `showcase-reading` when the rounded, goal scene index changed from Creative to Concepts, before the new chapter had cleared the sticky header or the interpolated Three.js camera had settled. For part of that transition the old Creative model and new Concepts model could both be visible as clipped background fragments.

**Fix published:** `gh-pages/immersive-world.js` now gates canvas visibility for entry into Concepts until (1) `#concepts` has passed the fixed header, and (2) the rendered scene position reaches `conceptsIndex - .003`, ensuring the prior model is no longer visible at its existing `.995` visibility threshold. `gh-pages/immersive-world.css` shortens fade-out to `.16s` while keeping the original slow fade-in, with browser-cache version `concept-boundary-gate-2`. Original layout, colors and other 3D scenes remain unchanged.

**Live browser verification, after deployment:** GitHub Pages run [45050902913](https://github.com/trustNOpeps/trustNOpeps/actions/runs/45050902913) succeeded. At 1440×900, when Concepts chapter top was around **500px, 250px and 120px** from viewport top, canvas opacity stayed **0**, and no 3D fragments appeared. At chapter top around **70px**, the dedicated Concepts 3D scene displayed at normal scale after settling with canvas opacity **1**. Scrolling upward Concepts → Creative hid the canvas appropriately. Hero and About preserved their animations. At 320×640 mobile, no horizontal overflow, and all tested anchors worked. Status: **PASS for this specific previously missed transition**.
