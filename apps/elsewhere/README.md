# ELSEWHERE / Decision Atlas 4.0

**One choice. Many roads.** A thoughtful, local-first decision studio for comparing different paths, understanding tradeoffs, and challenging your own assumptions.

ELSEWHERE is not an AI oracle. It doesn't pretend to know your future. Instead, you provide the options, criteria, ratings and relative priorities, and it makes the math and sensitivity visible.

## What it does

- **Beginner-friendly onboarding:** A three-step guide, hands-on 0–10 score explanation, plain-language priority definitions, illustrative examples clearly marked, and quick access to saved work.
- **Bilingual UI:** English and Bahasa Indonesia, visible EN/ID switcher on desktop and mobile, locale preference stored separately from decisions. Every major view, dialog, help text, status, and sample content is localized.
- **Decision overview:** An editorial route atlas with your options, relative fit scores, leading score gap, and current priorities.
- **Easy mobile scoring:** Rate one option at a time using accessible sliders, while desktop offers a full comparison matrix.
- **Editable comparison matrix:** Create, rename and remove options and criteria; assign ratings from 0–10; adjust importance weights; inspect how the ranking changes.
- **Scenario lab:** Experiment with alternate priority weights using sliders and presets; compare baseline and adjusted rankings; save up to 15 local perspectives.
- **Assumption stress test:** Explore 121 deterministic variations in the weights within a chosen ±0–50% range. These are *hypothetical model variations*, **not success probabilities**.
- **Decision journal:** Record personal context, unanswered questions, and what could change your mind.
- **Multiple saved decisions:** Create, switch between, and remove up to 30 private decisions in the device library. Migrates existing v1 local decision without intentionally replacing it.
- **Local-first:** Saves in browser localStorage. No sign-up, backend, analytics, tracking, or secret keys.
- **Portable data:** JSON export/import, plus a printable journal summary.
- **Four starting examples:** Weekend plans, career paths, laptop choices, and living arrangements. All sample ratings are illustrative.

## Quick start

Requires Node.js 20+ only. There are **no npm dependencies**.

```bash
npm run dev
```

Open `http://localhost:3000`. To run the math tests:

```bash
npm test
npm run check
```

Or serve the folder using any static HTTP server. Deploy the repository to Vercel as an **Other** static project with the repository root as the root directory. `index.html` is the entrypoint.

## Technical overview

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic app layout, interactive views, modal and accessibility labels |
| `styles.css` + `atlas.css` + `locale.css` | Base layout, editorial direction, accessible language switch, responsive layout, reduced-motion and print rules |
| `app.js` | DOM rendering, UI events, validation, local-first persistence, import/export |
| `i18n.js` | English/Indonesian UI language resources, safe sample display, locale persistence, and HTML language metadata |
| `core.js` | Pure scoring, scenario comparison, deterministic weight sensitivity, import validation |
| `tests/core.test.js` + `tests/i18n.test.js` | Node tests for scoring, sanitization, ties, and language selection |
| `tests/browser_v4.py` | Offline Playwright bilingual regression checks at 1440, 390 and 320 CSS px |
| `server.mjs` | Tiny dependency-free local preview server |
| `vercel.json` | Static deployment headers |

This app is intentionally small and **does not require Next.js, a database, React, or an AI API**. That makes it fast to inspect, deploy, and keep private. The architecture can be migrated to React or Next.js if user accounts, collaborative decisions or backend integrations are justified later.

### Calculation

All criteria are modeled as **benefits**: `0` is least desirable and `10` is most desirable. For a cost criterion, a more affordable option should receive a *higher* desirability rating.

For each option:

`Weighted fit (0–100) = 10 × [Σ (rating_i × weight_i)] / [Σ weight_i]`

Weights are non-negative values from 0 to 100 and are interpreted **relative to each other**; they do not need to sum to 100. If all are zero, equal emphasis is used as a graceful fallback. Tied scores are displayed as tied in the UI. The stable original order is retained only for deterministic sorting. In the sensitivity test, tied outcomes are counted separately instead of being credited to the first option.

### Sensitivity test

To show how sensitive the leading option is to assumptions, ELSEWHERE recomputes the ranking under 121 *deterministic* perturbations of the current weights. The multiplier for each criterion stays within the user-selected percentage variation. It counts how often each option ranks first under those synthetic inputs. This is neither a statistical confidence interval nor a calibrated probability of any real-world outcome.

### Data and privacy

Decision content is never transmitted by app JavaScript. `localStorage` can be cleared by private browsing, browser cleanup, or a change of device, so **export important decisions**. Imports are size-limited in the UI and sanitized/normalized through `importDecision` (maximum 12 criteria, 12 options and 15 snapshots).

## Visual direction: Decision Atlas (v4)

This release deliberately avoids generic SaaS dashboard conventions. The visual metaphor is a **printed decision field guide + route map**, not an AI prediction product.

- **Typography**: Unbounded for identity and editorial headlines; IBM Plex Sans for readable forms/content; IBM Plex Mono for route codes, labels, score metadata. Fallbacks are supplied. Fonts load from Google Fonts; decision contents are not sent with font requests.
- **Palette**: near-black `#191C1C`, paper `#F2F0E9`, signal lime `#ECF96E`, route vermilion `#EC5335`, secondary route blue `#4856DB`.
- **Structure**: persistent horizontal chapter navigation, oversized asymmetric dark poster hero, meaningful score-driven route diagram, hard grid rules, sparse rectangles, and notes that behave like a paper journal.
- **Interaction**: direct actions, native form controls, accessible keyboard focus, no essential animation, reduced-motion support, and a small-screen drawer containing data tools.
- **No illustrative performance claims**: displayed sample scores remain explicitly marked as illustrative, not success probabilities.

See [`DESIGN_NOTES.md`](DESIGN_NOTES.md) for rationale and references.

## Language and data behavior

- Select **EN** or **ID** in the header or mobile drawer. The initial preference follows the browser language (Indonesian browsers default to ID); after selection it is saved under `elsewhere.locale.v1`.
- Switching languages changes **interface text and untouched sample display**, not the content the user wrote. Previously saved data stays in `elsewhere.library.v2` with the original schema; no migration is required for personal decisions.
- The `lang` attribute on `<html>`, browser tab title, help labels, placeholders, and dialog text are updated for the chosen language, supporting screen readers. English text is restored when returning to EN.
- Sample text is presented in the selected language only while the original sample values remain available in the stored decision. New blank workspaces use starting labels in the selected language at creation. The app does **not** translate user-entered notes or decisions automatically.
- The model score is an arithmetic comparison of self-reported values, never a probability or forecast.

## Current limitations

- A local library of up to 30 saved decisions is supported. It is limited to one browser profile and is not automatically synchronized across devices.
- Scores and weights are subjectively supplied, not objectively measured or independently verified.
- Sensitivity explores **only criterion weights**, not uncertain input ratings or real-world causal effects.
- Equal intervals between 0–10 ratings are assumed for calculation; that might be inappropriate for some decisions.
- Not intended to replace medical, legal, financial, or safety-critical professional advice.
- No realtime collaboration or cross-device sync.
- The layout requests Google Fonts when online, with system fallbacks. It does not send decision contents to Google Fonts.

## A good next iteration

1. Support uncertainty ranges for option ratings with opt-in interval sensitivity.
2. Search and tag saved local decisions, with optional full-library backup/restore.
3. Accessible interactive branching diagram with React Flow (only if real user workflows benefit).
4. Automated CI checks for browser behavior and accessibility using a headless browser.
5. Optional private sync for people who need cross-device continuity.


## Attribution and sources

The clearer microcopy and language design follow:

- [GOV.UK — Writing for user interfaces](https://www.gov.uk/service-manual/design/writing-for-user-interfaces) (plain language and reduced cognitive load)
- [Nielsen Norman Group — UX Writing FAQs](https://www.nngroup.com/articles/ux-writing-faqs/) (clear labels for mixed audiences)
- [W3C WAI — Language of page](https://www.w3.org/WAI/WCAG22/Techniques/html/H57) (correct HTML `lang` metadata)
- [Microsoft Globalization — Software internationalization](https://learn.microsoft.com/en-us/globalization/methodology/software-internationalization) (separation of text resources from application state)

Implementation uses native browser APIs and Node.js standard libraries. Documentation and optional future exploration: [Next.js](https://nextjs.org/docs/app), [React Flow](https://reactflow.dev/), [Vercel Git deployment](https://vercel.com/docs/git). These are references, not dependencies of this release.

## License

MIT. See `LICENSE`.
