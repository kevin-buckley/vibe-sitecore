import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type SkillCategory = "migration" | "project-review" | "uncategorized";

export type Skill = {
    id: string;
    name: string;
    description: string;
    category: SkillCategory;
    tags: string[];
    triggers: string[];
    body: string;
    content: string;
    source: "bundled";
};

export type SkillSummary = Pick<Skill, "id" | "name" | "description" | "category" | "tags" | "triggers">;

export type SkillSearchResult = {
    skill: Skill;
    score: number;
    matchedOn: string[];
    excerpt: string;
};

// Resolve the bundled skills directory relative to this file. Works in three layouts:
//   - vitest on TS source: src/tools/skills/catalog.ts -> src/tools/skills/bundled/
//   - tsc-compiled JS:     dist/tools/skills/catalog.js -> dist/tools/skills/bundled/
//   - rollup bundle:       dist/bundle.js               -> dist/bundled/
// The copy-bundled-skills.mjs build step populates the two dist/ locations.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUNDLED_DIR = path.resolve(HERE, "bundled");

function unquote(value: string): string {
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
    }
    return value;
}

function parseInlineArray(value: string): string[] {
    const inner = value.slice(1, -1).trim();
    if (inner.length === 0) {
        return [];
    }

    return inner
        .split(",")
        .map((item) => unquote(item.trim()))
        .filter((item) => item.length > 0);
}

type Frontmatter = Record<string, string | string[]>;

function parseFrontmatter(file: string): { frontmatter: Frontmatter; body: string } {
    const match = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
        return { frontmatter: {}, body: file };
    }

    const [, raw, body] = match;
    const frontmatter: Frontmatter = {};
    for (const line of raw.split(/\r?\n/)) {
        const fieldMatch = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
        if (!fieldMatch) {
            continue;
        }

        const key = fieldMatch[1];
        const value = fieldMatch[2].trim();
        if (value.startsWith("[") && value.endsWith("]")) {
            frontmatter[key] = parseInlineArray(value);
        } else {
            frontmatter[key] = unquote(value);
        }
    }

    return { frontmatter, body: body ?? "" };
}

function asString(value: string | string[] | undefined): string {
    return typeof value === "string" ? value : "";
}

function asCategory(value: string | string[] | undefined): SkillCategory {
    const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
    if (raw === "migration" || raw === "project-review") {
        return raw;
    }

    return "uncategorized";
}

function asStringArray(value: string | string[] | undefined): string[] {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string" && value.length > 0) {
        return [value];
    }

    return [];
}

function titleCase(id: string): string {
    return id
        .split(/[-_]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function escapeYaml(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
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

type CachedEntry = {
    summary: SkillSummary;
    skillPath: string;
    body?: string;
};

function loadIndex(): Map<string, CachedEntry> {
    const cache = new Map<string, CachedEntry>();
    if (!fs.existsSync(BUNDLED_DIR)) {
        return cache;
    }

    const entries = fs.readdirSync(BUNDLED_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
        const skillPath = path.join(BUNDLED_DIR, entry.name, "SKILL.md");
        if (!fs.existsSync(skillPath)) {
            continue;
        }

        const raw = fs.readFileSync(skillPath, "utf8");
        const { frontmatter } = parseFrontmatter(raw);
        const id = asString(frontmatter.name) || entry.name;
        const displayName = asString(frontmatter.displayName) || titleCase(id);
        const description = asString(frontmatter.description);
        const category = asCategory(frontmatter.category);
        const tags = asStringArray(frontmatter.tags);
        const triggers = asStringArray(frontmatter.triggers);

        cache.set(id, {
            summary: { id, name: displayName, description, category, tags, triggers },
            skillPath,
        });
    }

    return cache;
}

const skillCache = loadIndex();

function loadBody(entry: CachedEntry): string {
    if (entry.body !== undefined) {
        return entry.body;
    }

    const raw = fs.readFileSync(entry.skillPath, "utf8");
    const { body } = parseFrontmatter(raw);
    entry.body = body;
    return body;
}

function buildSkill(entry: CachedEntry): Skill {
    const body = loadBody(entry);
    const content = [
        "---",
        `name: ${entry.summary.id}`,
        `description: "${escapeYaml(entry.summary.description)}"`,
        "---",
        "",
        body,
    ].join("\n");

    return {
        ...cloneSummary(entry.summary),
        body,
        content,
        source: "bundled",
    };
}

function cloneSummary(summary: SkillSummary): SkillSummary {
    return {
        ...summary,
        tags: [...summary.tags],
        triggers: [...summary.triggers],
    };
}

function findEntry(identifier: string): CachedEntry | undefined {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    if (!normalizedIdentifier) {
        return undefined;
    }

    for (const entry of skillCache.values()) {
        if (
            normalizeIdentifier(entry.summary.id) === normalizedIdentifier
            || normalizeIdentifier(entry.summary.name) === normalizedIdentifier
        ) {
            return entry;
        }
    }

    return undefined;
}

export function listSkills(): SkillSummary[] {
    return Array.from(skillCache.values()).map((entry) => cloneSummary(entry.summary));
}

export function getSkill(identifier: string): Skill | undefined {
    const entry = findEntry(identifier);
    return entry ? buildSkill(entry) : undefined;
}

export function searchSkills(query: string, limit = 5): SkillSearchResult[] {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        return [];
    }

    const normalizedQuery = trimmedQuery.toLowerCase();
    const tokens = tokenize(trimmedQuery);

    const scored: SkillSearchResult[] = [];

    for (const entry of skillCache.values()) {
        const { summary } = entry;
        const matchedOn = new Set<string>();
        let score = 0;

        const body = loadBody(entry);
        const searchable = {
            id: summary.id.toLowerCase(),
            name: summary.name.toLowerCase(),
            description: summary.description.toLowerCase(),
            tags: summary.tags.join(" ").toLowerCase(),
            triggers: summary.triggers.join(" ").toLowerCase(),
            body: body.toLowerCase(),
        };

        if (normalizeIdentifier(summary.id) === normalizeIdentifier(trimmedQuery)) {
            score += 140;
            matchedOn.add("id");
        }

        if (normalizeIdentifier(summary.name) === normalizeIdentifier(trimmedQuery)) {
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

        if (summary.id === "migration-playbook"
            && tokens.some((token) => ["playbook", "plan", "overview", "strategy"].includes(token))) {
            score += 20;
            matchedOn.add("tags");
        }

        if (score <= 0) {
            continue;
        }

        const excerptSource = [summary.description, body].find((value) =>
            indexOfIgnoreCase(value, trimmedQuery) >= 0 || tokens.some((token) => indexOfIgnoreCase(value, token) >= 0),
        ) ?? summary.description;

        scored.push({
            skill: buildSkill(entry),
            score,
            matchedOn: Array.from(matchedOn),
            excerpt: createExcerpt(excerptSource, trimmedQuery, tokens),
        });
    }

    return scored
        .sort((left, right) => {
            if (right.score !== left.score) {
                return right.score - left.score;
            }

            return left.skill.id.localeCompare(right.skill.id);
        })
        .slice(0, limit);
}
