# MechLabs — Engineering Workbench

**Status:** Public educational prototype · Built in Lovable · November 2026

**[Launch interactive demo](https://mechlabs-engineering.lovable.app/)** · [Back to portfolio](https://trustnopeps.github.io/trustNOpeps/)

## Why this exists

I study mechanical engineering and wanted a small workbench where a learner can see how tensile-test inputs turn into engineering stress, engineering strain, plots and reusable experiment notes. This complements my earlier Tensile Desk experiment without pretending to replace laboratory software.

## What you can explore

- **Workbench:** Enter force, original cross-sectional area, original gauge length and extension. The app calculates engineering stress and strain, accepts multiple points, plots the results and exports CSV.
- **Unit Lab:** Convert force, stress and length.
- **Material Compare:** Enter your *own* material property values and provenance. Nothing is silently presented as a verified handbook value.
- **Saved Runs:** Keep experiments in the current browser using local storage, with save, rename, delete and export.
- **About:** Formulas, traceability, limitations and independent educational-use boundaries.

## Governing relationships

Engineering stress: **σ = F / A₀**, where F is in N and A₀ in mm², giving N/mm² = MPa.

Engineering strain: **ε = ΔL / L₀**, dimensionless; percentage strain is 100ε.

The optional single-point slope **σ / ε** is a *secant estimate*, not a verified Young's modulus. It should only be interpreted carefully in an approximately linear-elastic region.

The built-in sample curve is expressly **synthetic**. Values are not measured specimens or standards-certified results.

## Design & build

Industrial-editorial UI using ink, bone, cyan and amber, IBM Plex typography, accessible controls and responsive layouts. The app was generated through an AI-assisted Lovable workflow under an explicit engineering brief. Core logic was written as deterministic functions and verified by [GitHub Actions run #42761158387](https://github.com/trustNOpeps/trustNOpeps/actions/runs/42761158387): dependency installation, `bun run test`, and `bun run build` all completed successfully on 10 November 2026.

**Repository status:** A [one-time source snapshot](../apps/mechlabs) of the Lovable application, including the engineering tests and dependency lockfile, has been mirrored into this repository. It is **not** a live two-way sync; edits made in Lovable later will require another update here. [GitHub Actions CI](https://github.com/trustNOpeps/trustNOpeps/actions/workflows/mechlabs-ci.yml) runs build/tests independently.

## Limits

Independent learning tool only; not affiliated with a laboratory or standards agency. Do not use for safety-critical design, certified material characterization or engineering sign-off. Local browser storage is not a backed-up cloud database.
