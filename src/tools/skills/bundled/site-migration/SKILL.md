---
name: site-migration
displayName: Site Migration
description: "Use when migrating a Sitecore XP site, SXA site setup, tenant or site structure, site settings, page architecture, or information architecture into Sitecore XM Cloud with Sitecore Content SDK. Trigger phrases: migrate site, site migration, SXA site migration, site structure migration, site settings migration, IA migration."
category: migration
tags: [migration, site, sxa, sitecore, xm-cloud, navigation, ia]
triggers: [migrate site, site migration, sxa site migration, site structure migration, site settings migration, ia migration]
---

# Site Migration

Use this skill when the task is about moving site-level structure from XP into XM Cloud.

## Non-Negotiable Rules

1. Rebuild the site structure in XM Cloud. Do not copy XP site items or GUIDs into the target instance.
2. Do not force one-to-one parity with SXA if XM Cloud and Content SDK support a cleaner approach.
3. Preserve business behavior, URL intent, and editor outcomes. Do not preserve legacy implementation debt without a reason.

## Primary Goal

Define how an XP site should exist in XM Cloud across authoring structure, site configuration, page architecture, navigation, and rendering host responsibilities.

## Recommended Workflow

1. Use `sitecore-lighthouse-xp` to inspect the XP site definition, site settings, SXA assets, and page structure.
2. Record the business purpose of the site before looking at technical details.
3. Inventory the important site-level elements: site root, navigation model, page types, site settings, dictionary usage, localization, metadata, redirects, and media dependencies.
4. Identify which XP concepts are SXA-specific and should not be copied directly.
5. Design the XM Cloud target structure in terms of authoring items plus Content SDK route rendering.
6. Rebuild the site manually in the XM Cloud authoring model.
7. Validate URL structure, navigation, editing flow, and page composition.

## XP to XMC Guidance

- Treat SXA site setup as a source for requirements, not as a deployment artifact.
- Recreate site collections, sites, settings, and route structure intentionally in XM Cloud.
- Keep the page tree and editor experience understandable for authors.
- Move presentation responsibility into the Content SDK rendering host instead of preserving MVC or SXA rendering mechanics.
- Dictionary items in XP SXA map to XM Cloud dictionary domain items — rebuild them in the target site's authoring tree.
- SXA Creative Exchange and theme assets do not migrate; styling is owned by the rendering host.
- Route shared chrome (header, footer, site-wide CTAs) through **Page Designs + Partial Designs** targeting the headless placeholders (`headless-header`, `headless-main`, `headless-footer`). Do not place shared renderings on each page's own Final Renderings. See the `page-design-setup` skill for TemplatesMapping encoding, position rules (`p:before` / `p:after`), and the sub-page architecture pattern.
