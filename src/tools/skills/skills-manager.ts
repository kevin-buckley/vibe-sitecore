import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { Config } from "@/config.js";
import { safeMcpResponse } from "@/helper.js";
import { getSkill, listSkills, searchSkills } from "./catalog.js";
import { z } from "zod";

const CATEGORY_DISPLAY: Record<string, { order: number; label: string }> = {
    "migration": { order: 0, label: "Migration playbooks" },
    "project-review": { order: 1, label: "Project review / audits" },
    "uncategorized": { order: 99, label: "Uncategorized" },
};

function formatListResponse(): string {
    const skills = listSkills();
    const grouped = new Map<string, typeof skills>();
    for (const skill of skills) {
        const bucket = grouped.get(skill.category) ?? [];
        bucket.push(skill);
        grouped.set(skill.category, bucket);
    }

    const sortedCategories = Array.from(grouped.keys()).sort((a, b) => {
        const aOrder = CATEGORY_DISPLAY[a]?.order ?? 50;
        const bOrder = CATEGORY_DISPLAY[b]?.order ?? 50;
        return aOrder - bOrder;
    });

    const sections: string[] = [];
    for (const category of sortedCategories) {
        const bucket = grouped.get(category)!;
        const label = CATEGORY_DISPLAY[category]?.label ?? category;
        sections.push(`${label} (${bucket.length}):`, "");
        for (const skill of bucket) {
            sections.push(`- ${skill.id}: ${skill.description}`);
        }
        sections.push("");
    }

    return [
        `Bundled skills (${skills.length})`,
        "",
        ...sections,
        "Use action=get with the skill id to retrieve the full skill content.",
    ].join("\n");
}

function formatGetResponse(skillId: string): string {
    const skill = getSkill(skillId);
    if (!skill) {
        throw new Error(`Unknown skill: ${skillId}`);
    }

    return [
        `Skill: ${skill.id}`,
        `Name: ${skill.name}`,
        `Category: ${skill.category}`,
        `Source: ${skill.source}`,
        `Tags: ${skill.tags.join(", ")}`,
        `Triggers: ${skill.triggers.join(", ")}`,
        "",
        skill.content,
    ].join("\n");
}

function formatSearchResponse(query: string, limit: number): string {
    const results = searchSkills(query, limit);
    if (results.length === 0) {
        return [
            `No skills matched query: ${query}`,
            "",
            "Try broader migration terms such as template, component, content, code, site, playbook, or XM Cloud.",
        ].join("\n");
    }

    return [
        `Skill search results for: ${query}`,
        "",
        ...results.flatMap((result, index) => [
            `${index + 1}. ${result.skill.id}`,
            `   Score: ${result.score}`,
            `   Matched on: ${result.matchedOn.join(", ")}`,
            `   Description: ${result.skill.description}`,
            `   Excerpt: ${result.excerpt}`,
            "",
        ]),
        "Use action=get with one of the skill ids above to retrieve the full skill content.",
    ].join("\n");
}

export function skillsManagerTool(server: McpServer, _config: Config) {
    server.tool(
        "skills-manager",
        "Lists, retrieves, and searches bundled Sitecore skills covering XP-to-XM Cloud migration playbooks and XM Cloud project review/audit checks (data templates, content, presentation, SXA, headless, security, workflow, performance, code quality). Use action=list to see available skills, action=get to retrieve a specific skill, or action=search to find the most relevant skills for a task.",
        {
            action: z.enum(["list", "get", "search"]).describe("The skills-manager action to perform: list, get, or search."),
            skill: z.string().optional().describe("The skill id or friendly skill name to retrieve when action=get, for example 'migration-playbook' or 'component-migration'."),
            query: z.string().optional().describe("The natural-language query to use when action=search."),
            limit: z.number().int().min(1).max(20).default(5).optional().describe("Maximum number of search results to return when action=search. Defaults to 5."),
        },
        async (params) => {
            return safeMcpResponse((async () => {
                switch (params.action) {
                    case "list":
                        return { content: [{ type: "text", text: formatListResponse() }], isError: false };
                    case "get":
                        if (!params.skill?.trim()) {
                            throw new Error("The skill parameter is required when action=get.");
                        }

                        return { content: [{ type: "text", text: formatGetResponse(params.skill) }], isError: false };
                    case "search":
                        if (!params.query?.trim()) {
                            throw new Error("The query parameter is required when action=search.");
                        }

                        return {
                            content: [{ type: "text", text: formatSearchResponse(params.query, params.limit ?? 5) }],
                            isError: false,
                        };
                    default:
                        throw new Error(`Unsupported skills-manager action: ${params.action satisfies never}`);
                }
            })());
        },
    );
}