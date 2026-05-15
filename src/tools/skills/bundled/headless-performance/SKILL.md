---
name: headless-performance
description: "Audit headless rendering performance in Sitecore XM Cloud: output caching, personalization impact, and rendering strategies. Trigger phrases: headless performance, caching review, personalization performance, SSR optimization."
category: project-review
---

# Headless Performance & Scaling

Use this skill to audit rendering host performance in a Sitecore XM Cloud SXA Headless project.

## Checks

### HTML Cache / Output Caching
**Severity:** Minor
**What to verify:** The rendering host uses appropriate caching strategies — ISR (Incremental Static Regeneration) for stable content, SSR for dynamic/personalized content, static generation where possible.
**Issue indicators:** All pages SSR'd on every request with no caching, high Time to First Byte (TTFB), redundant Edge queries on every page load.
**Recommendation:** Use Next.js ISR for content pages with a reasonable revalidation interval. Use `getStaticPaths` for known pages. Only use full SSR for pages requiring real-time personalization or user-specific content.

### Avoid caching personalized components
**Severity:** Major
**What to verify:** Components that render personalized or user-specific content are NOT served from static cache. Personalized content requires dynamic rendering.
**Issue indicators:** Personalized content showing the same variant to all users (cached), or stale personalization results.
**Recommendation:** Split pages into static and dynamic segments. Use Edge-side personalization (Sitecore Personalize/CDP) or client-side hydration for personalized components. Never ISR/SSG pages with server-side personalization.

### Avoid JavaScript Renderings (server-side)
**Severity:** Minor
**What to verify:** Components don't perform heavy server-side JavaScript computation that blocks rendering. Long-running API calls or data transformations happen asynchronously.
**Issue indicators:** Server components with synchronous external API calls causing timeouts, components fetching large datasets on every render.
**Recommendation:** Use React Server Components efficiently. Cache external API responses. Move heavy computation to build time or background jobs. Set appropriate timeouts on external API calls.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/rendering-host-performance.html
- https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
