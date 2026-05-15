---
name: sxa-datasources-media
description: "Audit SXA datasource and media organization in Sitecore XM Cloud: naming, folders, cleanup, media structure. Trigger phrases: datasource audit, media organization, data folder review, site data cleanup."
category: project-review
---

# SXA Datasources & Media

Use this skill to audit datasource and media organization in a Sitecore XM Cloud SXA Headless project.

## Checks

### Don't put media items directly under the site's Media folder
**Severity:** Minor
**What to verify:** Media items are organized in sub-folders by purpose or content type, not placed directly in the root media folder for the site.
**Issue indicators:** Hundreds of images dumped directly under `/sitecore/media library/Project/<site>/` with no organization.
**Recommendation:** Create sub-folders by category (Heroes, Products, Authors, Icons, etc.) under the site's media folder.

### Give site data sources meaningful names
**Severity:** Minor
**What to verify:** Datasource items have descriptive names that help editors identify them in selection dialogs and content tree.
**Issue indicators:** Auto-generated names like "Hero 1", "Promo Copy 3", or GUIDs as names.
**Recommendation:** Name datasources by their content purpose (e.g., "Homepage Hero - Summer Campaign", "Footer CTA - Free Trial").

### Organize site data sources in folders
**Severity:** Minor
**What to verify:** Datasource items are organized in folders under the page's Data folder or in a shared Data location, grouped by component type or purpose.
**Issue indicators:** Flat list of datasource items with no folder structure, making it hard to find and manage content.
**Recommendation:** Use sub-folders under Data: `Data/Heroes/`, `Data/Promos/`, `Data/CTAs/`. Or use per-page Data folders for page-specific datasources.

### Clean up unused site data sources
**Severity:** Minor
**What to verify:** Orphaned datasource items (not referenced by any rendering on any page) are identified and removed or archived.
**Issue indicators:** Large numbers of datasource items with no incoming links, bloating the content tree and confusing editors.
**Recommendation:** Periodically run a link database query to find datasources with zero references. Archive or delete unused items.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/data-sources.html
