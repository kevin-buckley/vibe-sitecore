import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { Config } from "@/config.js";
import { z } from "zod";
import { PowershellClient } from "./client.js";

export function discoverPowershellCommandsTool(server: McpServer, config: Config) {
    server.tool(
        "discover-powershell-commands",
        "Lists available Sitecore PowerShell (SPE) commands. Use this to discover what commands are available before using get-powershell-help to drill into a specific command.",
        {
            filter: z.string()
                .optional()
                .describe("Optional wildcard filter on noun to narrow results, e.g. 'Item' or 'Rendering'. If omitted, all SPE commands are returned."),
        },
        async (params) => {
            const noun = params.filter ? `"*${params.filter}*"` : '"*Item*, *Template*, *Rendering*, *Layout*, *Publish*, *Role*, *User*, *Index*, *Archive*, *Workflow*, *Clone*, *Field*, *Language*, *Package*, *Acl*"';
            const script = `Get-Command -Noun ${noun} | Select-Object Name, CommandType | Sort-Object Name | ConvertTo-Json`;
            const client = new PowershellClient(
                config.powershell.serverUrl,
                config.powershell.username,
                config.powershell.password,
                config.powershell.domain
            );
            const text = await client.executeScriptRaw(script, {});
            return { content: [{ type: "text", text }], isError: false };
        }
    );
}
