# ELSEWHERE — Decision Atlas

**Live:** https://elsewhere-decision-studio.vercel.app/  
**Source:** [apps/elsewhere](../apps/elsewhere/)

## What it is

A lightweight, local-first decision atlas that helps people compare subjective options, visualize tradeoffs and test sensitivity to their own assumptions. It neither predicts outcomes nor claims that the highest weighted score is objectively best.

## The v3 design

The former forest-green SaaS dashboard was replaced by a **graphic-publication interface** with a deliberate wayfinding metaphor, not a generic template. A black editorial poster introduces the product, while a score-driven route diagram illustrates up to three paths from the actual current decision. Persistent top-level chapter navigation makes Overview, Compare, What if and Notes equally accessible. Mobile users receive a focused vertical route drawing and a drawer with import/export actions.

The typography system uses **Unbounded** for display and identity, **IBM Plex Sans** for interface clarity, and **IBM Plex Mono** for labels and numeric information. The palette is near-black, warm paper, high-visibility lime, route vermilion and secondary blue. Squared rules and deliberately varied type scale replace rounded cards, gradients and faux-AI visual effects.

## Functionality and limits

- Compare options and weighted criteria, with transparent 0–100 model scores
- Adjust priorities in the scenario lab, including deterministic 121-case weight experiments
- Keep up to 30 decisions and 15 saved scenarios in local browser storage
- Save private reflections in the Decision Journal and export/import JSON
- Mark example data clearly; ties do not imply a false leader
- No backend, account, analytics, AI prediction, or cross-device synchronization
- Browser data can be deleted by clearing local storage; users should export backups

## Validation

Seven Node unit tests passed. Playwright smoke checks of the redesign passed on 1440, 390 and 320 CSS-pixel wide Chromium viewports: create/edit options and criteria, scenario controls, journal writing, archive navigation, no page errors, and no horizontal overflow. Browser test coverage is not a guarantee of all devices and assistive technology compatibility.

## Implementation

Dependency-free static HTML, CSS and JavaScript ES modules deployed to Vercel. The project is stored in the existing GitHub portfolio repository under `apps/elsewhere/` to avoid redundant repositories. Read the local [design notes](../apps/elsewhere/DESIGN_NOTES.md) for the typographic rationale, palette and references.
