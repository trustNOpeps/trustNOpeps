# GitHub Pages activation (one-time)

The static portfolio and all three demos are ready in the [gh-pages branch](https://github.com/trustNOpeps/trustNOpeps/tree/gh-pages). No build, payments, secrets, or third-party services are needed.

1. Sign in as **trustNOpeps** and open [Repository Settings → Pages](https://github.com/trustNOpeps/trustNOpeps/settings/pages).
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **gh-pages** and folder **/(root)**, then click **Save**.
4. Wait for the Pages deployment workflow to complete. The intended site URL is **https://trustnopeps.github.io/trustNOpeps/**.
5. Check all three demo links from the home page. If a 404 remains, inspect Settings → Pages and Actions for deployment status.

## Why this cannot be activated automatically in this session

The connected GitHub integration supports source-file operations but does not expose the Pages configuration mutation. GitHub Pages source selection is an account-level repository setting requiring owner access. No personal access tokens should be shared or pasted into source code.

## Source layout

- `gh-pages/index.html` — portfolio landing page
- `gh-pages/apps/pixel-desk/` — retro creative playground
- `gh-pages/apps/tensile-desk/` — engineering calculator
- `gh-pages/apps/request-desk/` — procurement builder

Only static HTML, CSS and JavaScript are used. A `.nojekyll` marker is included. Project notes in `main/projects/` intentionally anonymize client identities.
