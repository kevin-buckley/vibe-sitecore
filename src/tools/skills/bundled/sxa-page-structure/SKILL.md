---
name: sxa-page-structure
description: "Audit SXA page structure in Sitecore XM Cloud: Partial Designs, Page Designs, placeholder restrictions, component sizing, and presentation inheritance. Trigger phrases: page design audit, partial design review, SXA structure check, placeholder restrictions."
category: project-review
---

# SXA Page Structure

Use this skill to audit SXA page structure patterns in a Sitecore XM Cloud SXA Headless project.

## Checks

### Design page layout in Partial Designs
**Severity:** Major
**What to verify:** Page layout (header, footer, sidebar, content areas) is defined through Partial Designs, not by placing components directly on individual items or on Page Design items.
**Issue indicators:** Components placed directly on Page Design items (they won't render), layout duplication across content items, no Partial Designs defined.
**Recommendation:** Create Partial Designs for each distinct page region (Header, Footer, Content Area, Sidebar, etc.). Compose Page Designs by referencing Partial Designs.

### Put complex reusable structures in Partial Designs or Composite Components
**Severity:** Minor
**What to verify:** Reusable multi-component structures (e.g., a hero + breadcrumb + title block) are encapsulated in Partial Designs or single composite renderings rather than requiring editors to manually assemble them on each page.
**Issue indicators:** Editors must place the same 3-5 components in the same order on every new page, leading to inconsistency.
**Recommendation:** Wrap recurring component groups into a Partial Design. For truly self-contained sets, consider a composite rendering.

### Remove unnecessary components from Available Renderings
**Severity:** Minor
**What to verify:** The site's Available Renderings only include components that editors should actually use. Styled component variants are preferred over raw base components where applicable.
**Issue indicators:** Editors see dozens of renderings including internal/system components, raw base components alongside their styled variants.
**Recommendation:** Curate Available Renderings to show only editor-appropriate components. Hide internal, deprecated, or base components that have styled replacements.

### Setup placeholder restrictions
**Severity:** Major
**What to verify:** Every placeholder has Placeholder Settings that restrict which renderings can be placed there. This prevents editors from creating broken layouts.
**Issue indicators:** Placeholders with no restrictions (any component can be added anywhere), or Placeholder Settings with wildcard allowed controls.
**Recommendation:** Define specific allowed renderings for each placeholder. For example, `headless-header` should only allow Navigation, Logo, and Search components.

### Do not use Standard Values for presentation details
**Severity:** Major
**What to verify:** Presentation is inherited through TemplatesMapping on the Page Designs folder, NOT through Standard Values `__Renderings`/`__Final Renderings` fields.
**Issue indicators:** Standard Values with populated presentation fields, items not rendering because the layout service doesn't resolve Standard Values inheritance.
**Recommendation:** Clear presentation from Standard Values. Configure TemplatesMapping on the Page Designs folder to map each template to its Page Design.

### Make use of Partial Design inheritance where it makes sense
**Severity:** Minor
**What to verify:** Partial Designs that share common elements use inheritance (a child partial design inherits from a parent) rather than duplicating component placements.
**Issue indicators:** Multiple Partial Designs with identical header/footer component lists that must be updated independently.
**Recommendation:** Create a base Partial Design with shared components and inherit from it for variations.

### Prioritize setting component size directly on the component over using splitters
**Severity:** Minor
**What to verify:** Component grid sizing uses CSS classes or rendering parameters on the component itself rather than relying on Column Splitter / Row Splitter renderings.
**Issue indicators:** Excessive use of splitter renderings creating complex nested placeholder structures that are hard to manage.
**Recommendation:** Use grid CSS classes via component styles or rendering parameters. Reserve splitters for genuinely complex multi-column layouts that can't be achieved otherwise.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/page-designs-and-partial-designs.html
- https://doc.sitecore.com/xmc/en/developers/xm-cloud/placeholder-settings.html
