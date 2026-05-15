---
name: sxa-performance
description: "Audit SXA performance practices in Sitecore XM Cloud: component counts, caching settings, content testing, and asset optimization. Trigger phrases: SXA performance review, component count check, caching audit, asset optimizer."
category: project-review
---

# SXA Performance

Use this skill to audit SXA performance practices in a Sitecore XM Cloud SXA Headless project.

## Checks

### Limit the number of components directly on a page to under 30
**Severity:** Major
**What to verify:** Individual pages do not have more than 30 rendering instances in their combined presentation (page-level + partial design renderings). Excessive components degrade editor performance and increase layout service response times.
**Issue indicators:** Pages with 30+ components loading slowly in Pages editor, large layout service JSON responses, slow page editing experience.
**Recommendation:** Consolidate components where possible. Use composite renderings or restructure complex pages into parent/child page patterns.

### Disable Content Testing for editors that do not require the functionality
**Severity:** Minor
**What to verify:** A/B testing and content testing features are only enabled for editors who actively use them, not globally for all content authors.
**Issue indicators:** All editors see testing UI controls they don't use, adding complexity and potential confusion.
**Recommendation:** Use role-based access to restrict content testing features to designated testing/optimization editors.

### Consider configuring HTML Caching settings for components
**Severity:** Minor
**What to verify:** In XMC, Experience Edge provides CDN-level caching for published content. For the CM authoring experience, output caching settings on renderings can improve editor preview performance.
**Issue indicators:** Slow page previews in the CM, no caching configuration on renderings.
**Recommendation:** Configure Vary By rules on rendering items for CM preview caching. For delivery, rely on Experience Edge CDN caching and rendering host ISR/SSG strategies.

### Verify that Asset Optimizer is enabled for your site
**Severity:** Minor
**What to verify:** If the site uses SXA's built-in CSS/JS bundling (relevant for non-headless pages or hybrid setups), the Asset Optimizer is enabled.
**Issue indicators:** Multiple unbundled CSS/JS files served individually, no minification.
**Recommendation:** For headless sites, bundling is handled by the rendering host's build tool (Next.js/webpack). Verify that the rendering host's production build properly bundles and minifies assets.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/performance-optimization.html
