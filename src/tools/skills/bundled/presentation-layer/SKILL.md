---
name: presentation-layer
description: "Audit Sitecore XM Cloud presentation configuration including layouts, component binding, placeholder settings, and image handling. Trigger phrases: presentation review, layout audit, placeholder check, component binding, image parameters."
category: project-review
---

# Presentation Layer

Use this skill to audit presentation layer configuration in a Sitecore XM Cloud SXA Headless project.

## Checks

### Limit the number of layouts
**Severity:** Minor
**What to verify:** The project uses a minimal number of layout definitions. In XMC SXA Headless, there should typically be exactly one layout (the JSS/Headless layout) per site.
**Issue indicators:** Multiple custom layouts created when one would suffice, legacy MVC layouts still referenced.
**Recommendation:** Use a single Headless layout per site. Structural variations should be handled through Page Designs and Partial Designs, not multiple layouts.

### Static binding
**Severity:** Minor
**What to verify:** Components that appear on every page of a type (headers, footers, navigation) are placed via Partial Designs rather than statically bound in layout code or on every item.
**Issue indicators:** Header/footer components repeated on every content item's `__Final Renderings`, or hard-coded in the rendering host layout file.
**Recommendation:** Use Partial Designs for consistent page chrome. The rendering host `Layout.tsx` should render placeholders, not hard-coded components.

### Dynamic binding
**Severity:** Minor
**What to verify:** Content-specific components are dynamically placed via placeholders that editors can populate through Pages editor.
**Issue indicators:** All components are statically placed with no editor flexibility, or conversely, structural components like navigation are in editor-controlled placeholders.
**Recommendation:** Balance static (Partial Design) and dynamic (editor-placed) components. Structural elements go in Partial Designs; editorial content goes in editable placeholders.

### Placeholder Settings
**Severity:** Major
**What to verify:** Placeholder Settings items exist for all placeholders and restrict which renderings can be added. Each Partial Design has a matching Placeholder Settings item.
**Issue indicators:** Missing Placeholder Settings (editors can add any component anywhere), or Placeholder Settings with empty allowed controls.
**Recommendation:** Define Placeholder Settings for every placeholder. Restrict allowed renderings to those appropriate for each page region. When creating Partial Designs via script, also create matching Placeholder Settings items.

### Sitecore presentation controls
**Severity:** Minor
**What to verify:** All components that editors interact with are registered as Rendering items with proper fields (Component Name, Datasource Template, Datasource Location, Rendering Parameters).
**Issue indicators:** Renderings without datasource configuration, missing Component Name (won't render via Content SDK), missing Placeholder Settings entries.
**Recommendation:** Every rendering item must have: Component Name matching the React component export, appropriate Datasource Template and Location, and be added to relevant Placeholder Settings.

### Image manipulation parameters
**Severity:** Minor
**What to verify:** Images rendered via Content SDK use appropriate sizing parameters (width/height/max dimensions) to avoid serving full-resolution images to end users.
**Issue indicators:** Full-resolution images served without resizing, no `next/image` optimization configured, media URLs without query parameters.
**Recommendation:** Use Next.js `<Image>` component with appropriate dimensions or Content SDK's image field with parameters. Configure `next.config.js` image domains for the XMC media endpoint.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/presentation.html
- https://doc.sitecore.com/xmc/en/developers/xm-cloud/placeholder-settings.html
