---
name: headless-editor-experience
description: "Audit headless editor experience in Sitecore XM Cloud: browser object handling, custom library compatibility, editor-mode detection, and SXA integration. Trigger phrases: editor experience review, Pages editor audit, inline editing check, custom library review, browser object handling."
category: project-review
---

# Headless Editor Experience

Use this skill to audit editor experience support in a Sitecore XM Cloud Content SDK rendering host.

## Checks

### Avoid browser-specific objects in server-rendered code
**Severity:** Major
**What to verify:** Server-rendered components do not reference `window`, `document`, `localStorage`, or other browser-only APIs without proper guards.
**Issue indicators:** SSR crashes or hydration mismatches caused by accessing browser APIs during server rendering, "window is not defined" errors.
**Recommendation:** Use `'use client'` directive for components that need browser APIs. Gate browser-specific code behind `typeof window !== 'undefined'` checks or use React hooks (`useEffect`) that only run client-side.

### Custom Library Use
**Severity:** Minor
**What to verify:** Third-party libraries used in the rendering host are compatible with both SSR and the Pages editor's iframe environment.
**Issue indicators:** Libraries that break inside the Pages editor iframe, libraries that assume top-level window access, animation libraries that conflict with editor DOM manipulation.
**Recommendation:** Test all third-party libraries in the Pages editor context. Use dynamic imports with `ssr: false` for libraries incompatible with server rendering. Detect editing mode and disable conflicting behaviors.

### Treat Layout Service as an open API
**Severity:** Minor
**What to verify:** The rendering host does not assume a specific layout service response shape beyond what's documented. Custom extensions to the layout response are properly typed and handled.
**Issue indicators:** Components that break when optional layout service fields are absent, tight coupling to undocumented response properties.
**Recommendation:** Type all layout service data. Handle optional fields gracefully. Test components with minimal layout responses.

### Custom Error Pages
**Severity:** Minor
**What to verify:** The rendering host has proper error handling — custom 404 and 500 pages that don't crash themselves and provide useful editor feedback in editing mode.
**Issue indicators:** Generic Next.js error pages, error pages that import server-only code into client bundles, error boundaries that swallow useful information.
**Recommendation:** Create custom error pages (`not-found.tsx`, `error.tsx`, `global-error.tsx`) that are self-contained and don't depend on layout service data. Keep them simple to avoid cascading failures.

### SXA & Headless Services integration
**Severity:** Minor
**What to verify:** The rendering host properly supports SXA features used in XMC: dynamic placeholders from Partial Designs, component styles, rendering parameters.
**Issue indicators:** Partial Design placeholders not rendering, component styles not applied, rendering parameters not passed to components.
**Recommendation:** Ensure the rendering host uses the Content SDK's SXA placeholder resolution. Map rendering parameters and styles to component props correctly.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/editing-integration.html
- https://doc.sitecore.com/xmc/en/developers/xm-cloud/error-handling.html
