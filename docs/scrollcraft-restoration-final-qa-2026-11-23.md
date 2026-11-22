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
