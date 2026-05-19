---
name: sxa-renderings
description: "Audit SXA rendering usage, rendering variants, and component development practices in Sitecore XM Cloud. Trigger phrases: rendering review, variant audit, component development check, SXA module, custom rendering."
category: project-review
---

# SXA Renderings & Development

Use this skill to audit rendering usage, rendering variants, and development practices in a Sitecore XM Cloud SXA Headless project.

## Checks — Rendering Usage

### Use proper renderings for the job
**Severity:** Minor
**What to verify:** Components use appropriate SXA rendering types. JSON Renderings (headless) are used for Content SDK delivery. No MVC-only renderings referenced.
**Issue indicators:** Controller renderings or View renderings in a headless site, custom renderings built where an OOTB SXA headless rendering would work.
**Recommendation:** Prefer OOTB SXA headless renderings where they meet requirements. Only create custom JSON renderings when OOTB options are insufficient.

### Available Renderings, Placeholder Settings, and the rendering host's component-map must agree
**Severity:** Major
**What to verify:** Every rendering ID in a site's `Presentation/Available Renderings` folders AND in its `Presentation/Placeholder Settings/.../Allowed Controls` resolves to a Json Rendering with a non-empty `componentName`, AND that `componentName` is registered in the rendering host's `.sitecore/component-map.ts`. The three layers are a contract — break any one and editors get an allowlist that promises components the rendering host can't render.
**Issue indicators:**
- Pages render the orange "Content SDK component is missing React implementation" panel.
- A rendering's `template` is `Controller rendering` (XP MVC) instead of `Json Rendering`.
- A rendering's `componentName` field is empty (controller renderings never have it; misconfigured Json renderings sometimes don't either).
- A rendering item lives under `/Renderings/Project/<OtherSite>/` but is referenced from this site — the React component lives in the *other* site's rendering host, not this one.
- The SXA Headless Site Branch Template scaffolded the default 13 Available Renderings (RichText, Image, Title, PageContent, Promo, Navigation, LinkList, Container, ColumnSplitter, RowSplitter, Form, BYOC Wrapper, FEaaS Wrapper) but the rendering host is bespoke (not started from the Sitecore Next.js starter) and only registers a project-specific subset, so most defaults fall through to the missing-implementation panel.
**Recommendation:** For each Available Renderings folder, list its rendering IDs, look up each item's `componentName`, and confirm the name appears as a key in the rendering host's `component-map.ts`. Either port the missing React components (the Sitecore-published Next.js starters carry implementations for the default 13) or prune the allowlist down to what the host actually renders. Custom project renderings must also be explicitly added to an Available Renderings folder (and to relevant Placeholder Settings `Allowed Controls`) — being present at `/Renderings/Project/<Site>/` does not auto-authorize them.

### Use Snippet rendering to prepare sets of components
**Severity:** Minor
**What to verify:** Pre-configured sets of components (e.g., a two-column layout with specific default datasources) use the Snippet rendering pattern for editor convenience.
**Issue indicators:** Editors must manually assemble multi-component patterns from scratch each time.
**Recommendation:** Create Snippet renderings for common component combinations that editors repeatedly assemble.

### Do not use Plain HTML for content edited by Content Editors
**Severity:** Minor
**What to verify:** Editor-managed content uses proper Rich Text or structured component fields, not raw HTML components.
**Issue indicators:** Plain HTML or raw markup components used where editors need to make changes — leading to broken markup from casual edits.
**Recommendation:** Use Rich Text fields with constrained RTE profiles, or structured components with dedicated fields for each editable element.

### Rich Text field content should be fully editable in Pages
**Severity:** Minor
**What to verify:** Rich Text fields render correctly in the Pages editing experience with inline editing support.
**Issue indicators:** RTE content that requires switching to raw HTML mode to edit, or content that breaks visual editing.
**Recommendation:** Keep RTE content simple (headings, paragraphs, lists, links, images). Complex structures belong in dedicated components.

## Checks — Rendering Variants

### Limit the number of rendering variants to 15 (preferably below 10)
**Severity:** Minor
**What to verify:** Each rendering has a manageable number of variants. Excessive variants create confusion for editors.
**Issue indicators:** Renderings with 15+ variants, many of which are minor styling tweaks better handled by component styles.
**Recommendation:** Use Component Styles for visual variations (colors, sizes). Reserve Rendering Variants for structural layout differences.

### Provide previews for Rendering Variants
**Severity:** Minor
**What to verify:** Rendering variants have thumbnail previews so editors can visually identify which variant to select.
**Issue indicators:** Variant selection shows only text names with no visual preview.
**Recommendation:** Add preview images/thumbnails to variant items to improve editor UX.

## Checks — Development Practices

### Never put custom items in SXA controlled branches of the tree
**Severity:** Major
**What to verify:** Custom templates, renderings, or content are NOT placed inside SXA-managed tree locations (e.g., under `/sitecore/templates/Foundation/Experience Accelerator/`).
**Issue indicators:** Custom items under SXA system paths that will be overwritten on upgrade.
**Recommendation:** Place all custom items under `/sitecore/templates/Project/`, `/sitecore/layout/Renderings/Project/`, etc.

### Do not modify OOTB SXA items
**Severity:** Major
**What to verify:** No modifications to out-of-the-box SXA templates, renderings, or configuration items.
**Issue indicators:** Modified SXA system items that will regress on platform updates.
**Recommendation:** Override behavior through proper extension points (custom renderings, derived templates, config patches).

### Do not replace the SXA Layout with a custom implementation
**Severity:** Major
**What to verify:** The site uses the standard SXA Headless layout. In XMC, this is the JSS layout that the Content SDK rendering host expects.
**Issue indicators:** Custom layout definitions replacing the SXA headless layout, breaking Page Design resolution and placeholder inheritance.
**Recommendation:** Use the standard SXA Headless layout. Customize page structure through Partial Designs and the rendering host's Layout component.

### Create an SXA module for your components
**Severity:** Minor
**What to verify:** Custom renderings are organized in a proper SXA module structure with Module definition items, allowing clean deployment and site scaffolding.
**Issue indicators:** Custom renderings scattered without module organization, manual steps required to add renderings to new sites.
**Recommendation:** Create a site module that packages your custom renderings, templates, and configurations for clean deployment.

### Follow Helix principles when adding functionality
**Severity:** Minor
**What to verify:** Custom code follows Helix layering (Foundation/Feature/Project). Rendering host components are organized by feature domain.
**Issue indicators:** Monolithic component folders, circular dependencies between features, utility code mixed with domain-specific components.
**Recommendation:** Organize rendering host components by feature. Keep shared utilities in a foundation layer. Avoid cross-feature dependencies.

### Consider using existing renderings before building new ones
**Severity:** Minor
**What to verify:** Before creating a custom rendering, existing SXA headless renderings + styling options are evaluated.
**Issue indicators:** Custom renderings that duplicate OOTB functionality with minor differences achievable through styles or rendering parameters.
**Recommendation:** Audit OOTB SXA headless renderings first. Use styles, rendering parameters, or variants to adapt them before creating custom ones.

### Consider cloning existing renderings before building from scratch
**Severity:** Minor
**What to verify:** When a custom rendering is similar to an existing one, the existing rendering is cloned and modified rather than built from zero.
**Issue indicators:** Custom renderings that reinvent datasource patterns, placeholder handling, or editor integration already solved by an OOTB rendering.
**Recommendation:** Clone the closest OOTB rendering as a starting point. Modify the clone to meet custom requirements while inheriting proven patterns.

### Limit scope of fields linking to items
**Severity:** Minor
**What to verify:** Link fields, Droptree fields, and reference fields have their source scoped to prevent editors from referencing inappropriate items.
**Issue indicators:** Link fields that can reference any item in the tree, Droptree fields without source restrictions.
**Recommendation:** Set `Source` properties on all reference fields to limit selection to valid targets.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/renderings.html
- https://doc.sitecore.com/xmc/en/developers/xm-cloud/available-renderings.html
