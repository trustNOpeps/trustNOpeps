# ELSEWHERE — Decision Studio

**Live:** https://elsewhere-decision-studio.vercel.app/

**Source:** [apps/elsewhere](../apps/elsewhere/)

## Product brief

ELSEWHERE is a lightweight, browser-based workspace for exploring personal decisions. Users define options, criteria, relative priority weights, and subjective ratings to compare trade-offs. No account, AI predictions, or external database is required.

## What was built

- A responsive editorial interface with a guided three-step introduction and accessible mobile score inputs.
- A local decision library that retains up to 30 decisions and attempts to migrate previous v1 browser data.
- A deterministic weighted-fit scoring engine, sensitivity experiments, and explicit handling of tied outcomes.
- A private decision journal and JSON import/export.
- Browser-based UI smoke checks and pure logic unit tests.

## Design direction

Warm ivory backgrounds, deep forest navigation, sage accents, high-contrast copy and serif display type. The page distinguishes sample ratings from user data and keeps advanced sensitivity tools separate from basic comparison.

## Trade-offs and limitations

Scores and weights are subjective, not predictive probabilities. Data stays in localStorage and does not sync across devices; export important decisions for backup. Stress tests vary weights rather than actual real-world conditions. Avoid using it as professional advice in high-stakes matters.

## Implementation

HTML, CSS, JavaScript ES modules, Node.js standard-library testing and Playwright browser checks. The source is static and has no npm runtime dependencies. Built and deployed with Vercel.
