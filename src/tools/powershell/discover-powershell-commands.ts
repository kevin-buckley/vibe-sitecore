import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { Config } from "@/config.js";
import { safeMcpResponse } from "../../helper.js";
import { z } from "zod";
import { PowershellClient } from "./client.js";
import { buildDiscoverPowershellCommandsScript } from "./discover-powershell-commands-script.js";

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
            return safeMcpResponse((async () => {
                const script = buildDiscoverPowershellCommandsScript(params.filter);
                const client = new PowershellClient(
                    config.powershell.serverUrl,
                    config.powershell.username,
                    config.powershell.password,
                    config.powershell.domain
                );
                const text = await client.executeScriptRaw(script, {});
                return { content: [{ type: "text", text }], isError: false };
            })());
        }
    );
}
