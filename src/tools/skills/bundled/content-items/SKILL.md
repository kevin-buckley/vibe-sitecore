---
name: content-items
description: "Audit Sitecore XM Cloud content structure, item counts, versioning, broken links, and validation rules. Trigger phrases: content audit, content structure review, item count check, broken links, version cleanup."
category: project-review
---

# Content Items

Use this skill to audit content item structure and hygiene in a Sitecore XM Cloud SXA Headless project.

## Checks

### Content structure
**Severity:** Minor
**What to verify:** Content is organized in a logical, navigable hierarchy. Site structure reflects the URL architecture. Shared content (datasources) is separated from page content.
**Issue indicators:** Flat content trees, inconsistent folder structures across sites, datasources mixed with page items.
**Recommendation:** Establish a clear content architecture: pages mirror URL paths, datasource items live under `Data/` folders or dedicated shared locations.

### Limit the number of items under a single node
**Severity:** Major
**What to verify:** No single folder contains more than 100 direct children. Excessive children degrade editor performance in Pages and Content Editor.
**Issue indicators:** Folders with 200+ items, slow tree loading, editor timeouts.
**Recommendation:** Use date-based or alphabetical sub-folders when content grows. For XMC, this also affects GraphQL query performance on `children` queries.

### Limit the number of versions
**Severity:** Minor
**What to verify:** Items do not accumulate excessive version history. A version management strategy exists (manual or automated cleanup).
**Issue indicators:** Items with 50+ versions, large serialization payloads, slow item loading.
**Recommendation:** Implement version pruning (manually or via scheduled script). XMC's Experience Edge publishes only the latest publishable version, but excessive versions still impact CM performance.

### Duplication of content
**Severity:** Minor
**What to verify:** Content is authored once and referenced (via datasources or links) rather than duplicated across locations.
**Issue indicators:** Identical content copied to multiple items, edits requiring updates in multiple places.
**Recommendation:** Use shared datasource items referenced by multiple pages. Use the Sitecore link field to point to canonical content.

### Use of Rich Text Editor
**Severity:** Minor
**What to verify:** Rich text fields contain appropriate markup — no inline styles, no embedded images via base64, no complex HTML structures that should be separate components.
**Issue indicators:** RTE fields with `<style>` tags, large base64 images, complex multi-column layouts inside a single field.
**Recommendation:** Restrict RTE capabilities via profiles. Complex layouts should be separate components placed in placeholders, not embedded in RTE.

### Broken links
**Severity:** Minor
**What to verify:** No internal links point to deleted or moved items. Media references resolve correctly.
**Issue indicators:** Sitecore's link database reports broken references, 404s on published pages for internal links.
**Recommendation:** Run broken link reports regularly. Use Sitecore's built-in link validation or SPE scripts to identify and fix broken references.

### Previewing new items
**Severity:** Minor
**What to verify:** Newly created items render correctly in the Pages editor preview and on the rendering host before publishing.
**Issue indicators:** Blank previews due to missing presentation, errors in Pages editor for new content types.
**Recommendation:** Ensure all page templates have TemplatesMapping entries pointing to appropriate Page Designs. Test the authoring flow for each content type.

### Validation check
**Severity:** Minor
**What to verify:** Field validation rules are configured for required fields and format constraints (email, URL, max length).
**Issue indicators:** No validation rules — editors can publish pages with empty required fields or malformed data.
**Recommendation:** Add validation rules to template fields for required content. Use Quick Action Bar validators for critical fields.

### Aliases and redirects
**Severity:** Minor
**What to verify:** URL redirects are managed through a structured approach (redirect module, middleware, or Edge function) rather than ad-hoc item aliases.
**Issue indicators:** Hundreds of Sitecore alias items, no redirect strategy for renamed/moved pages.
**Recommendation:** Use a redirect module or Next.js middleware for URL management. In XMC, rendering host middleware or Vercel/Netlify redirects are preferred over Sitecore aliases.

### Access to content items that do not correlate to pages
**Severity:** Minor
**What to verify:** Non-page items (datasources, settings, dictionary entries) are not accidentally reachable via URL resolution.
**Issue indicators:** Datasource items rendering as blank pages when navigated to directly.
**Recommendation:** Ensure non-page items use templates that are not included in URL resolution. Use item-level presentation or wildcard handling to return 404 for non-page items.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/content-architecture.html
