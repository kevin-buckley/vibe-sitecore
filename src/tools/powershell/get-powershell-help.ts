import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { Config } from "@/config.js";
import { z } from "zod";
import { PowershellClient } from "./client.js";

export function getPowershellHelpTool(server: McpServer, config: Config) {
    server.tool(
        "get-powershell-help",
        "Gets full help for a specific Sitecore PowerShell (SPE) command including parameters, description, and examples. Use discover-powershell-commands first to find the command name.",
        {
            command: z.string()
                .describe("The exact SPE command name to get help for, e.g. 'Get-Item' or 'Publish-Item'."),
        },
        async (params) => {
            const script = `Get-Help ${params.command} -Full | Out-String`;
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
