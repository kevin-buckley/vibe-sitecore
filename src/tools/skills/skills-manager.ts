import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { Config } from "@/config.js";
import { safeMcpResponse } from "@/helper.js";
import { getSkill, listSkills, searchSkills } from "./catalog.js";
import { z } from "zod";

function formatListResponse(): string {
    const skills = listSkills();

    return [
        `Bundled migration skills (${skills.length})`,
        "",
        ...skills.map((skill) => `${skill.id}: ${skill.description}`),
        "",
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
        "Lists, retrieves, and searches bundled XP-to-XM Cloud migration skills. Use action=list to see available skills, action=get to retrieve a specific skill, or action=search to find the most relevant skills for a migration task.",
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