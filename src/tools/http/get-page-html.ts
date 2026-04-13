import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Config } from "@/config.js";
import { z } from "zod";
import { safeMcpResponse } from "../../helper.js";

function buildPageUrl(config: Config, url?: string, path?: string, baseUrl?: string): string {
    if (url) {
        return url;
    }

    const resolvedBaseUrl = baseUrl ?? config.pageHtmlBaseUrl ?? config.powershell.serverUrl;
    return new URL(path ?? "/", resolvedBaseUrl).toString();
}

export function getPageHtmlTool(server: McpServer, config: Config) {
    server.tool(
        "get-page-html",
        "Fetches rendered page HTML by absolute URL or by path relative to the configured page HTML base URL.",
        {
            url: z.string().url().optional().describe("The absolute URL of the page to fetch."),
            path: z.string().optional().describe("The page path to fetch, such as '/' or '/about'. Used when 'url' is not provided."),
            baseUrl: z.string().url().optional().describe("The base URL to combine with 'path'. Defaults to PAGE_HTML_BASE_URL, then POWERSHELL_SERVER_URL."),
            timeoutMs: z.number().int().positive().max(60000).default(15000).describe("The request timeout in milliseconds. Defaults to 15000."),
            useConfiguredBasicAuth: z.boolean().default(false).describe("If true, sends Basic authentication using the configured PowerShell username and password."),
        },
        async (params) => safeMcpResponse((async () => {
            const targetUrl = buildPageUrl(config, params.url, params.path, params.baseUrl);
            const headers: Record<string, string> = {};

            if (params.useConfiguredBasicAuth) {
                headers.Authorization = `Basic ${Buffer.from(`${config.powershell.username}:${config.powershell.password}`).toString("base64")}`;
            }

            const response = await fetch(targetUrl, {
                headers,
                signal: AbortSignal.timeout(params.timeoutMs),
            });

            const text = await response.text();
            if (!response.ok) {
                throw new Error(`Error fetching page HTML: ${response.status} ${response.statusText}`);
            }

            return {
                content: [{ type: "text", text }],
                isError: false,
            };
        })())
    );
}