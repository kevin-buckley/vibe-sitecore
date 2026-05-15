---
name: headless-project-structure
description: "Audit headless rendering host project structure: Helix organization, router usage, component composition, placeholders, media handling, and content resolvers. Trigger phrases: project structure review, component architecture, placeholder audit, media handling check, content resolver review."
category: project-review
---

# Headless Project Structure & Placeholders

Use this skill to audit the rendering host project structure and placeholder patterns in a Sitecore XM Cloud Content SDK project.

## Checks — Project Structure

### React/Next.js Helix Organization
**Severity:** Minor
**What to verify:** The rendering host organizes components by feature domain rather than by type. Shared utilities are separated from domain-specific components.
**Issue indicators:** All components in a flat `components/` folder with no grouping, 100+ files in a single directory.
**Recommendation:** Organize by feature/domain: `components/navigation/`, `components/content/`, `components/commerce/`, etc. Keep shared utilities in `lib/` or `utils/`.

### Using Router links
**Severity:** Minor
**What to verify:** Internal navigation uses the framework's router (Next.js `<Link>`) rather than plain `<a>` tags. This ensures client-side navigation and prefetching.
**Issue indicators:** Internal links using `<a href="...">` causing full page reloads, no prefetching of linked pages.
**Recommendation:** Use Next.js `<Link>` component for all internal links. Use Content SDK's link field rendering that automatically uses the router.

### Component Composition
**Severity:** Minor
**What to verify:** Components are properly composed — they read from their datasource fields and render child placeholders where appropriate, rather than hard-coding nested structures.
**Issue indicators:** Components with deeply nested hard-coded markup that should be separate editable components, or components that fetch data outside their datasource contract.
**Recommendation:** Design components to render their own datasource fields and provide placeholders for child content. Keep components focused on their single responsibility.

## Checks — Placeholders

### Avoid hard-coding layout
**Severity:** Major
**What to verify:** The rendering host's Layout component renders placeholders dynamically from the layout service response, not hard-coded component trees.
**Issue indicators:** Layout.tsx with hard-coded `<Header />` and `<Footer />` components instead of `<Placeholder name="headless-header" />`.
**Recommendation:** Layout should render `<Placeholder>` components that receive their content from the layout service response. Page chrome comes from Partial Designs resolved server-side.

### Avoid hard-coding fields
**Severity:** Minor
**What to verify:** Components read field values from their `props.fields` (datasource) or `props.fields.data` (GraphQL-extended) rather than hard-coding content.
**Issue indicators:** Component text/images hard-coded in JSX instead of using `<Text>`, `<RichText>`, `<Image>` field components from Content SDK.
**Recommendation:** Use Content SDK field rendering components (`<Text>`, `<RichText>`, `<Image>`, `<Link>`) which enable inline editing in Pages editor.

### Placeholder naming conventions
**Severity:** Minor
**What to verify:** Placeholder names follow a consistent convention (e.g., `headless-header`, `headless-main`, `headless-footer`) and match the Placeholder Settings items in Sitecore.
**Issue indicators:** Inconsistent placeholder names, names that don't match Placeholder Settings keys, spaces or special characters in placeholder names.
**Recommendation:** Use kebab-case for placeholder names. Prefix with a consistent identifier. Ensure each placeholder name matches a Placeholder Settings item key.

### Media Handling
**Severity:** Minor
**What to verify:** Media from XM Cloud is served efficiently — using the Edge media endpoint with proper image optimization, lazy loading, and responsive sizing.
**Issue indicators:** Images served at full resolution without sizing parameters, no lazy loading, broken image URLs in local development.
**Recommendation:** Use Next.js `<Image>` with the XMC media domain configured in `next.config.js`. Use Content SDK's `<Image>` field component which handles URL construction. Configure image loader for Edge media.

### Component Validation
**Severity:** Minor
**What to verify:** Components handle missing or empty fields gracefully — rendering nothing or a sensible default rather than crashing with null reference errors.
**Issue indicators:** Unhandled null/undefined field values causing React errors, blank pages when optional fields are empty.
**Recommendation:** Add null checks for optional fields. Use conditional rendering (`{field?.value && <Text field={field} />}`). Content SDK field components handle null gracefully by default.

### Content Resolvers
**Severity:** Minor
**What to verify:** Custom content resolvers (GraphQL queries extending the layout service response with additional data) are efficient and necessary.
**Issue indicators:** Content resolvers fetching large trees of data that the component doesn't use, N+1 queries in custom resolvers, resolvers duplicating data already in the layout response.
**Recommendation:** Use `ComponentQuery` on rendering items only when the component needs data beyond its datasource. Keep queries focused and test their performance impact.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/placeholders.html
- https://doc.sitecore.com/xmc/en/developers/xm-cloud/field-types-and-rendering.html
