# AFTER WANTING — Astra / Work implementation handoff

Updated: 12 November 2026

## Source of truth

- Live site: https://trustnopeps.github.io/trustNOpeps/showroom/
- Actual deploy branch: `gh-pages`
- Site source: `gh-pages/showroom/index.html`
- Published concept imagery: `gh-pages/assets/after-wanting/vol01.webp`–`vol07.webp`
- Context/project note: `main/projects/after-wanting.md`
- Source collection: user-provided *AFTER WANTING Collection Portfolio* PDF (53 pages, Vol.01–10). This PDF is NOT publicly committed.

## Current state

- Brand website created with hero, featured collection, ten-volume archive, search/filter/save, detail overlays, garment study gallery, manifesto, packaging explorer and contact.
- Source artwork boards 01–07 are public in compressed form; Vol.08–10 are intentional flat illustrations, not real product photographs.
- Garment boards must show in full. Latest deployed CSS sets `object-fit:contain` (instead of cropping `cover`) for hero, featured image, collection cards, lookbook and modal.
- **All virtual model images removed at owner's request.** Do not insert photos of models or synthetic human figures unless the owner explicitly changes this direction.
- Not a live store: do not claim stock, availability, release dates, price, payment or preorder processing.
- The collection investor PDF includes hypothetical economics; do not present these as real retail prices, sales or inventory.

## Design direction

Editorial minimalism, independent contemporary streetwear, photographed/product-led styling **only using approved original garment assets**. Inspired by principles of editorial fashion sites and straightforward product discovery, without copying trademarked brand layouts. Palette charcoal `#171814`, warm paper `#f4f1eb`, terracotta `#ad4b3b`, stone `#e9e3d8`; display Space Grotesk, editorial Instrument Serif, body DM Sans.

## Next Work / Astra tasks

1. Review all pages at 1440×900, 1024×768, 768×1024, 390×844 and 320×640. Measure clipping, scroll anchoring, readable typography and tap targets.
2. Verify all garment images remain **fully visible**, including opening collection detail overlays. Prefer `contain` with thoughtful framing; avoid upscaled or cropped product mockups.
3. When approved original artwork for Vol.08–10 is available, prepare compressed per-volume images and replace CSS illustration placeholders without generating fake real-world production photos.
4. If the owner authorizes additional design assets, create a proper item grid from exact concept drawings. Do not invent material specifications, measurements or manufacturing readiness.
5. Polish visual hierarchy, transitions, SEO/social previews, image alt text and Lighthouse performance.
6. Maintain `haammkaki` as public creator identity; `trustNOpeps` stays only as the GitHub account/URL.
7. Commit carefully to `gh-pages`, verify GitHub Pages workflow and manually inspect the live URL afterward.

## Required acceptance criteria

- Hero and lookbook contain **zero model/person imagery**.
- Full garment designs are visible without cutting off sleeves or typography.
- No broken image requests, JS errors or horizontal overflow on tested screen sizes.
- Archive contains exactly ten volumes with original names and themes, faithful to PDF.
- Claim boundaries are explicit: concept visuals are not manufactured stock.
- Maintain clear responsive navigation and functional search/save/details.

## Important privacy note

Deleting `model-campaign.webp` from the current published tree removes it from the live branch head, but **does not erase historical Git commits**. If complete history removal is requested, investigate history rewrite separately and discuss the impact on existing links.
