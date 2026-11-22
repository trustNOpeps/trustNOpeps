# Visual direction · Decision Atlas / 004

## Intent

ELSEWHERE should feel like an independent graphic publication that happens to be a working decision tool. No glowing orbs, fake AI features, translucent dashboard cards, or repetitive rounded panels.

## Typography

- Display: **Unbounded**, 600–700. Broad character shapes and dense editorial rhythm, reserved for the identity, hero, and section titles.
- Interface: **IBM Plex Sans**, 400–700. Legible for option names, fields, actions, and explanatory text.
- Metadata: **IBM Plex Mono**, 400–600. Route numbers, model units, and micro-labels.
- Fonts are requested from Google Fonts with locally available fallbacks. The repository does not redistribute font binaries.

## Palette / token behavior

| Role | Color |
| --- | --- |
| Ink | `#191C1C` |
| Paper | `#F2F0E9` |
| Signal / primary CTA | `#ECF96E` |
| Route A / emphasis | `#EC5335` |
| Alternative route | `#4856DB` |
| Linework | `#C7C5BA` |

Warm paper and route colors are purposeful: lime is an action/high-fit cue, orange is for a route/emphasis, blue distinguishes another branch. The interface never relies only on color; labels and values accompany colors.

## Layout principles

1. 12-ish-column editorial field, with hard rules and numbered chapters; do not recreate stacked SaaS cards.
2. The hero is asymmetrical: one oversized type panel and a real data-bound route figure.
3. Every large display moment is followed by a calm readable working section.
4. Scores are descriptive **model outputs**, never forecasts, probabilities, or AI recommendations.
5. Scenario graphs and editable matrix remain familiar; expressive art direction must not obscure how to use the tool.
6. Touch targets, keyboard focus and the mobile drawer preserve practical accessibility.

## Quality checklist

- Calculations: `npm test` (seven math/safety cases)
- Browser: `python tests/browser_v4.py` (requires Playwright and Chromium at `/usr/bin/chromium`)
- Smallest checked viewport: 320 CSS px; no document-level horizontal overflow
- Must preserve existing `localStorage` keys to avoid deleting v2 decisions
- Font requests may fail offline; system fallback remains usable

## References

- Unbounded typeface project / OFL: https://github.com/w3f/unbounded
- IBM Plex typeface / licensing: https://www.ibm.com/design/language/typography/typeface/
- MDN reduced-motion guidance: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN accessible focus patterns: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible

All layout, illustrations, and styling in this project are written for ELSEWHERE rather than copied from a commercial template.

## v4.0 — English / Indonesia UX writing

A clear language switch was placed in the masthead, not hidden in settings. The two languages share the same page structure and model. "Criteria" is described as "what matters / hal penting", weights as "priority / tingkat kepentingan", and weighted results as a comparison **rather than probabilities**. Every text label required for navigation, form completion, and error recovery is authored locally rather than generated dynamically by AI. Source English content remains available and user-authored text never receives automatic translation.

## Supporting UX references

- https://www.gov.uk/service-manual/design/writing-for-user-interfaces
- https://www.nngroup.com/articles/ux-writing-faqs/
- https://www.w3.org/WAI/WCAG22/Techniques/html/H57
