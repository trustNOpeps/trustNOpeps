# Little World — The Creative Internet Café

An original, pixel-inspired isometric portfolio office built by **trustNOpeps** as a frontend learning experiment.

## What works

- Isometric office rendered entirely with Canvas 2D; no downloaded sprites or borrowed game assets.
- Four clickable project desks linking to existing portfolio apps and anonymous studies.
- Three simulated coworkers with time-based routines, selectable roles and user-assigned tasks.
- Local fictional coin rewards, clock speed controls, activity feed, save/download and reset.
- Responsive UI, keyboard-accessible project links, and no account, API key, or backend requirement.

## Run

Open `index.html` through a local static server. Because it uses JavaScript ES modules, opening through `file://` may be blocked by browser security policies.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/apps/little-world/` if running from the repository root (or the appropriate local path).

Run pure logic tests with `node --test apps/little-world/core.test.mjs` from the repository root.

## Honesty about the agents

The coworkers are **scripted simulations**, not OpenClaw, Hermes, or autonomous AI models. Their tasks are small deterministic state transitions. They cannot access real files, web browsers, accounts, money, or third-party services. Fictional coins have no real-world value. Real agent integrations would require a backend, authorization, permissions, secrets management and explicit user approval.

## Privacy & persistence

Local progress is stored under a browser `localStorage` key. The export button downloads a JSON snapshot; reset only affects this application's local state. No analytics or network API calls are made by the app, although the external font service and linked demos are separate destinations.

## Project context

This project takes broad inspiration from cozy isometric offices and virtual agent workspaces, but its code, layout, copy and Canvas artwork are original. It does not reproduce My Virtual World's source code, proprietary assets, branding, or licensed features.
