---
name: headless-graphql
description: "Audit GraphQL configuration and security in Sitecore XM Cloud: endpoints, authorization, DoS prevention, caching, custom schemas. Trigger phrases: GraphQL audit, endpoint security, query bomb prevention, GraphQL caching, schema review."
category: project-review
---

# Headless GraphQL

Use this skill to audit GraphQL configuration and security in a Sitecore XM Cloud SXA Headless project.

## Checks

### Endpoints
**Severity:** Minor
**What to verify:** GraphQL endpoints are properly configured — the rendering host targets the correct endpoint (Experience Edge for delivery, CM endpoint for preview/editing).
**Issue indicators:** Rendering host querying the CM directly in production (bypassing Edge CDN), wrong endpoint URLs in configuration.
**Recommendation:** Production: query Experience Edge endpoint. Preview/editing: query CM's layout service or Edge preview endpoint. Store endpoints in environment configuration.

### Stitching
**Severity:** Minor
**What to verify:** If custom GraphQL schemas are stitched, they are properly merged without conflicts and don't expose unintended data.
**Issue indicators:** Schema conflicts, fields from different schemas colliding, unexpected data exposure through stitched schemas.
**Recommendation:** If using schema stitching or federation, validate the merged schema. Prefer Content SDK's built-in schema access over custom stitching where possible.

### Mutations
**Severity:** Major
**What to verify:** GraphQL mutations (if exposed) are properly secured and not accessible to unauthenticated clients on public endpoints.
**Issue indicators:** Mutation endpoints accessible without authentication, allowing unauthorized content modifications.
**Recommendation:** Mutations should only be available on authenticated CM endpoints, never on public Edge endpoints. Validate that Experience Edge (read-only by design) is used for public delivery.

### Authorization
**Severity:** Major
**What to verify:** GraphQL access is properly authorized. Public endpoints only expose published content. Authenticated endpoints require valid credentials.
**Issue indicators:** Draft/unpublished content visible via public endpoints, API keys granting excessive permissions.
**Recommendation:** Verify Experience Edge only serves published content. Ensure API keys have minimal required permissions. Use Edge tokens with appropriate scopes.

### GraphiQL UI Disabled
**Severity:** Major
**What to verify:** The GraphiQL interactive UI is disabled on production CM instances and not accessible publicly.
**Issue indicators:** GraphiQL accessible at `/sitecore/api/graph/items/ui` or `/api/graphql/ide` on production, allowing schema introspection and arbitrary queries by anyone.
**Recommendation:** Disable GraphiQL on production. In XMC, the CM is not publicly accessible by default, but verify no public proxy exposes it.

### Preventing DoS attacks (query bombs)
**Severity:** Major
**What to verify:** Query complexity limits and depth restrictions are in place to prevent malicious deeply-nested or infinitely recursive queries.
**Issue indicators:** No query depth limits configured, possibility of recursive fragment queries consuming server resources.
**Recommendation:** Experience Edge has built-in protections. For custom CM endpoints, configure max query depth and complexity limits.

### Custom GraphQL Schemas
**Severity:** Minor
**What to verify:** Custom schema extensions follow XMC conventions and don't conflict with OOTB schemas. Custom resolvers are efficient and don't introduce N+1 query problems.
**Issue indicators:** Custom schemas that shadow built-in types, resolvers making excessive database calls.
**Recommendation:** Keep custom schemas in their own namespace. Use DataLoader patterns in custom resolvers to prevent N+1 problems.

### Caching and Whitelisting
**Severity:** Minor
**What to verify:** Frequently-executed queries benefit from caching. In production, consider persisted/whitelisted queries if the platform supports them.
**Issue indicators:** Identical queries executed on every request with no caching layer, high Edge query volume for unchanged content.
**Recommendation:** Leverage Experience Edge's built-in CDN caching. For the rendering host, use ISR (Incremental Static Regeneration) or server-side caching to avoid redundant Edge queries.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/graphql-overview.html
- https://doc.sitecore.com/xmc/en/developers/xm-cloud/experience-edge-for-xm.html
