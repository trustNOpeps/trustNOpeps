# Optional GitHub Pages user-site redirect

The canonical live portfolio is https://trustnopeps.github.io/trustNOpeps/

The shorter address https://trustnopeps.github.io/ currently returns 404 because the user-site repository is not present. The authenticated GitHub connector can edit existing repositories but currently exposes no create-repository action. The cloud browser had no authenticated GitHub session and did not create a repository.

To make the shorter address work, the owner needs to:
1. Sign in to GitHub as `trustNOpeps`.
2. Create public repository named `trustNOpeps.github.io` from https://github.com/new (do not change the existing `trustNOpeps` portfolio repository).
3. Copy [this prepared index file](root-redirect.html) into that new repository as `index.html` at its root.
4. In that new repository's Settings → Pages select Deploy from branch, `main`, `/ (root)`. Wait for GitHub's Pages deployment to report success.
5. Visit https://trustnopeps.github.io/ and confirm it redirects to the canonical portfolio.

The redirect has an explicit fallback link, no JavaScript, no external assets, and a noindex directive to avoid duplicate SEO content.

Status: **not deployed**. The missing authenticated repo creation is the blocker; do not call the root address live until tested.
