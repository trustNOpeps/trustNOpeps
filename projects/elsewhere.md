# ELSEWHERE — Decision Atlas

**GitHub Pages mirror:** https://trustnopeps.github.io/trustNOpeps/apps/elsewhere/  
**Earlier Vercel URL (availability unverified):** https://elsewhere-decision-studio.vercel.app/  
**Source:** [apps/elsewhere](../apps/elsewhere/)

## What it is

A lightweight, local-first decision atlas that helps people compare subjective options, visualize tradeoffs and test sensitivity to their own assumptions. It neither predicts outcomes nor claims that the highest weighted score is objectively best.

## The v4 experience and bilingual redesign

The former forest-green SaaS dashboard was replaced by a **graphic-publication interface** with a deliberate wayfinding metaphor, not a generic template. A black editorial poster introduces the product, while a score-driven route diagram illustrates up to three paths from the actual current decision. Persistent top-level chapter navigation makes Overview, Compare, What if and Notes equally accessible. Mobile users receive a focused vertical route drawing and a drawer with import/export actions.

The typography system uses **Unbounded** for display and identity, **IBM Plex Sans** for interface clarity, and **IBM Plex Mono** for labels and numeric information. The palette is near-black, warm paper, high-visibility lime, route vermilion and secondary blue. Squared rules and deliberately varied type scale replace rounded cards, gradients and faux-AI visual effects.

## v4: Clearer language and guided scoring

The interface now supports **English and Bahasa Indonesia** with a visible EN/ID switch on desktop and mobile. Localization covers navigation, scoring hints, example decisions, settings, dialogues, status messages, and key accessible labels. The selected language is stored independently of user decisions, so people can switch without rewriting their own questions or notes.

A plain-language score guide explains three different concepts: a **0–10 rating** (how well an option meets one need), a **0–100 priority** (how much that need matters relative to others), and a **0–100 result** (a weighted comparison, **not** a success probability). On mobile, each option is scored separately with familiar sliders.

The copy was guided by [GOV.UK's UI writing guidance](https://www.gov.uk/service-manual/design/writing-for-user-interfaces), [NN/g UX writing principles](https://www.nngroup.com/articles/ux-writing-faqs/), and [W3C's HTML language guidance](https://www.w3.org/WAI/WCAG22/Techniques/html/H57). No AI is required at runtime.

## Functionality and limits

- Compare options and weighted criteria, with transparent 0–100 model scores
- Adjust priorities in the scenario lab, including deterministic 121-case weight experiments
- Keep up to 30 decisions and 15 saved scenarios in local browser storage
- Save private reflections in the Decision Journal and export/import JSON
- Mark example data clearly; ties do not imply a false leader
- No backend, account, analytics, AI prediction, or cross-device synchronization
- Browser data can be deleted by clearing local storage; users should export backups

## Validation

Nine Node unit tests passed. Playwright bilingual smoke checks passed on 1440, 390 and 320 CSS-pixel wide Chromium viewports: language switching, local storage preservation, creating decisions, journaling, no page errors, and no horizontal overflow. Browser test coverage is not a guarantee of all devices and assistive technology compatibility.

## Implementation

Dependency-free static HTML, CSS and JavaScript ES modules. A GitHub Pages mirror uses the same static runtime; the earlier Vercel deployment is retained but its availability is unverified. Browser storage is origin-specific; export JSON from an accessible old origin before importing on a new one. The project is stored in the existing GitHub portfolio repository under `apps/elsewhere/` to avoid redundant repositories. Read the local [design notes](../apps/elsewhere/DESIGN_NOTES.md) for the typographic rationale, palette and references.

## Version

**4.0.0** — bilingual interface, beginner score guide, clear explanations, and retained Decision Atlas art direction.
