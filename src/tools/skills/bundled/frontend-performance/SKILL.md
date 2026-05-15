---
name: frontend-performance
description: "Audit frontend performance for Sitecore XM Cloud rendering hosts: page load, JavaScript/CSS optimization, CDN usage, compression, caching strategy, and accessibility. Trigger phrases: frontend performance audit, page speed review, JS optimization, CSS audit, CDN check, WCAG accessibility, Core Web Vitals."
category: project-review
---

# Frontend Performance

Use this skill to audit frontend performance in a Sitecore XM Cloud Content SDK rendering host.

## Checks — Page Load

### Homepage performance
**Severity:** Major
**What to verify:** The homepage loads within acceptable performance budgets. Core Web Vitals (LCP < 2.5s, FID/INP < 200ms, CLS < 0.1) are met.
**Issue indicators:** Slow initial load, large LCP element loading late, layout shifts during hydration.
**Recommendation:** Profile with Lighthouse/WebPageTest. Optimize LCP by preloading hero images, minimizing render-blocking resources. Use Next.js `priority` prop on above-the-fold images.

### Page load time
**Severity:** Major
**What to verify:** Key page templates render within performance budgets. Server response time (TTFB) is under 800ms for SSR pages, page interactive within 3.5s.
**Issue indicators:** High TTFB due to slow layout service queries, large JavaScript bundles blocking interactivity, waterfall loading patterns.
**Recommendation:** Use ISR to pre-render content pages. Minimize client-side JavaScript. Lazy-load below-fold components. Optimize GraphQL queries.

## Checks — JavaScript

### Number of JavaScript files
**Severity:** Minor
**What to verify:** JavaScript is properly bundled. Production builds produce a reasonable number of chunks (code-split by route) without excessive fragmentation.
**Issue indicators:** 50+ individual JS files loaded on a single page, no code splitting, or conversely excessive chunk splitting causing waterfall loads.
**Recommendation:** Use Next.js default code splitting (per-route chunks). Avoid importing entire libraries when only a function is needed. Use dynamic imports for heavy components.

### Script tags
**Severity:** Minor
**What to verify:** Third-party scripts use `async` or `defer` attributes. No render-blocking scripts in `<head>`. Critical scripts are loaded appropriately.
**Issue indicators:** Synchronous third-party scripts blocking page render, analytics scripts in `<head>` without async.
**Recommendation:** Use Next.js `<Script>` component with appropriate `strategy` (afterInteractive, lazyOnload). Never block rendering with synchronous external scripts.

### Use a CDN
**Severity:** Major
**What to verify:** Static assets and media are served via CDN. In XMC, Experience Edge serves content via CDN. The rendering host should also be deployed behind a CDN (Vercel, Netlify, CloudFront).
**Issue indicators:** Assets served directly from origin without CDN, high latency for static resources, no edge caching.
**Recommendation:** Deploy the rendering host on a platform with built-in CDN (Vercel, Netlify). Configure proper cache headers. XMC media is already CDN-served via Experience Edge.

## Checks — CSS

### Number of CSS files
**Severity:** Minor
**What to verify:** CSS is bundled efficiently. CSS modules, Tailwind, or similar tools produce optimized output without excessive file count.
**Issue indicators:** Multiple large CSS files loaded on every page, unused CSS shipped to the browser.
**Recommendation:** Use CSS Modules or Tailwind (tree-shaken). Next.js handles CSS bundling automatically. Audit with coverage tools to find unused CSS.

### Inline CSS and Style tags
**Severity:** Minor
**What to verify:** Critical CSS is properly inlined for above-the-fold content. Non-critical CSS is loaded asynchronously. No excessive inline styles.
**Issue indicators:** Large inline `<style>` blocks on every page, or no critical CSS inlining (flash of unstyled content).
**Recommendation:** Next.js handles critical CSS extraction automatically. Avoid excessive inline styles in components — use CSS classes.

### Minified and compressed CSS and JS
**Severity:** Minor
**What to verify:** Production builds produce minified CSS and JS. Gzip or Brotli compression is enabled on the hosting platform.
**Issue indicators:** Unminified assets in production, missing compression headers, large transfer sizes.
**Recommendation:** Next.js production builds minify by default. Verify hosting platform serves Brotli/Gzip. Check response headers for `Content-Encoding`.

### Plain text compression
**Severity:** Minor
**What to verify:** HTML responses are served with Gzip or Brotli compression. Text-based responses (HTML, JSON, SVG) are compressed.
**Issue indicators:** Missing `Content-Encoding` header on text responses, large uncompressed HTML payloads.
**Recommendation:** Enable compression at the hosting/CDN level. Most deployment platforms (Vercel, Netlify) enable this by default. Verify with network inspector.

## Checks — Caching

### Data caching
**Severity:** Minor
**What to verify:** GraphQL/Edge responses are cached appropriately. Rendering host uses ISR or server-side caching to avoid redundant content fetches.
**Issue indicators:** Every page request triggers a fresh Edge query, no ISR revalidation configured, cache hit ratio near zero.
**Recommendation:** Configure ISR with appropriate revalidation periods (60s for content pages, shorter for dynamic pages). Use Next.js caching for GraphQL responses.

### Presentation caching
**Severity:** Minor
**What to verify:** Rendered page output is cached at appropriate levels (CDN edge, rendering host cache, ISR).
**Issue indicators:** No caching strategy — every visitor triggers a full SSR render, high server costs, slow TTFB under load.
**Recommendation:** Use ISR for content pages. Configure CDN cache-control headers. For personalized pages, cache the base layout and personalize at the edge or client.

## Checks — Quality

### WCAG Accessibility
**Severity:** Major
**What to verify:** The rendering host output meets WCAG 2.1 AA accessibility standards. Semantic HTML, proper ARIA labels, keyboard navigation, color contrast, and screen reader compatibility.
**Issue indicators:** Missing alt text on images, poor color contrast, non-keyboard-navigable elements, missing form labels, no skip navigation.
**Recommendation:** Run automated accessibility audits (axe-core, Lighthouse accessibility). Test with screen readers. Ensure all interactive elements are keyboard accessible. Use semantic HTML elements.

## References

- https://web.dev/vitals/
- https://nextjs.org/docs/app/building-your-application/optimizing
- https://www.w3.org/WAI/WCAG21/quickref/
