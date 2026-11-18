# Little World

A pixel office by haammkaki with nine selectable coworkers and local work reports.

[Open the office](https://trustnopeps.github.io/trustNOpeps/apps/little-world/)

## Features

Nine named crew members share one state model, directory and canvas. Each can be selected and sent to a desk. Older three-person saves migrate while retaining progress. Office visits remain scripted simulations.

Work Orders defaults to instant structured briefs and checklists. Caption mode supplies editable starters, and budget mode calculates whole-rupiah line items. These modes do not use a language model. Reports can be read, downloaded as Markdown and restored after a reload.

Optional Local AI is experimental. It downloads a third-party language model and uses device memory and CPU. A 45-second inactivity watchdog and four-minute overall limit prevent indefinite loading; Stop terminates the worker. Existing reports remain downloadable if AI fails. Successful inference is device/network dependent and is not claimed by the deterministic tests.

The Sales Desk interface has been removed. Previously stored sales data is not erased. Its old source file remains for compatibility/history, but is not imported by the app.

## Run and verify

Serve the portfolio at its normal `/trustNOpeps/apps/little-world/` path, or open the deployed demo. This source is mirrored into the main portfolio and uses its relative project links.

```sh
node --test core.test.mjs
node --check app.mjs
node --check work.mjs
```

Tests cover all nine crew, save migration, pause, template outputs and budget validation. No external actions, sales or payments are performed.
