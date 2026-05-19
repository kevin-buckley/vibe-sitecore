---
name: template-migration
displayName: Template Migration
description: "Use when migrating Sitecore XP templates, base templates, branch templates, standard values, insert options, or field models into Sitecore XM Cloud. Trigger phrases: migrate template, template migration, field mapping, standard values migration, branch template migration, data template migration."
category: migration
tags: [migration, template, content-model, fields, sitecore, xm-cloud]
triggers: [migrate template, template migration, field mapping, standard values migration, branch template migration, data template migration]
---

# Template Migration

Use this skill when the task is about rebuilding the XP content model in XM Cloud.

## Non-Negotiable Rules

1. Rebuild templates in XM Cloud. Do not copy XP templates and GUIDs directly into the target instance.
2. Do not preserve field clutter just because it exists in XP.
3. Design templates around the new authoring model and the needs of the Content SDK rendering layer.
4. Create new templates, sections, fields, standard values, and insert options in XM Cloud via MCP tooling (authoring GraphQL or SPE remoting via `run-powershell-script`) or the authoring UI, not by hand-authored YAML. Use `dotnet sitecore ser pull` only to export already-created items to source control. Hand-authoring template YAML is a fast way to produce items that load with broken field types, missing source values, or wrong base templates.
5. **Page templates must inherit from both `SXA Page` `{3F8A6A5D-7B1A-4566-8CD4-0A50F3030BD8}` and `_Designable` `{6650FB34-7EA1-4245-A919-5CC0F002A6D7}`.** SXA Page is the marker that SXA-aware tooling looks for (the upstream "Download Export Structure" script and any other `DoesTemplateInheritFrom(Page.ID)` check); `_Designable` adds the `Page Design` field that participates in TemplatesMapping. Add both bases on the project's root page template — SXA Page defines zero fields, so it cascades to every descendant page template with no field collisions. Sites scaffolded outside the SXA Headless Site Branch Template (e.g. Sitecore.Demo.Platform-style starters) typically inherit only from `_Designable`; that renders fine but breaks every external tool that walks site structure.

## Primary Goal

Translate the XP content model into a clean XM Cloud template model that supports the target editing and rendering experience.

## Recommended Workflow

1. Use `sitecore-lighthouse-xp` to inspect templates, base templates, standard values, insert options, branch templates, and real field usage.
2. Identify which fields are actually used by pages, renderings, and business workflows.
3. Remove legacy or SXA-only technical fields that do not belong in the new solution.
4. Drop fields that supported xConnect personalization, marketing automation, or Sitecore Forms — these do not have equivalents in XM Cloud.
5. Define the target template structure in XM Cloud: base templates, content templates, datasource templates, page templates, and branch templates only where they still help editors.
6. Create the templates in XM Cloud via MCP tooling or the authoring UI, then `dotnet sitecore ser pull -i "<site>"` to commit the generated YAML under `authoring/items/`.
7. Rebuild standard values and insert options in the target model via MCP/UI (not YAML).
8. Document old-to-new field mappings before moving content.

## Content SDK Considerations

- Favor field types that map cleanly to Content SDK components such as text, rich text, image, and link fields.
- Support predictable `fields.data.datasource` access patterns in components.
- Keep datasource templates focused and small where possible.
- Make sure the data model supports safe rendering even when optional fields are empty.
- Content Hub asset picker fields from XP do not exist in XM Cloud. Replace with standard Image or File fields backed by XM Cloud's Media Library or a Content Hub connector.
