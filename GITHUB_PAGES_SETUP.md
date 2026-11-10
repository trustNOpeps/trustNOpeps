# Portfolio hosting — GitHub Pages

The portfolio is published from the [`gh-pages` branch](https://github.com/trustNOpeps/trustNOpeps/tree/gh-pages), separately from the development files in `main`.

**Portfolio:** https://trustnopeps.github.io/trustNOpeps/

## Current deployment

The Pages workflow completed successfully on 10 November 2026 for commit `08afa516662f11fd42ad84380ef7971752ea3026`.

[View successful GitHub Actions run](https://github.com/trustNOpeps/trustNOpeps/actions/runs/42748609246)

## How updates work

1. Develop and test changes in `main`.
2. Copy only the static site files to `gh-pages`.
3. Keep all application paths relative so they work under `/trustNOpeps/`.
4. Push `gh-pages`. GitHub's Pages deployment workflow handles publication.
5. Inspect the deployment run and test the portfolio and each demo URL.

Pages publishes `gh-pages` at `/(root)`. The branch contains a `.nojekyll` marker. The repository is public, and the site requires no paid hosting.

## Demos

- [Little World](https://trustnopeps.github.io/trustNOpeps/apps/little-world/)
- [Pixel Desk](https://trustnopeps.github.io/trustNOpeps/apps/pixel-desk/)
- [Tensile Desk](https://trustnopeps.github.io/trustNOpeps/apps/tensile-desk/)
- [Request Desk](https://trustnopeps.github.io/trustNOpeps/apps/request-desk/)

The independent source folders and anonymized case studies remain in `main`.

## Troubleshooting

If a page returns 404, inspect [Settings → Pages](https://github.com/trustNOpeps/trustNOpeps/settings/pages) and the [Actions history](https://github.com/trustNOpeps/trustNOpeps/actions). A completed deployment does not itself prove every client-side interaction works, so perform a browser smoke test after release.
