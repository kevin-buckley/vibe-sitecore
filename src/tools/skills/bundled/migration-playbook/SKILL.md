---
name: migration-playbook
displayName: Migration Playbook
description: "Use when planning or coordinating an XP to XM Cloud migration that spans site structure, templates, components, content, and code. Trigger phrases: migration playbook, XP to XMC migration, migration overview, migration strategy, migration plan."
category: migration
tags: [migration, playbook, overview, planning, sitecore, xm-cloud]
triggers: [migration playbook, xp to xmc migration, xp to xm cloud migration, migration overview, migration plan, migration strategy]
---

# Migration Playbook

Use this skill first when the task spans multiple migration areas or when you need an overall XP to XM Cloud migration plan.

## Environment Mapping

- XP source environment: `sitecore-lighthouse-xp` -> `https://cm.lighthouse.localhost/`
- XM Cloud target environment: `sitecore-xmcloud-cm-local` -> `https://xmcloudcm.localhost/`
- XP source project: `Sitecore.Demo.Platform`
- XM Cloud target/reference project: `xmc-local`

## Out-of-Scope XP Features

These XP platform features have no direct XM Cloud equivalent and must be evaluated separately:
- **Content Hub (DAM)**: XP references Sitecore Content Hub assets. XM Cloud has a separate Content Hub connector — do not assume assets migrate automatically.
- **xConnect / Personalization**: xConnect behavioral data and rule-based personalization do not exist in XM Cloud. Evaluate Sitecore CDP or drop.
- **Sitecore Forms**: No direct equivalent. Evaluate XM Cloud Forms, third-party form providers, or rebuild.
- **Marketing Automation**: Campaigns, goals, and engagement plans have no XM Cloud equivalent. Evaluate Sitecore Send or drop.
- **Federated Authentication**: Facebook/Microsoft auth in XP is replaced by Okta/identity provider config in XM Cloud.

## xmc-local Repo Layout & Two-Root Deploy Split

The `xmc-local` target repo splits Sitecore serialization across two CLI roots to match how XM Cloud deploys each item kind:

- **`sitecore.json` (repo root)** — reads modules from `authoring/items/**/*.module.json`. Owns templates, renderings, page designs, partial designs, and SPE scripts. These ship to XM Cloud as **Items-as-Resources via the build** (IAR-via-deploy). Do not `ser push` these — the build handles deployment.
- **`content-push/sitecore.json`** — reads modules from `../content/**/*.module.json`. Owns content items and media. Pushed manually via `dotnet sitecore ser push` run from the `content-push/` directory.

Per-site module naming used by the existing migrations (Lighthouse, Round Rock Sasquatch):

- `<site>.module.json` — site authoring (templates, renderings, page designs)
- `<site>-global.module.json` — global / shared authoring
- `<site>-spe.module.json` — SPE scripts
- `<site>-content.module.json` — site content + media
- `<site>-global-content.module.json` — shared content + media

Rendering hosts live under `examples/<site-name>/` (one Next.js app per site). Per-site migration plans and audits live at repo root as `PLAN-<site>.md` and `AUDIT-<site>.md`.

## Non-Negotiable Rules

1. Rebuild, do not clone.
2. Do not copy Sitecore XP items, packages, serialized trees, or GUIDs straight into XM Cloud.
3. Migrate business behavior and editor outcomes, not SXA or MVC implementation details.
4. Separate authoring structure, rendering host code, integration code, and migration-only utilities.
5. Prefer small verified increments over one-shot migration attempts.

## Standard Workflow

1. Inspect the current XP implementation with `sitecore-lighthouse-xp`.
2. Identify what the feature does for editors, visitors, and downstream integrations.
3. Classify the work into site structure, templates, components, content, and code.
4. Define the XM Cloud target model in authoring terms before writing rendering code.
5. Rebuild the rendering host behavior against the new model using Content SDK patterns.
6. Migrate or recreate content only after the target model is stable.
7. Validate URLs, editing workflows, component behavior, integrations, and acceptance criteria.
8. Verify visual parity against the XP reference for every rebuilt page and component. Fetch the XP page HTML or screenshot via `sitecore-lighthouse-xp` and compare to the XMC rendering host output. Styling drift (button shape, eyebrow labels, card-over-image overlap, nav dropdown geometry) will not surface in type checks or test suites — a side-by-side visual compare is the only reliable check.

## Which Focused Skill To Use Next

- `site-migration` for site definition, IA, navigation, and route architecture.
- `template-migration` for content model and field mapping.
- `component-migration` for renderings, variants, and datasource-driven UI.
- `content-migration` for pages, datasource items, media, taxonomy, and cleanup rules.
- `code-migration` for MVC code, pipelines, integrations, scripts, and front-end behavior.
- `page-design-setup` for Page Designs, Partial Designs, TemplatesMapping binding, and headless placeholder wiring.

## What To Capture

- source items, templates, renderings, and code locations
- target XM Cloud design decisions and accepted deviations
- old-to-new mappings for fields, routes, components, and data flows
- blockers, redesign decisions, and parity criteria

## Exit Criteria

The migration is ready to move forward when the target structure, mappings, and acceptance criteria are explicit enough that implementation can proceed without guessing.
