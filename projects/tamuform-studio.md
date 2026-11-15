# Tamuform Studio
Hospitality website and inquiry CRM pilot by **haammkaki**.

[Public case study](https://trustnopeps.github.io/trustNOpeps/tamuform/) · [Website preview](https://trustnopeps.github.io/trustNOpeps/tamuform/previews/landing-en.html) · [Fictional CRM walkthrough](https://trustnopeps.github.io/trustNOpeps/tamuform/previews/workspace.html)

## Product hypothesis
Independent hospitality businesses need a clear path from public service information to an inquiry, internal review and follow-up. Tamuform explores that workflow through a bilingual website and a private prospect workspace. Customer adoption, revenue and conversion impact have yet to be measured.

## Contribution
Product direction, hospitality workflow definition, visual direction, AI-assisted implementation and iterative review. This is an independent project.

## Implemented scope
The reviewed application uses Python/FastAPI, Jinja templates and CSS/JavaScript. SQLite supports local development; PostgreSQL is configured for cloud persistence.

Source includes an inquiry form with consent capture, validated inputs, authenticated administration with TOTP MFA, stage filters, internal notes, follow-up dates and protected CSV export. Stages are new, contacted, qualified, proposal, won and lost.

## Public experience
The English and Indonesian website previews are rendered from the product templates. The public inquiry submission is replaced with an explanation of the captured information and a link to the example workspace.

The workspace uses two explicitly fictional records and example.com addresses. Search, stage filtering, editing and CSV export run in the current tab. Reloading resets the examples. Backend code, authentication configuration and real inquiry records are kept private.

## Verification and status
Source review on 15 November 2026 covered the current private README, FastAPI route implementation and public/workspace templates. The repository still documents production deployment as unverified. Live cloud login, persistent inquiries after restart and end-to-end production behavior remain to be validated.

Public preview behavior is independent of the production backend. This case study does not claim a running production service, a completed booking/payment system, measured customer results or a multi-tenant SaaS.
