---
name: content-migration
displayName: Content Migration
description: "Use when migrating Sitecore XP content items, datasource items, media, taxonomy, or page content into XM Cloud. Trigger phrases: migrate content, content migration, move content, migrate items, media migration, datasource content migration."
category: migration
tags: [migration, content, media, taxonomy, pages, sitecore, xm-cloud]
triggers: [migrate content, content migration, move content, migrate items, media migration, datasource content migration]
---

# Content Migration

Use this skill when the task is about moving authored content from XP into the rebuilt XM Cloud model.

## Non-Negotiable Rules

1. Do not copy raw XP items and GUIDs into XM Cloud and call that a migration.
2. Migrate content only after the target site, templates, and components are defined.
3. Move business content into the new model deliberately, even if part of the work is scripted.

## Primary Goal

Move the right content into the right rebuilt XM Cloud structure while preserving meaning, editorial intent, and necessary URL continuity.

## Recommended Workflow

1. Use `sitecore-lighthouse-xp` to inspect content trees, datasource items, page composition, media usage, and taxonomy.
2. Decide what content is worth migrating versus rewriting, archiving, or dropping.
3. Map source content types to the new XM Cloud templates before importing anything.
4. Recreate or import content into the new structure against the rebuilt templates. New IDs are fine; what matters is that mapped fields land on the right templates and link/media references resolve.
5. Commit the content as serialized YAML under `content/` (organized by `<site>-content.module.json` / `<site>-global-content.module.json`) and push it with `dotnet sitecore ser push` run from `content-push/`.
6. Revalidate links, media references, language versions, workflow expectations, and metadata.
7. Test pages in the rendering host after content is migrated.

## Special Attention Areas

- internal links and media links
- redirects for changed URLs
- taxonomy and tagging
- language versions
- publishing and workflow expectations
- page-level versus datasource-level ownership

## Datasource Organization

Place datasource items according to sharing scope, not rendering type:

- **Shared / global datasources** (site-wide CTAs, footer links, nav items, anything edited once and surfaced on many pages): `/sitecore/content/<site>/Data/Shared/`. Bound to renderings on shared Partial Designs so a single edit updates every page that uses the design.
- **Per-page local datasources** (page title, page body text, per-page hero image or feature promo): `<page-item>/Data/`. Bound to that page's Final Renderings. Editors work on them in the context of the page they belong to.

Use shared datasources for anything that must stay in sync across pages. Use local datasources for anything conceptually owned by one page. Mixing these up — for example, placing a nominally shared CTA under a single page's `./Data/` folder — leads to drift where other pages silently lose the CTA or render stale content.

## Serialization Workflow (Two-Root Split)

`xmc-local` uses two Sitecore CLI roots, one per item kind. Content lives on the second root:

- **Authoring root** (`sitecore.json` at repo root) — modules under `authoring/items/**`. Templates, renderings, page designs, partial designs, SPE scripts. These ship via **Items-as-Resources in the build (IAR-via-deploy)** — do NOT `ser push` from this root.
- **Content root** (`content-push/sitecore.json`) — modules under `content/**` (referenced as `../content/**` from `content-push/`). Site content + media. Push these explicitly:

```
cd content-push
dotnet sitecore ser push -i "<site>-content"
dotnet sitecore ser push -i "<site>-global-content"
```

After creating or editing items in XM Cloud CM via MCP tooling or the authoring UI, pull the serialized YAML for source control. Use the matching root for the item kind:

```
# For templates/renderings/designs (authoring root)
dotnet sitecore ser pull -i "<site>"

# For content + media (content root)
cd content-push
dotnet sitecore ser pull -i "<site>-content"
```

Rules of thumb:
- Do not hand-author YAML stubs for new items. Create via MCP (`run-powershell-script`, authoring GraphQL) or the authoring UI, then pull.
- `dotnet sitecore ser push` from the **content root** is the standard path for moving authored content into XMC. From the **authoring root**, push is reserved for restoring already-serialized items from source control — not for creating new authoring items.
- Run `ser pull` immediately after a content change so the committed YAML stays in lockstep with CM state. Drift between CM and serialized YAML is painful to untangle.
- Module IDs follow `<site>-content` / `<site>-global-content` for content modules. See `migration-playbook` for the full naming convention.

## Out-of-Scope Content

These XP content types do not migrate directly to XM Cloud:
- **Content Hub assets**: If the XP solution references Sitecore Content Hub (DAM) assets, XM Cloud uses a separate Content Hub connector. Do not assume asset URLs or GUIDs carry over — verify connector availability or plan a re-upload to XM Cloud Media Library.
- **xConnect contact and interaction data**: Behavioral and personalization data stored in xConnect has no XM Cloud equivalent. This data does not migrate.
- **Marketing automation items**: Campaign definitions, engagement plans, goals, and segments from XP have no XM Cloud equivalent — evaluate Sitecore Send, CDP, or drop.
- **Form data and submissions**: Sitecore Forms submission data is not migrated. Evaluate a replacement form solution before migrating form page content.
