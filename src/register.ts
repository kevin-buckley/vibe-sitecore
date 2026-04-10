import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Config } from "./config.js";

import { runPowershellScriptTool } from "./tools/powershell/run-powershell-script.js";
import { discoverPowershellCommandsTool } from "./tools/powershell/discover-powershell-commands.js";
import { getPowershellHelpTool } from "./tools/powershell/get-powershell-help.js";
import { getLogsPowerShellTool } from "./tools/powershell/composite/logging/get-logs.js";
import { skillsManagerTool } from "./tools/skills/skills-manager.js";

export async function register(array: Array<(server: McpServer, config: Config) => void>,
    server: McpServer,
    config: Config) {
    for (const register of array) {
        await register(server, config);
    }
}

export async function registerAll(server: McpServer, config: Config) {
    await register([
        skillsManagerTool,
        runPowershellScriptTool,
        discoverPowershellCommandsTool,
        getPowershellHelpTool,
        getLogsPowerShellTool,
    ], server, config);
}
