# Portfolio consolidation — 27 November 2026

## Approved visual direction
Retain the seven original cinematic chapters, Three.js scene code, Space Grotesk / DM Sans, existing dark styling and per-product visual identities. New engineering and digital entries use the existing system-study component. Do not claim new browser testing until it actually runs.

## Source of truth
- Profile README, case studies and project registry: main.
- Homepage and site runtime: gh-pages. For FABFRAME and ELSEWHERE, main/apps is the canonical source. ELSEWHERE has a static GitHub Pages mirror; the old Vercel URL has not been removed. Export local JSON before moving between origins.
- MachineScope: standalone repository dist, mirrored into gh-pages/apps/machinescope.
- Little World, Pixel Desk, Request Desk, Tensile Desk: standalone repositories and main/apps mirrors. Published HTML may intentionally differ in back-navigation and asset references; verify runtime and mobile changes before syncing.
- BOURN: its standalone repo and existing publish workflow.
- APPLY.OS and ARAH: private source; no source or personal/customer data published.
- No new domain or hosting account created.

## Quality gate
Run FABFRAME regression tests and the portfolio static checker. Separate browser acceptance checks should cover 320, 390, 768 and 1440 px, navigation, scroll boundaries, mobile touch targets, exports and external public URLs. Verify actual Actions run and deployed SHA; a commit alone is not deployment evidence.

## Release limitations
Do not characterize engineering calculations as certified. MachineScope has no validated real-machine dataset; FABFRAME GUI export dialog and downstream commercial CAD imports remain unverified. APPLY.OS uses manual eligibility screening, has no Git-linked Vercel deployment in the documented setup, and needs model quality evaluation. Tamuform live authentication, ARAH email/attachments and final handover remain open. BOURN auth/RLS needs live verification. Repository licenses remain unchanged; public availability is not an open-source grant. Select licenses explicitly before wider redistribution. No secrets, live submissions or private data included in this work.
