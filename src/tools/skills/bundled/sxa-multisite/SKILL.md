---
name: sxa-multisite
description: "Audit SXA multisite architecture, content sharing, shared sites, language configuration, and blueprint patterns in Sitecore XM Cloud. Trigger phrases: multisite review, shared site audit, content sharing check, language setup, blueprint site."
category: project-review
---

# SXA Multisite & Content Sharing

Use this skill to audit multisite architecture and content sharing in a Sitecore XM Cloud SXA Headless project.

## Checks

### Consider using Shared site as the exclusive style container in a tenant
**Severity:** Minor
**What to verify:** In multi-site tenants, styles are centralized in the Shared site rather than duplicated per site. This ensures visual consistency and reduces maintenance.
**Issue indicators:** Each site in a tenant has independently maintained copies of the same styles, leading to drift.
**Recommendation:** Define styles once in the Shared site. Local sites inherit them automatically.

### Consider defining rendering variants in the shared site
**Severity:** Minor
**What to verify:** Rendering variants that apply across all sites in a tenant are defined in the Shared site, not duplicated per local site.
**Issue indicators:** Identical rendering variants maintained independently in each site, updates requiring changes in multiple places.
**Recommendation:** Move common rendering variants to the Shared site. Keep site-specific variants in local sites only for genuine per-site differences.

### Consider using delegated areas for pages that share content across multiple sites
**Severity:** Minor
**What to verify:** Cross-site shared content (legal pages, corporate info) uses delegated areas or shared datasources rather than content duplication.
**Issue indicators:** The same legal/privacy/terms content copy-pasted across every site in the tenant.
**Recommendation:** Use shared content items referenced by all sites, or delegated page areas that render content from a central location.

### Consider creating a blueprint/master site to clone for new markets
**Severity:** Minor
**What to verify:** For multi-market rollouts, a master site template exists that can be cloned to quickly spin up new sites with the correct structure, templates, and base content.
**Issue indicators:** New sites built from scratch each time, with inconsistent structures.
**Recommendation:** Create a site template with scaffolding scripts that produce consistent new sites. In XMC, use the Site Template mechanism (ExecuteScript + Headless Site Setup).

### Consider defining Page Designs and Partial Designs in the shared site
**Severity:** Minor
**What to verify:** Page Designs and Partial Designs that are common across all sites in a tenant are defined in the Shared site.
**Issue indicators:** Identical page designs duplicated in every site, requiring updates in multiple locations.
**Recommendation:** Shared site contributes its designs to all sites in the tenant. Define common designs there; use per-site designs only for genuinely unique layouts.

### Always configure and create items in the language of the content
**Severity:** Minor
**What to verify:** Content items are created and edited in their target language, not created in English and then translated later as a separate version.
**Issue indicators:** Items with blank fields in their target language because they were only authored in the default language. Content showing fallback language unexpectedly.
**Recommendation:** Configure the site's language settings properly. Editors should work in the correct language context. Enable language fallback only where appropriate.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/multisite-architecture.html
- https://doc.sitecore.com/xmc/en/developers/xm-cloud/language-support.html
