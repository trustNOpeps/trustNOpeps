# APPLY.OS — Career Intelligence

[Public app shell](https://apply-os-career.vercel.app/) · [AI Matching Lab](https://apply-os-career.vercel.app/matching/)

A browser-local application pipeline with filtering, structured records, manual verification, editable email drafts, JSON backup and CSV export. It never sends applications automatically. Optional multilingual Sentence-BERT embeddings use Transformers.js in the browser, with a separately labelled lexical baseline and manually supplied eligibility criteria. Model/runtime download requires network access; candidate records are not sent to a matching server by app logic.

Ranking weights are design choices, not validated probabilities. Employer verification and submission evidence are manual. No cloud synchronization, Gmail integration or automated application sending is claimed. Local storage is not encrypted; do not store identity documents or credentials. Private source and candidate data are intentionally excluded from the portfolio.

Vercel production metadata was READY on 27 November. Git-to-deployment synchronization is not established in repository documentation; runtime and model inference need separate validation.
