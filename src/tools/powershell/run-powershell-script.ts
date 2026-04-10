import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { safeMcpResponse } from "@/helper.js";
import type { Config } from "@/config.js";
import { z } from "zod";
import { PowershellClient } from "./client.js";

export function runPowershellScriptTool(server: McpServer, config: Config) {
    server.tool(
        "run-powershell-script",
        "Runs a PowerShell script and returns the output.",
        {
            script: z.string()
                .describe("The Powershell script to run."),
        },
        async (params) => {
            return safeMcpResponse((async () => {
                const client = new PowershellClient(
                    config.powershell.serverUrl,
                    config.powershell.username,
                    config.powershell.password,
                    config.powershell.domain
                );
                const text = await client.executeScriptRaw(params.script, {});
                return {
                    content: [{ type: "text", text }],
                    isError: false,
                };
            })());
        }
    );
}
