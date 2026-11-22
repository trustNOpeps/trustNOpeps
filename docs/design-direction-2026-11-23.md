> **Superseded / rejected after visual review, 23 November 2026.** The owner did not like the experimental light-paper editorial redesign. It masked the original procedural 3D scene, broke the natural scrollytelling, and made the About section hard to read because the preexisting dark content vignette sat over a pale background. The `studio-archive.css` design is **not active** and must not be reintroduced without explicit approval. The live homepage returned to the original hero, Space Grotesk/DM Sans visual language, dark cinematic chapters and Three.js scroll-driven procedural artwork. The only new visual layer is `gh-pages/motion-restoration.css`, which adds restrained dark gradients, gentle scene tint transitions, a compact mobile chapter control and small OPEN indicators on genuinely clickable portfolio previews. BOURN remains a separate travel-editorial UI, now with visible six-step chapter navigation and selected-option markers. Verify live browser behaviour, not just source or workflow status.

# haammkaki — Art direction and mobile QA, 23 November 2026

## Decision
The portfolio is now treated as an **independent maker's archive**, not a SaaS marketing page or a generic multi-card portfolio template. This is original styling rather than a copied layout.

### Selected references and lessons
- Figma, 2026 web design: https://www.figma.com/resource-library/web-design-trends/ — expressive typography, storytelling and selective collage.
- Sofia Lambrou / *Corps Opérateurs* (Awwwards): https://www.awwwards.com/inspiration/parallax-project-page-sofia-lambrou — clear editorial hierarchy, large breathing room and distinct index typography.
- Obys Experiment Space reference: https://me.muz.li/obys/obys-experimet-space — work-as-archive treatment and typographic editorial emphasis.
- 2026 practical adoption advice: https://www.netguru.com/blog/modern-web-design-trends — invest in one memorable expressive section, but retain legible layouts and performance.

### Intentionally avoided
- Default bento grids with generic icons and gradients.
- Claims of completed client projects, synthetic performance metrics or fabricated validation.
- Animated loaders, constant scroll-jacking, expensive WebGL on mobile.
- Copying a winner's exact layout or typography.
- Redesigning Little World, BOURN, AFTER WANTING and the engineering calculators to share one aesthetic.

### Implemented on primary site
- Hero with an original typographic heading, provenance, brief introduction and three useful index links.
- Clear differentiation between engineering (warm laboratory paper), digital (deep charcoal), and creative (editorial warm paper) practice.
- Editorial Newsreader contrast against restrained Space Grotesk and system monospace.
- More structured showcase composition and intentionally squared visual framing.
- Full mobile/desktop responsive rules and an active-section-aware desktop chapter rail.
- Two duplicate HTML identifiers corrected in source.
- Easily reversible standalone `gh-pages/studio-archive.css` layered after existing CSS.

### Validation expectations
- 320, 390, 768, 1024, 1440 px no horizontal overflow.
- Hero title and first call to action readable and reachable.
- Fixed header and mobile chapter indicator do not occlude useful content.
- Section-background contrast allows titles, metadata and CTAs to be legible.
- Eight original portfolio projects still linked to real destinations.
- BOURN is rebuilt automatically from source in `.github/workflows/publish-bourn-preview.yml`.
- User-site root is not currently created: `https://trustnopeps.github.io/` cannot be repaired without creating the separate user-site repo `trustNOpeps.github.io` from an authenticated account. Share the canonical project-site URL until then.

### Future changes
Keep pages content-specific. Show authentic artifacts and methods instead of more visual effects. Any experimental visual change should be verified on narrow phones before considering it production quality.
