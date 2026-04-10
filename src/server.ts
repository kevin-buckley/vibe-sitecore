import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Config } from "./config.js";
import { registerAll } from "./register.js";



export async function getServer(config: Config): Promise<McpServer> {
    const server = new McpServer({
        name: `Vibe Sitecore MCP Server: ${config.name}`,
        description: "Minimal Vibe Sitecore MCP server exposing PowerShell tools plus a bundled migration skills manager.",
        version: config.version || "0.0.1",
    });

    server.tool(
        "config",
        "Prints the configuration of the Vibe Sitecore MCP server.",
        {},
        async (params) => {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(config, null, 2)
                    }
                ]
            };
        }
    );

    await registerAll(server, config);

    return server;
}
