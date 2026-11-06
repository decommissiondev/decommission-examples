# DECOMMISSION examples

**Turn supported Make scenarios into software you own.**

Inspect a real generated TypeScript Cloudflare Worker, run its tests locally, then check your own blueprint in [DECOMMISSION Studio](https://studio.decommission.dev/?utm_source=github&utm_medium=repository&utm_campaign=examples#assessment).

[![Example tests](https://github.com/decommissiondev/decommission-examples/actions/workflows/test.yml/badge.svg)](https://github.com/decommissiondev/decommission-examples/actions/workflows/test.yml)

[Watch the guided walkthrough](https://decommission.dev/demo) · [Read the technical walkthrough](https://decommission.dev/make-to-cloudflare) · [Download the captioned video](https://github.com/decommissiondev/decommission-examples/releases/tag/v0.1.0)

## Try it in a few minutes

Requires Node.js 22+ and npm. No DECOMMISSION account, Cloudflare account or API credentials are needed for local tests.

```sh
git clone https://github.com/decommissiondev/decommission-examples.git
cd decommission-examples/examples/webhook-routing
npm ci
npm test
```

Tests use synthetic data and mocked HTTP. They do not contact a CRM, deploy a Worker, or incur Cloudflare charges. Installing npm dependencies requires internet access.

## Follow one complete example

| File | What you can inspect |
| --- | --- |
| [Blueprint](examples/webhook-routing/blueprint.json) | Webhook → HTTP lookup → filtered routes |
| [Generated Worker](examples/webhook-routing/worker.ts) | The actual compiler output, not a hand-written stand-in |
| [Replay fixtures](examples/webhook-routing/replay-cases.json) | Active and inactive lookup responses |
| [Signed replay report](examples/webhook-routing/replay-report.json) | Agreement with the restricted reference interpreter on these fixtures |
| [Example guide](examples/webhook-routing/README.md) | Behaviour, tests and provenance limits |
| [Deployment guide](examples/webhook-routing/DEPLOYMENT.md) | Optional deployment to your own account |

The HTTP address uses api.example.com, a placeholder. This is a runnable **mocked example**, not a live CRM integration. Review destinations, secrets and real API behaviour before deploying an adapted scenario.

## Try your own scenario

1. Read the [compatibility guide](docs/compatibility.md).
2. Remove credentials and personal or confidential data from your Make blueprint.
3. Open [Studio](https://studio.decommission.dev/?utm_source=github&utm_medium=repository&utm_campaign=examples#assessment), consent to private assessment and upload the blueprint. Compatibility assessment is free.
4. For supported scenarios, supply representative replay fixtures and review the results before purchase and independent live testing.

Custom source delivery costs **$199 for one scenario** or **$499 for six scenarios submitted over time**. Only a successful delivery uses a bundle place. Repeat downloads and executions do not use places. There is no DECOMMISSION runtime subscription or execution charge; your hosting, third-party APIs and maintenance may cost money.

Studio currently requires a customer-supplied 3:1 first-year net-benefit check against the $199 per-scenario reference price before compilation, including bundle scenarios. This is not a savings guarantee.

## What this proves—and its limits

The compiler is deterministic and does not use AI to generate code. The example demonstrates a defined supported subset and reproducible local behaviour. Replay uses simulated external services; it does **not** establish Make production equivalence, latency improvements or guaranteed savings. Source output and tests are inspectable; unsupported semantics are rejected.

This repository contains public example output and documentation. The commercial compiler and hosted Studio source are private. The MIT licence applies to this repository, not to the private compiler or your Studio purchase terms.

## Feedback

Use [Issues](https://github.com/decommissiondev/decommission-examples/issues) for reproducible example problems and [Discussions](https://github.com/decommissiondev/decommission-examples/discussions) for questions. Never post client blueprints, credentials or personal data publicly. See [SECURITY.md](SECURITY.md) for private security reports.

[Website](https://decommission.dev/?utm_source=github&utm_medium=repository&utm_campaign=examples) · [Studio](https://studio.decommission.dev/?utm_source=github&utm_medium=repository&utm_campaign=examples#assessment) · [Compatibility](docs/compatibility.md)

Independent software; not affiliated with or endorsed by Make or Cloudflare.
