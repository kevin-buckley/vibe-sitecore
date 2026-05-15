---
name: solution-code
description: "Audit solution code quality for Sitecore XM Cloud headless projects: hard-coded values, naming conventions, dependencies, project structure, and Helix compliance. Trigger phrases: code review, hard-coded values check, naming audit, dependency review, Helix compliance."
category: project-review
---

# Solution Code

Use this skill to audit solution code quality in a Sitecore XM Cloud Content SDK rendering host project.

## Checks — Hard-coded Values

### Hard coded paths
**Severity:** Minor
**What to verify:** No Sitecore item paths are hard-coded in rendering host code. Item references use IDs or configuration-driven paths.
**Issue indicators:** String literals like `"/sitecore/content/Site/Home/..."` in component code, paths that break when content is reorganized.
**Recommendation:** Use GraphQL queries with relative paths, site-relative routing, or configuration files for any necessary path references.

### Hard coded GUIDs
**Severity:** Minor
**What to verify:** Sitecore item GUIDs are not scattered throughout component code. When GUIDs are needed, they are centralized in a constants file.
**Issue indicators:** GUID strings embedded directly in component logic, same GUID repeated in multiple files.
**Recommendation:** If GUIDs are necessary (rare in headless), centralize them in a constants module with descriptive names. Prefer name-based queries over GUID-based lookups.

### Hard coded image paths from media library
**Severity:** Minor
**What to verify:** Media URLs are not hard-coded. Images come from Sitecore Image fields rendered via Content SDK components.
**Issue indicators:** Hard-coded URLs to media library items (`/-/media/...`), images that break when media is reorganized.
**Recommendation:** Use Image fields on templates, rendered via Content SDK's `<Image>` component. For static assets (logos, icons), use the rendering host's `public/` folder.

### Hard coded content
**Severity:** Minor
**What to verify:** User-visible text comes from Sitecore fields or Dictionary items, not hard-coded in component code.
**Issue indicators:** Labels, headings, and descriptions embedded as string literals in components, content changes requiring code deployments.
**Recommendation:** Store all editor-managed content in Sitecore fields. Use Dictionary items for UI labels. Only hard-code truly static developer strings (error codes, log messages).

### Hard coded language
**Severity:** Minor
**What to verify:** Language is not hard-coded in queries or component logic. The current language is derived from the request context.
**Issue indicators:** `language: "en"` hard-coded in GraphQL queries, components assuming English content.
**Recommendation:** Use the Content SDK's language context. Pass language from the URL/route to all queries dynamically.

### Direct references to the database
**Severity:** Major
**What to verify:** Components do not directly access Sitecore databases. All content access goes through the layout service, GraphQL, or Content SDK APIs.
**Issue indicators:** Direct SQL queries, Sitecore API calls in the rendering host, bypassing the content delivery pipeline.
**Recommendation:** Use Content SDK's APIs and GraphQL for all content access. The rendering host should never connect directly to Sitecore databases.

### Hard coded device
**Severity:** Minor
**What to verify:** No device-specific logic is hard-coded. Responsive behavior is handled via CSS or framework features (Next.js middleware, viewport detection).
**Issue indicators:** Server-side device detection with hard-coded user agent strings, separate mobile/desktop code paths based on static rules.
**Recommendation:** Use responsive CSS and progressive enhancement. If server-side device detection is needed, use the framework's built-in capabilities.

### Hard coded version
**Severity:** Minor
**What to verify:** Sitecore package versions, API versions, or configuration version numbers are not hard-coded throughout the codebase.
**Issue indicators:** Version strings scattered in multiple files, version bumps requiring multi-file changes.
**Recommendation:** Centralize version configuration in `package.json`, environment variables, or a single config file.

### Domain name
**Severity:** Minor
**What to verify:** Domain names and base URLs are configuration-driven, not hard-coded in components or API calls.
**Issue indicators:** Hard-coded production URLs in component code, absolute URLs that break across environments.
**Recommendation:** Use environment variables for all domain references (`NEXT_PUBLIC_SITE_URL`, `SITECORE_EDGE_URL`). Use relative URLs where possible.

## Checks — Structure & Dependencies

### Consistent naming between solution files and Sitecore
**Severity:** Minor
**What to verify:** Component file names match Sitecore rendering item `componentName` values. Template field names align with TypeScript property names.
**Issue indicators:** Mismatched names causing component resolution failures, confusing mapping between Sitecore items and code files.
**Recommendation:** Use a consistent naming convention. Component file name = Sitecore rendering `componentName`. Document any exceptions.

### Use package manager correctly
**Severity:** Minor
**What to verify:** Dependencies use the package manager's lock file. No manual file references. All dependencies are declared in `package.json`.
**Issue indicators:** Dependencies copied into the project manually, missing lock file, inconsistent dependency resolution across environments.
**Recommendation:** Use npm/yarn/pnpm with lock files committed to source control. All dependencies declared in `package.json`.

### Use build scripts to publish the solution
**Severity:** Minor
**What to verify:** A clear, automated build pipeline exists. Building and deploying requires running documented scripts, not manual steps.
**Issue indicators:** Manual build steps documented in a wiki, undocumented environment setup required, "works on my machine" situations.
**Recommendation:** Define build scripts in `package.json`. Document the build and deploy process. Use CI/CD pipelines for automated deployment.

### Helix Modules (adapted for headless)
**Severity:** Minor
**What to verify:** The rendering host follows modular organization. Related components, utilities, and types are grouped by feature/module rather than by file type.
**Issue indicators:** All components in one folder, all types in another, all utilities in a third — making it hard to understand feature boundaries.
**Recommendation:** Organize by feature domain. Each feature module contains its components, types, utilities, and tests together.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/project-structure.html
- https://helix.sitecore.com/
