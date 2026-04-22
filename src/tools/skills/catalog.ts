type SkillDefinition = {
    id: string;
    name: string;
    description: string;
    tags: string[];
    triggers: string[];
    body: string;
};

export type Skill = SkillDefinition & {
    content: string;
    source: "bundled";
};

export type SkillSummary = Pick<Skill, "id" | "name" | "description" | "tags" | "triggers">;

export type SkillSearchResult = {
    skill: Skill;
    score: number;
    matchedOn: string[];
    excerpt: string;
};

function block(lines: string[]): string {
    return lines.join("\n").trim();
}

function escapeYaml(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normalizeIdentifier(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function tokenize(value: string): string[] {
    return Array.from(new Set(
        (value.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((token) => token.length >= 2),
    ));
}

function indexOfIgnoreCase(value: string, query: string): number {
    return value.toLowerCase().indexOf(query.toLowerCase());
}

function createExcerpt(text: string, query: string, tokens: string[]): string {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    let matchIndex = normalizedText.indexOf(normalizedQuery);
    let matchLength = normalizedQuery.length;

    if (matchIndex < 0) {
        for (const token of tokens) {
            const tokenIndex = normalizedText.indexOf(token);
            if (tokenIndex >= 0) {
                matchIndex = tokenIndex;
                matchLength = token.length;
                break;
            }
        }
    }

    if (matchIndex < 0) {
        matchIndex = 0;
        matchLength = 0;
    }

    const start = Math.max(matchIndex - 80, 0);
    const end = Math.min(matchIndex + Math.max(matchLength, 40) + 160, text.length);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < text.length ? "..." : "";

    return `${prefix}${text.slice(start, end).replace(/\s+/g, " ").trim()}${suffix}`;
}

function buildContent(skill: SkillDefinition): string {
    return [
        "---",
        `name: ${skill.id}`,
        `description: \"${escapeYaml(skill.description)}\"`,
        "---",
        "",
        skill.body,
    ].join("\n");
}

const skillDefinitions: SkillDefinition[] = [
    {
        id: "migration-playbook",
        name: "Migration Playbook",
        description: "Use when planning or coordinating an XP to XM Cloud migration that spans site structure, templates, components, content, and code. Trigger phrases: migration playbook, XP to XMC migration, migration overview, migration strategy, migration plan.",
        tags: ["migration", "playbook", "overview", "planning", "sitecore", "xm-cloud"],
        triggers: [
            "migration playbook",
            "xp to xmc migration",
            "xp to xm cloud migration",
            "migration overview",
            "migration plan",
            "migration strategy",
        ],
        body: block([
            "# Migration Playbook",
            "",
            "Use this skill first when the task spans multiple migration areas or when you need an overall XP to XM Cloud migration plan.",
            "",
            "## Environment Mapping",
            "",
            "- XP source environment: `sitecore-lighthouse-xp` -> `https://cm.lighthouse.localhost/`",
            "- XM Cloud target environment: `sitecore-xmcloud-cm-local` -> `https://xmcloudcm.localhost/`",
            "- XP source project: `Sitecore.Demo.Platform`",
            "- XM Cloud target/reference project: `xmc-local`",
            "",
            "## Out-of-Scope XP Features",
            "",
            "These XP platform features have no direct XM Cloud equivalent and must be evaluated separately:",
            "- **Content Hub (DAM)**: XP references Sitecore Content Hub assets. XM Cloud has a separate Content Hub connector — do not assume assets migrate automatically.",
            "- **xConnect / Personalization**: xConnect behavioral data and rule-based personalization do not exist in XM Cloud. Evaluate Sitecore CDP or drop.",
            "- **Sitecore Forms**: No direct equivalent. Evaluate XM Cloud Forms, third-party form providers, or rebuild.",
            "- **Marketing Automation**: Campaigns, goals, and engagement plans have no XM Cloud equivalent. Evaluate Sitecore Send or drop.",
            "- **Federated Authentication**: Facebook/Microsoft auth in XP is replaced by Okta/identity provider config in XM Cloud.",
            "",
            "## Non-Negotiable Rules",
            "",
            "1. Rebuild, do not clone.",
            "2. Do not copy Sitecore XP items, packages, serialized trees, or GUIDs straight into XM Cloud.",
            "3. Migrate business behavior and editor outcomes, not SXA or MVC implementation details.",
            "4. Separate authoring structure, rendering host code, integration code, and migration-only utilities.",
            "5. Prefer small verified increments over one-shot migration attempts.",
            "",
            "## Standard Workflow",
            "",
            "1. Inspect the current XP implementation with `sitecore-lighthouse-xp`.",
            "2. Identify what the feature does for editors, visitors, and downstream integrations.",
            "3. Classify the work into site structure, templates, components, content, and code.",
            "4. Define the XM Cloud target model in authoring terms before writing rendering code.",
            "5. Rebuild the rendering host behavior against the new model using Content SDK patterns.",
            "6. Migrate or recreate content only after the target model is stable.",
            "7. Validate URLs, editing workflows, component behavior, integrations, and acceptance criteria.",
            "8. Verify visual parity against the XP reference for every rebuilt page and component. Fetch the XP page HTML or screenshot via `sitecore-lighthouse-xp` and compare to the XMC rendering host output. Styling drift (button shape, eyebrow labels, card-over-image overlap, nav dropdown geometry) will not surface in type checks or test suites — a side-by-side visual compare is the only reliable check.",
            "",
            "## Which Focused Skill To Use Next",
            "",
            "- `site-migration` for site definition, IA, navigation, and route architecture.",
            "- `template-migration` for content model and field mapping.",
            "- `component-migration` for renderings, variants, and datasource-driven UI.",
            "- `content-migration` for pages, datasource items, media, taxonomy, and cleanup rules.",
            "- `code-migration` for MVC code, pipelines, integrations, scripts, and front-end behavior.",
            "- `page-design-setup` for Page Designs, Partial Designs, TemplatesMapping binding, and headless placeholder wiring.",
            "",
            "## What To Capture",
            "",
            "- source items, templates, renderings, and code locations",
            "- target XM Cloud design decisions and accepted deviations",
            "- old-to-new mappings for fields, routes, components, and data flows",
            "- blockers, redesign decisions, and parity criteria",
            "",
            "## Exit Criteria",
            "",
            "The migration is ready to move forward when the target structure, mappings, and acceptance criteria are explicit enough that implementation can proceed without guessing.",
        ]),
    },
    {
        id: "site-migration",
        name: "Site Migration",
        description: "Use when migrating a Sitecore XP site, SXA site setup, tenant or site structure, site settings, page architecture, or information architecture into Sitecore XM Cloud with Sitecore Content SDK. Trigger phrases: migrate site, site migration, SXA site migration, site structure migration, site settings migration, IA migration.",
        tags: ["migration", "site", "sxa", "sitecore", "xm-cloud", "navigation", "ia"],
        triggers: [
            "migrate site",
            "site migration",
            "sxa site migration",
            "site structure migration",
            "site settings migration",
            "ia migration",
        ],
        body: block([
            "# Site Migration",
            "",
            "Use this skill when the task is about moving site-level structure from XP into XM Cloud.",
            "",
            "## Non-Negotiable Rules",
            "",
            "1. Rebuild the site structure in XM Cloud. Do not copy XP site items or GUIDs into the target instance.",
            "2. Do not force one-to-one parity with SXA if XM Cloud and Content SDK support a cleaner approach.",
            "3. Preserve business behavior, URL intent, and editor outcomes. Do not preserve legacy implementation debt without a reason.",
            "",
            "## Primary Goal",
            "",
            "Define how an XP site should exist in XM Cloud across authoring structure, site configuration, page architecture, navigation, and rendering host responsibilities.",
            "",
            "## Recommended Workflow",
            "",
            "1. Use `sitecore-lighthouse-xp` to inspect the XP site definition, site settings, SXA assets, and page structure.",
            "2. Record the business purpose of the site before looking at technical details.",
            "3. Inventory the important site-level elements: site root, navigation model, page types, site settings, dictionary usage, localization, metadata, redirects, and media dependencies.",
            "4. Identify which XP concepts are SXA-specific and should not be copied directly.",
            "5. Design the XM Cloud target structure in terms of authoring items plus Content SDK route rendering.",
            "6. Rebuild the site manually in the XM Cloud authoring model.",
            "7. Validate URL structure, navigation, editing flow, and page composition.",
            "",
            "## XP to XMC Guidance",
            "",
            "- Treat SXA site setup as a source for requirements, not as a deployment artifact.",
            "- Recreate site collections, sites, settings, and route structure intentionally in XM Cloud.",
            "- Keep the page tree and editor experience understandable for authors.",
            "- Move presentation responsibility into the Content SDK rendering host instead of preserving MVC or SXA rendering mechanics.",
            "- Dictionary items in XP SXA map to XM Cloud dictionary domain items — rebuild them in the target site's authoring tree.",
            "- SXA Creative Exchange and theme assets do not migrate; styling is owned by the rendering host.",
            "- Route shared chrome (header, footer, site-wide CTAs) through **Page Designs + Partial Designs** targeting the headless placeholders (`headless-header`, `headless-main`, `headless-footer`). Do not place shared renderings on each page's own Final Renderings. See the `page-design-setup` skill for TemplatesMapping encoding, position rules (`p:before` / `p:after`), and the sub-page architecture pattern.",
        ]),
    },
    {
        id: "template-migration",
        name: "Template Migration",
        description: "Use when migrating Sitecore XP templates, base templates, branch templates, standard values, insert options, or field models into Sitecore XM Cloud. Trigger phrases: migrate template, template migration, field mapping, standard values migration, branch template migration, data template migration.",
        tags: ["migration", "template", "content-model", "fields", "sitecore", "xm-cloud"],
        triggers: [
            "migrate template",
            "template migration",
            "field mapping",
            "standard values migration",
            "branch template migration",
            "data template migration",
        ],
        body: block([
            "# Template Migration",
            "",
            "Use this skill when the task is about rebuilding the XP content model in XM Cloud.",
            "",
            "## Non-Negotiable Rules",
            "",
            "1. Rebuild templates in XM Cloud. Do not copy XP templates and GUIDs directly into the target instance.",
            "2. Do not preserve field clutter just because it exists in XP.",
            "3. Design templates around the new authoring model and the needs of the Content SDK rendering layer.",
            "",
            "## Primary Goal",
            "",
            "Translate the XP content model into a clean XM Cloud template model that supports the target editing and rendering experience.",
            "",
            "## Recommended Workflow",
            "",
            "1. Use `sitecore-lighthouse-xp` to inspect templates, base templates, standard values, insert options, branch templates, and real field usage.",
            "2. Identify which fields are actually used by pages, renderings, and business workflows.",
            "3. Remove legacy or SXA-only technical fields that do not belong in the new solution.",
            "4. Drop fields that supported xConnect personalization, marketing automation, or Sitecore Forms — these do not have equivalents in XM Cloud.",
            "5. Define the target template structure in XM Cloud: base templates, content templates, datasource templates, page templates, and branch templates only where they still help editors.",
            "6. Rebuild standard values and insert options manually in the target model.",
            "7. Document old-to-new field mappings before moving content.",
            "",
            "## Content SDK Considerations",
            "",
            "- Favor field types that map cleanly to Content SDK components such as text, rich text, image, and link fields.",
            "- Support predictable `fields.data.datasource` access patterns in components.",
            "- Keep datasource templates focused and small where possible.",
            "- Make sure the data model supports safe rendering even when optional fields are empty.",
            "- Content Hub asset picker fields from XP do not exist in XM Cloud. Replace with standard Image or File fields backed by XM Cloud's Media Library or a Content Hub connector.",
        ]),
    },
    {
        id: "component-migration",
        name: "Component Migration",
        description: "Use when migrating Sitecore XP renderings, SXA components, rendering variants, datasource-driven UI, or presentation behavior into XM Cloud and a Content SDK rendering host. Trigger phrases: migrate component, rendering migration, SXA component migration, rendering variant migration, datasource component migration.",
        tags: ["migration", "component", "rendering", "variants", "react", "content-sdk"],
        triggers: [
            "migrate component",
            "rendering migration",
            "sxa component migration",
            "rendering variant migration",
            "datasource component migration",
        ],
        body: block([
            "# Component Migration",
            "",
            "Use this skill when the task is about rebuilding an XP rendering as a Content SDK component in XM Cloud.",
            "",
            "## Non-Negotiable Rules",
            "",
            "1. Rebuild components for React and Content SDK. Do not port MVC views, Razor files, or SXA rendering variants line by line.",
            "2. Rebuild datasource definitions and rendering setup in XM Cloud. Do not copy rendering items or GUIDs directly.",
            "3. Keep authoring shape and rendering code aligned, but do not let old implementation constraints dictate the new UI architecture.",
            "4. Create new renderings and datasource templates in XM Cloud via MCP tooling (authoring GraphQL or SPE remoting), not by hand-authored YAML. Use `dotnet sitecore ser pull` only to export already-created items to source control.",
            "",
            "## Primary Goal",
            "",
            "Turn an XP rendering into a clean XM Cloud authoring model plus a Content SDK front-end component.",
            "",
            "## Recommended Workflow",
            "",
            "1. Use `sitecore-lighthouse-xp` to inspect the rendering item, datasource template, placeholder usage, variant behavior, and page usage.",
            "2. Document what the component does for editors and for visitors.",
            "3. Split the task into authoring model work and rendering implementation work.",
            "4. Rebuild the datasource template and rendering definition in XM Cloud.",
            "5. Implement the front-end component in the XM Cloud rendering host using local starter patterns as reference.",
            "6. Register the component and validate editing mode, empty data handling, layout placement, and front-end rendering.",
            "",
            "## Content SDK Guidance",
            "",
            "- Build components around structured datasource fields rather than old HTML fragments.",
            "- Validate `fields?.data?.datasource`.",
            "- Use `NoDataFallback` when data is missing.",
            "- Use safe destructuring and Sitecore field components where applicable.",
            "- Keep client components focused on actual interactivity.",
            "- Register components through the normal XM Cloud starter workflow instead of editing generated artifacts by hand.",
            "- SXA rendering variants collapse into a single React component with variant-aware conditional rendering or separate named components.",
            "- Handle **mixed datasource shapes** when a single rendering is reused across more than one datasource template. Common case: a shared \"Page Teaser\" rendering is bound to Promo-style datasources on some pages and Article-style datasources on others. Detect the shape at the top of the component (e.g. check `fields.PromoText?.value` vs `fields.Title?.value`) and branch the render tree, keeping both branches styled to visual parity. Do not force editors to create a new rendering per datasource template.",
            "- Use `params.styles` (SXA style class multilist) as a lightweight variant switch inside a single component (e.g. `/\\btile\\b/i.test(params?.styles || '')`) when visual variants do not justify separate renderings.",
        ]),
    },
    {
        id: "content-migration",
        name: "Content Migration",
        description: "Use when migrating Sitecore XP content items, datasource items, media, taxonomy, or page content into XM Cloud. Trigger phrases: migrate content, content migration, move content, migrate items, media migration, datasource content migration.",
        tags: ["migration", "content", "media", "taxonomy", "pages", "sitecore", "xm-cloud"],
        triggers: [
            "migrate content",
            "content migration",
            "move content",
            "migrate items",
            "media migration",
            "datasource content migration",
        ],
        body: block([
            "# Content Migration",
            "",
            "Use this skill when the task is about moving authored content from XP into the rebuilt XM Cloud model.",
            "",
            "## Non-Negotiable Rules",
            "",
            "1. Do not copy raw XP items and GUIDs into XM Cloud and call that a migration.",
            "2. Migrate content only after the target site, templates, and components are defined.",
            "3. Move business content into the new model deliberately, even if part of the work is scripted.",
            "",
            "## Primary Goal",
            "",
            "Move the right content into the right rebuilt XM Cloud structure while preserving meaning, editorial intent, and necessary URL continuity.",
            "",
            "## Recommended Workflow",
            "",
            "1. Use `sitecore-lighthouse-xp` to inspect content trees, datasource items, page composition, media usage, and taxonomy.",
            "2. Decide what content is worth migrating versus rewriting, archiving, or dropping.",
            "3. Map source content types to the new XM Cloud templates before importing anything.",
            "4. Recreate or import content into the new structure using mapped fields, not reused IDs.",
            "5. Revalidate links, media references, language versions, workflow expectations, and metadata.",
            "6. Test pages in the rendering host after content is migrated.",
            "",
            "## Special Attention Areas",
            "",
            "- internal links and media links",
            "- redirects for changed URLs",
            "- taxonomy and tagging",
            "- language versions",
            "- publishing and workflow expectations",
            "- page-level versus datasource-level ownership",
            "",
            "## Datasource Organization",
            "",
            "Place datasource items according to sharing scope, not rendering type:",
            "",
            "- **Shared / global datasources** (site-wide CTAs, footer links, nav items, anything edited once and surfaced on many pages): `/sitecore/content/<site>/Data/Shared/`. Bound to renderings on shared Partial Designs so a single edit updates every page that uses the design.",
            "- **Per-page local datasources** (page title, page body text, per-page hero image or feature promo): `<page-item>/Data/`. Bound to that page's Final Renderings. Editors work on them in the context of the page they belong to.",
            "",
            "Use shared datasources for anything that must stay in sync across pages. Use local datasources for anything conceptually owned by one page. Mixing these up — for example, placing a nominally shared CTA under a single page's `./Data/` folder — leads to drift where other pages silently lose the CTA or render stale content.",
            "",
            "## Serialization Workflow",
            "",
            "After creating or editing items in XM Cloud CM via MCP tooling or the authoring UI, export the serialized YAML for source control:",
            "",
            "```",
            "dotnet sitecore ser pull -i \"<module-name>\"",
            "```",
            "",
            "- Do not hand-author YAML stubs for new items. Create via MCP (`run-powershell-script`, authoring GraphQL) or the authoring UI, then pull.",
            "- `dotnet sitecore ser push` is reserved for migrating already-serialized XP items or restoring items from source control — not for creating new XMC items.",
            "- Run `ser pull` immediately after a content change so the committed YAML stays in lockstep with CM state. Drift between CM and serialized YAML is painful to untangle.",
            "",
            "## Out-of-Scope Content",
            "",
            "These XP content types do not migrate directly to XM Cloud:",
            "- **Content Hub assets**: If the XP solution references Sitecore Content Hub (DAM) assets, XM Cloud uses a separate Content Hub connector. Do not assume asset URLs or GUIDs carry over — verify connector availability or plan a re-upload to XM Cloud Media Library.",
            "- **xConnect contact and interaction data**: Behavioral and personalization data stored in xConnect has no XM Cloud equivalent. This data does not migrate.",
            "- **Marketing automation items**: Campaign definitions, engagement plans, goals, and segments from XP have no XM Cloud equivalent — evaluate Sitecore Send, CDP, or drop.",
            "- **Form data and submissions**: Sitecore Forms submission data is not migrated. Evaluate a replacement form solution before migrating form page content.",
        ]),
    },
    {
        id: "code-migration",
        name: "Code Migration",
        description: "Use when migrating Sitecore XP code, MVC renderings, controllers, repositories, integrations, pipelines, scripts, or front-end behavior into XM Cloud and Sitecore Content SDK. Trigger phrases: migrate code, code migration, MVC to Content SDK, XP to Next.js, rendering host migration, pipeline migration.",
        tags: ["migration", "code", "mvc", "pipelines", "integrations", "nextjs", "content-sdk"],
        triggers: [
            "migrate code",
            "code migration",
            "mvc to content sdk",
            "xp to next.js",
            "rendering host migration",
            "pipeline migration",
        ],
        body: block([
            "# Code Migration",
            "",
            "Use this skill when the task is about moving implementation logic from the XP solution into the XM Cloud rendering host and supporting services.",
            "",
            "## Code Classification",
            "",
            "Classify each piece of XP code before deciding what to do with it:",
            "- **Presentation logic** (MVC controllers + .cshtml views) → rebuild as React server components using `@sitecore-content-sdk/nextjs`",
            "- **Data access / repositories** → replace with GraphQL Edge queries via Content SDK",
            "- **Content Hub integration** → evaluate XM Cloud's Content Hub connector; do not port XP DAM integration code directly",
            "- **xConnect / personalization** → no XM Cloud equivalent; evaluate Sitecore CDP or drop entirely",
            "- **Sitecore Forms** → evaluate XM Cloud Forms, a third-party form provider, or rebuild; do not port ASP.NET Forms pipeline code",
            "- **Marketing automation** (campaigns, goals, engagement plans) → no XM Cloud equivalent; evaluate Sitecore Send or drop",
            "- **SPE (PowerShell) scripts** → migration utilities only; do not port operational scripts that depend on XP-specific APIs",
            "- **Pipelines and events** → evaluate whether the behavior is still needed; rebuild as middleware or API routes if so",
            "- **Federated auth** → handled by identity provider config in XM Cloud, not application code",
            "",
            "## Non-Negotiable Rules",
            "",
            "1. Do not copy XP code blindly into the new solution.",
            "2. Do not preserve MVC, pipeline, or SXA implementation patterns that do not belong in a headless XM Cloud architecture.",
            "3. Rebuild code around supported XM Cloud and Content SDK patterns.",
            "",
            "## Primary Goal",
            "",
            "Classify old code correctly and rebuild it in the right place: XM Cloud authoring items, the Content SDK rendering host, an external service or integration layer, or a migration-only utility.",
            "",
            "## Recommended Workflow",
            "",
            "1. Inspect the XP code and classify each behavior as presentation logic, data access logic, integration logic, editor tooling, or pipeline and event behavior.",
            "2. Decide whether the behavior should be rebuilt, redesigned, externalized, or dropped.",
            "3. Rebuild front-end rendering behavior in the XM Cloud rendering host using local starter patterns.",
            "4. Replace Sitecore runtime dependencies with headless-compatible APIs and service boundaries where needed.",
            "5. Validate the rebuilt code against actual XM Cloud authoring data.",
            "",
            "## Content SDK Guidance",
            "",
            "- Prefer server components for data-driven rendering unless interactivity requires client code.",
            "- Use `@sitecore-content-sdk/nextjs` field components and local helper patterns from the rendering host.",
            "- Keep the rendering host aligned with the rebuilt authoring model instead of compensating for legacy XP assumptions.",
            "- Keep integrations and business logic outside presentation components when possible.",
            "- Do not port SXA Creative Exchange themes or SCSS; use the rendering host's styling approach.",
        ]),
    },
    {
        id: "page-design-setup",
        name: "Page Design & Partial Design Setup",
        description: "Use when wiring XM Cloud Page Designs, Partial Designs, TemplatesMapping, headless placeholders, or shared sub-page architecture. Covers the non-obvious platform quirks that burn time: TemplatesMapping URL encoding, why renderings on a Page Design's own Final Renderings do not render, and how to order Partial Designs and position their renderings. Trigger phrases: page design, partial design, templates mapping, headless placeholder, sub page design, shared page design, partial design position, page design final renderings.",
        tags: ["page-design", "partial-design", "templates-mapping", "headless", "placeholders", "xm-cloud", "sxa-headless"],
        triggers: [
            "page design",
            "partial design",
            "templates mapping",
            "templatesmapping",
            "headless placeholder",
            "headless sxa placeholder",
            "sub page design",
            "shared page design",
            "partial design position",
            "partial design order",
            "page design final renderings",
            "p:before",
            "p:after",
        ],
        body: block([
            "# Page Design & Partial Design Setup",
            "",
            "Use this skill when binding templates to Page Designs, composing Partial Designs, or positioning renderings in a Headless SXA site. These are the non-obvious XM Cloud platform behaviors that repeatedly burn time.",
            "",
            "## Mental Model",
            "",
            "- A **Page Design** is a composition item that picks up presentation from one or more **Partial Designs** via its `PartialDesigns` multilist field. Editors do NOT drop renderings onto the Page Design itself.",
            "- A **Partial Design** owns real renderings on its `__Final Renderings` field. Those renderings are what actually merge into a page's layout.",
            "- A **template** is bound to a Page Design via the Page Designs folder's `TemplatesMapping` field (see encoding below). Every page derived from that template inherits the design.",
            "- A **Sub Page template** plus a single SubPage Page Design is the standard pattern for a family of pages that share chrome but diverge in body content.",
            "",
            "## Gotcha: Renderings on a Page Design's own Final Renderings do NOT render",
            "",
            "If you place a rendering directly on the Page Design item's `__Final Renderings`, it will not appear on pages that use the design. The Page Design is a composition item — its own Final Renderings are ignored at merge time.",
            "",
            "**Correct pattern:**",
            "",
            "1. Create a Partial Design item under the site's `/Presentation/Partial Designs` folder.",
            "2. Place the rendering on THAT Partial Design's `__Final Renderings`.",
            "3. Reference the Partial Design from the Page Design's `PartialDesigns` field (pipe-delimited multilist of GUIDs or paths).",
            "",
            "Only renderings reachable through the `PartialDesigns` chain are merged onto the final page.",
            "",
            "## TemplatesMapping encoding (asymmetric double-encoding)",
            "",
            "The `TemplatesMapping` field on a Page Designs folder item binds templates to designs. The encoding is not symmetric and is the single most common foot-gun when scripting this.",
            "",
            "**Rules:**",
            "- Template ID (name side): braces **single-encoded** → `%7b` and `%7d`",
            "- Page Design ID (value side): braces **double-encoded** → `%257B` and `%257D`",
            "- Name/value separator: `%3d` (=)",
            "- Pair separator: `%26` (&)",
            "",
            "**Skeleton:**",
            "",
            "```",
            "%7bTEMPLATE-ID-1%7d%3d%257BDESIGN-ID-1%257D%26%7bTEMPLATE-ID-2%7d%3d%257BDESIGN-ID-2%257D",
            "```",
            "",
            "Using the same encoding on both sides (e.g. `%7b...%7d` on the value) silently fails at mapping resolution — pages render with no design applied and no explicit error. When in doubt, read an existing working `TemplatesMapping` from another Page Designs folder and mimic its encoding exactly.",
            "",
            "## Partial Design ordering and rendering position rules",
            "",
            "Two independent levers control where a Partial Design's renderings land on the merged page:",
            "",
            "1. **Order of GUIDs in the Page Design's `PartialDesigns` field** controls the default relative ordering of each partial's contributions.",
            "2. **`s:Parameters` position attributes on each rendering inside the partial's Final Renderings** control where that rendering lands relative to other renderings in the merged tree. Common values:",
            "   - `p:before=\"*\"` — place this rendering before all other renderings in the same placeholder",
            "   - `p:after=\"*\"` — place this rendering after all other renderings in the same placeholder",
            "   - `p:after=\"r[@uid='{RENDERING-UID}']\"` — place this rendering immediately after a specific rendering from another partial",
            "   - `p:before=\"r[@uid='{RENDERING-UID}']\"` — place this rendering immediately before a specific rendering",
            "",
            "Use `p:before=\"*\"` on a footer-placed rendering when you need content (e.g. a Subscribe CTA) to appear at the very top of the footer region — above the footer carousel and footer itself.",
            "",
            "## Headless SXA canonical placeholder keys",
            "",
            "Headless SXA pages expose three canonical top-level placeholders. Target these from Partial Design renderings:",
            "",
            "- `headless-header` — site header, utility nav, primary nav",
            "- `headless-main` — page body content (Title, Rich Text, Promo, Page Teaser, etc.)",
            "- `headless-footer` — footer carousel, footer, and any site-wide CTAs that should render below the main body",
            "",
            "A rendering lands in `headless-main` by default; to pin a rendering to the footer region, set its placeholder to `headless-footer` and use `p:before=\"*\"` to position it above the default footer content.",
            "",
            "## Final Renderings device ID",
            "",
            "The standard device GUID used in `__Final Renderings` XML for Headless pages:",
            "",
            "```",
            "{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}",
            "```",
            "",
            "All rendering `<d>` elements on XM Cloud Headless SXA sites use this device ID. If you are generating Final Renderings XML programmatically, hardcode this.",
            "",
            "## Shared sub-page architecture pattern",
            "",
            "For a family of pages (e.g. `/at-home/healthy-eating`, `/at-home/sleep-technology`, `/at-work/corporate-wellness`) that share chrome and structure but diverge in body content, use this pattern:",
            "",
            "1. **One Sub Page template** inheriting from the site's base Page template.",
            "2. **One SubPage Page Design** bound to that template via `TemplatesMapping`.",
            "3. **Multiple Partial Designs** referenced by the SubPage Page Design in the correct order, for example: `Header | Subscribe CTA | Footer`.",
            "4. **Shared datasources** (e.g. a global Subscribe CTA item) live under `/sitecore/content/<site>/Data/Shared/` and are referenced by renderings in a shared Partial Design.",
            "5. **Per-page local datasources** live under each page's own `./Data/` folder: `./Data/Title`, `./Data/Body`, `./Data/Feature Promo`. The page's Final Renderings XML wires those local datasources to the renderings that need them.",
            "",
            "This keeps chrome (header, footer, shared CTAs) in one editable location while allowing each sub-page's body content to be authored independently.",
            "",
            "## Recommended Workflow",
            "",
            "1. Inspect an existing working Page Design and its `TemplatesMapping` value before authoring new ones — the encoding pattern is hard to remember from scratch.",
            "2. Sketch the `PartialDesigns` chain (header, body partials, footer) before creating items.",
            "3. Create Partial Designs first, then the Page Design, then the `TemplatesMapping` binding last.",
            "4. When a rendering does not appear on the page, check in this order: (a) is it on a Partial Design, not the Page Design itself? (b) is that Partial Design listed in `PartialDesigns`? (c) is `TemplatesMapping` encoded correctly? (d) does the rendering target a real headless placeholder key?",
            "5. When position is wrong, adjust `p:before` / `p:after` on the rendering in the partial, not the partial order in `PartialDesigns`, for fine-grained control within a single placeholder.",
            "",
            "## Out-of-Scope",
            "",
            "- SXA (XP) Page Designs use a different authoring model; do not transplant XP SXA design items into XM Cloud. Rebuild.",
            "- Traditional MVC layout items and `__Renderings` / `__Final Renderings` on regular Page items still exist in XM Cloud but should not be used for shared chrome — always route shared presentation through Page Designs + Partial Designs.",
        ]),
    },
];

const skillsCatalog: Skill[] = skillDefinitions.map((skill) => ({
    ...skill,
    content: buildContent(skill),
    source: "bundled",
}));

export const SKILLS = skillsCatalog;

export function listSkills(): SkillSummary[] {
    return skillsCatalog.map(({ id, name, description, tags, triggers }) => ({
        id,
        name,
        description,
        tags: [...tags],
        triggers: [...triggers],
    }));
}

export function getSkill(identifier: string): Skill | undefined {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    if (!normalizedIdentifier) {
        return undefined;
    }

    return skillsCatalog.find((skill) =>
        normalizeIdentifier(skill.id) === normalizedIdentifier
        || normalizeIdentifier(skill.name) === normalizedIdentifier,
    );
}

export function searchSkills(query: string, limit = 5): SkillSearchResult[] {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        return [];
    }

    const normalizedQuery = trimmedQuery.toLowerCase();
    const tokens = tokenize(trimmedQuery);

    return skillsCatalog
        .map((skill) => {
            const matchedOn = new Set<string>();
            let score = 0;

            const searchable = {
                id: skill.id.toLowerCase(),
                name: skill.name.toLowerCase(),
                description: skill.description.toLowerCase(),
                tags: skill.tags.join(" ").toLowerCase(),
                triggers: skill.triggers.join(" ").toLowerCase(),
                body: skill.body.toLowerCase(),
                content: skill.content.toLowerCase(),
            };

            if (normalizeIdentifier(skill.id) === normalizeIdentifier(trimmedQuery)) {
                score += 140;
                matchedOn.add("id");
            }

            if (normalizeIdentifier(skill.name) === normalizeIdentifier(trimmedQuery)) {
                score += 120;
                matchedOn.add("name");
            }

            if (searchable.id.includes(normalizedQuery)) {
                score += 60;
                matchedOn.add("id");
            }

            if (searchable.name.includes(normalizedQuery)) {
                score += 55;
                matchedOn.add("name");
            }

            if (searchable.description.includes(normalizedQuery)) {
                score += 40;
                matchedOn.add("description");
            }

            if (searchable.tags.includes(normalizedQuery)) {
                score += 30;
                matchedOn.add("tags");
            }

            if (searchable.triggers.includes(normalizedQuery)) {
                score += 35;
                matchedOn.add("triggers");
            }

            if (searchable.body.includes(normalizedQuery)) {
                score += 18;
                matchedOn.add("content");
            }

            for (const token of tokens) {
                if (searchable.id.includes(token)) {
                    score += 16;
                    matchedOn.add("id");
                }

                if (searchable.name.includes(token)) {
                    score += 14;
                    matchedOn.add("name");
                }

                if (searchable.description.includes(token)) {
                    score += 8;
                    matchedOn.add("description");
                }

                if (searchable.tags.includes(token)) {
                    score += 7;
                    matchedOn.add("tags");
                }

                if (searchable.triggers.includes(token)) {
                    score += 9;
                    matchedOn.add("triggers");
                }

                if (searchable.body.includes(token)) {
                    score += 3;
                    matchedOn.add("content");
                }
            }

            const allCoreTokensMatched = tokens.length > 0
                && tokens.every((token) =>
                    searchable.name.includes(token)
                    || searchable.description.includes(token)
                    || searchable.tags.includes(token)
                    || searchable.triggers.includes(token),
                );

            if (allCoreTokensMatched) {
                score += 18;
            }

            if (skill.id === "migration-playbook"
                && tokens.some((token) => ["playbook", "plan", "overview", "strategy"].includes(token))) {
                score += 20;
                matchedOn.add("tags");
            }

            if (score <= 0) {
                return undefined;
            }

            const excerptSource = [skill.description, skill.body, skill.content].find((value) =>
                indexOfIgnoreCase(value, trimmedQuery) >= 0 || tokens.some((token) => indexOfIgnoreCase(value, token) >= 0),
            ) ?? skill.description;

            return {
                skill,
                score,
                matchedOn: Array.from(matchedOn),
                excerpt: createExcerpt(excerptSource, trimmedQuery, tokens),
            } satisfies SkillSearchResult;
        })
        .filter((result): result is SkillSearchResult => Boolean(result))
        .sort((left, right) => {
            if (right.score !== left.score) {
                return right.score - left.score;
            }

            return left.skill.id.localeCompare(right.skill.id);
        })
        .slice(0, limit);
}