---
name: data-templates
description: "Audit Sitecore XM Cloud data templates for naming, inheritance, field configuration, standard values, and insert options. Trigger phrases: template review, template audit, data model check, field validation, template best practices."
category: project-review
---

# Data Templates

Use this skill to audit data template design in a Sitecore XM Cloud SXA Headless project.

## Checks

### Naming conventions
**Severity:** Minor
**What to verify:** Templates follow a consistent, meaningful naming convention (PascalCase or kebab-case per project standard). Names describe the content type, not the visual rendering.
**Issue indicators:** Inconsistent casing, abbreviations, generic names like "Page1" or "Template_new".
**Recommendation:** Establish and enforce a naming convention. Template names should reflect content purpose (e.g., "Article Page", "Hero Banner").

### Folder structure
**Severity:** Minor
**What to verify:** Templates are organized in a logical folder hierarchy under `/sitecore/templates/Project/<site>` or `/sitecore/templates/Feature/<module>`. Separation between page templates, datasource templates, and base templates.
**Issue indicators:** Flat list of templates with no folder organization, templates scattered across Foundation/Feature/Project without clear rationale.
**Recommendation:** Group templates by module or content domain. Keep page templates separate from datasource templates.

### Minimize the number of templates
**Severity:** Minor
**What to verify:** Templates are not over-fragmented. Similar content types share base templates rather than each having fully independent field sets.
**Issue indicators:** Many templates with near-identical fields, templates created for minor variations that could be handled by rendering parameters or styles.
**Recommendation:** Consolidate templates that share 80%+ of their fields. Use rendering parameters or component styles for visual variations.

### Make good use of inheritance
**Severity:** Minor
**What to verify:** Base templates are used to share common field groups (SEO, Open Graph, Navigation). Page templates inherit from appropriate SXA base templates.
**Issue indicators:** Fields duplicated across templates instead of inherited, templates not using SXA's standard base templates where applicable.
**Recommendation:** Extract shared fields into base templates. Ensure page templates inherit from the Headless Site's Page template or an appropriate SXA base.

### Cyclical template inheritance
**Severity:** Major
**What to verify:** No template inherits from itself directly or through a chain of base templates.
**Issue indicators:** Circular references in `__Base template` fields causing infinite loops or rendering errors.
**Recommendation:** Map the full inheritance chain for each template and remove any cycles.

### Avoid duplicate field names
**Severity:** Major
**What to verify:** No two fields in a template's inheritance chain share the same name. Field names are unique across the resolved template.
**Issue indicators:** Content SDK returns unexpected values, editors see duplicate fields in Pages editor, GraphQL queries return wrong data.
**Recommendation:** Rename conflicting fields. Use prefixes or more specific names when base templates might overlap.

### Assign icons to templates
**Severity:** Minor
**What to verify:** All content templates have meaningful icons assigned that help editors identify item types in the content tree.
**Issue indicators:** Default yellow diamond icon on custom templates, inconsistent or misleading icons.
**Recommendation:** Set `__Icon` on each template's Standard Values to a recognizable icon from the Sitecore icon library.

### Standard Values
**Severity:** Minor
**What to verify:** Every template has Standard Values defined. Default field values, insert options, and presentation are configured on Standard Values rather than individually on items.
**Issue indicators:** Templates missing Standard Values items, defaults applied inconsistently per-item.
**Recommendation:** Create Standard Values for all templates. Set sensible defaults, workflow initial state, and insert options there.

### Presentation details on Standard Values
**Severity:** Major
**What to verify:** In XMC, presentation is NOT set on Standard Values (the layout service does not resolve it from there). Instead, Page Designs + TemplatesMapping handle presentation inheritance.
**Issue indicators:** `__Renderings` or `__Final Renderings` populated on Standard Values expecting inheritance — components don't render on items.
**Recommendation:** Remove presentation from Standard Values. Use Page Designs with TemplatesMapping for presentation inheritance.

### Insert options
**Severity:** Minor
**What to verify:** Insert options are configured on Standard Values to control what content editors can create under each template type.
**Issue indicators:** No insert options defined (editors see all templates), overly permissive insert options allowing illogical content structures.
**Recommendation:** Define insert options that guide editors toward valid content hierarchies.

### Insert from template
**Severity:** Minor
**What to verify:** Branch templates or insert options are used to pre-populate required structures (e.g., a page with pre-created Data folder and required components).
**Issue indicators:** Editors must manually create supporting items after inserting a new page.
**Recommendation:** Use branch templates or SPE scripts to scaffold required child structures automatically.

### Use tokens
**Severity:** Minor
**What to verify:** Standard Values use Sitecore tokens (`$name`, `$date`, `$time`) for dynamic defaults rather than hard-coded values.
**Issue indicators:** Hard-coded dates or names in Standard Values that become stale.
**Recommendation:** Use `$name` for title fields, `$date`/`$time` for date fields on Standard Values.

### Define the source field for image fields
**Severity:** Minor
**What to verify:** Image fields have their `Source` property set to restrict media selection to the appropriate media library folder.
**Issue indicators:** Image fields with no source restriction — editors browse the entire media library.
**Recommendation:** Set `Source` to the relevant media library path (e.g., `/sitecore/media library/Project/<site>/`).

### Define the source field for Multi Select Fields
**Severity:** Minor
**What to verify:** Treelist, Multilist, and Droplink fields have their `Source` property configured to point to the correct content location.
**Issue indicators:** Selection fields with no source — editors see the entire content tree or no items at all.
**Recommendation:** Set `Source` to the specific folder containing valid selection items.

### Rich Text Editor profiles
**Severity:** Minor
**What to verify:** Rich text fields use appropriate RTE profiles that limit formatting options to what the front-end supports.
**Issue indicators:** Default RTE profile with full formatting toolbar — editors paste Word content with unsupported styles.
**Recommendation:** Create restricted RTE profiles that match front-end CSS capabilities. Assign them via the `Source` field property.

### Avoid changes to /sitecore/templates/system
**Severity:** Major
**What to verify:** No modifications to system templates. Custom fields or changes must be on project-specific templates only.
**Issue indicators:** Modified system templates that break on XMC upgrades.
**Recommendation:** Never modify system templates. Create project-specific templates that inherit what you need.

### Utilizing datasources instead of fields on page templates
**Severity:** Minor
**What to verify:** Component content is stored in datasource items rather than directly on the page template. This enables reuse and keeps page templates focused.
**Issue indicators:** Page templates with 30+ fields that are really component-level data, making templates unwieldy and preventing content reuse.
**Recommendation:** Use datasource templates for component-specific content. Reserve page template fields for truly page-level metadata (title, description, OG data).

### Use TreelistEx instead of Treelist for large trees
**Severity:** Minor
**What to verify:** When a field references a large item tree, TreelistEx (which loads on demand) is used instead of Treelist (which loads all items upfront).
**Issue indicators:** Slow editor experience when opening items with Treelist fields pointing to large trees.
**Recommendation:** Switch Treelist fields to TreelistEx when the source tree exceeds ~50 items.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/data-templates.html
- https://doc.sitecore.com/xmc/en/developers/xm-cloud/standard-values.html
