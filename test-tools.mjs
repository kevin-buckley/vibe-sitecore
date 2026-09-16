/**
 * Integration test for the core vibe-sitecore MCP tools.
 * Usage: node test-tools.mjs
 * Requires the Sitecore environment to be running at cm.lighthouse.localhost
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

const ENV = {
    TRANSPORT: "stdio",
    POWERSHELL_DOMAIN: "sitecore",
    POWERSHELL_USERNAME: "superuser",
    POWERSHELL_PASSWORD: "b",
    POWERSHELL_SERVER_URL: "https://cm.lighthouse.localhost/",
};

const BUNDLE = new URL("./dist/bundle.js", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

let passed = 0;
let failed = 0;

function result(name, ok, detail) {
    if (ok) {
        console.log(`  ✅  ${name}`);
        passed++;
    } else {
        console.log(`  ❌  ${name}: ${detail}`);
        failed++;
    }
}

async function main() {
    console.log("\n=== vibe-sitecore tool tests ===\n");

    const transport = new StdioClientTransport({
        command: "node",
        args: [BUNDLE],
        env: { ...process.env, ...ENV },
    });

    const client = new Client({ name: "test-client", version: "1.0.0" });
    await client.connect(transport);

    // ── 1. List tools ──────────────────────────────────────────────────────────
    console.log("Listing tools...");
    const { tools } = await client.listTools();
    const toolNames = tools.map(t => t.name);
    console.log("  Found:", toolNames.join(", "), "\n");

    const EXPECTED = ["config", "discover-powershell-commands", "get-powershell-help", "logging-get-logs", "run-powershell-script"];
    for (const name of EXPECTED) {
        result(`tool registered: ${name}`, toolNames.includes(name), "not found in list");
    }
    console.log();

    // ── 2. config ─────────────────────────────────────────────────────────────
    console.log("Testing: config");
    try {
        const r = await client.callTool({ name: "config", arguments: {} });
        const text = r.content?.[0]?.text ?? "";
        const cfg = JSON.parse(text);
        result("config returns valid JSON with powershell block", !!cfg.powershell, `got: ${text.slice(0, 80)}`);
        result("config serverUrl matches env", cfg.powershell?.serverUrl === ENV.POWERSHELL_SERVER_URL, cfg.powershell?.serverUrl);
    } catch (e) {
        result("config", false, e.message);
    }
    console.log();

    // ── 3. discover-powershell-commands ───────────────────────────────────────
    console.log("Testing: discover-powershell-commands");
    try {
        const r = await client.callTool({ name: "discover-powershell-commands", arguments: { filter: "Item" } });
        const text = r.content?.[0]?.text ?? "";
        result("discover-powershell-commands returns content", text.length > 0, "empty response");
        result("discover-powershell-commands contains Item commands", text.includes("Item"), `got: ${text.slice(0, 80)}`);
    } catch (e) {
        result("discover-powershell-commands", false, e.message);
    }
    console.log();

    // ── 4. get-powershell-help ────────────────────────────────────────────────
    console.log("Testing: get-powershell-help");
    try {
        const r = await client.callTool({ name: "get-powershell-help", arguments: { command: "Get-Item" } });
        const text = r.content?.[0]?.text ?? "";
        result("get-powershell-help returns content", text.length > 0, "empty response");
        result("get-powershell-help mentions Get-Item", text.toLowerCase().includes("get-item"), `got: ${text.slice(0, 80)}`);
    } catch (e) {
        result("get-powershell-help", false, e.message);
    }
    console.log();

    // ── 5. logging-get-logs ───────────────────────────────────────────────────
    console.log("Testing: logging-get-logs");
    try {
        const r = await client.callTool({ name: "logging-get-logs", arguments: { name: "log", tail: 10 } });
        const text = r.content?.[0]?.text ?? "";
        result("logging-get-logs returns content", text.length > 0, "empty response");
    } catch (e) {
        result("logging-get-logs", false, e.message);
    }
    console.log();

    // ── 6. run-powershell-script ──────────────────────────────────────────────
    console.log("Testing: run-powershell-script");
    try {
        const r = await client.callTool({ name: "run-powershell-script", arguments: { script: 'Get-Item -Path "master:/sitecore/content" | Select-Object Name | ConvertTo-Json' } });
        const text = r.content?.[0]?.text ?? "";
        result("run-powershell-script returns content", text.length > 0, "empty response");
        result("run-powershell-script result contains sitecore", text.toLowerCase().includes("sitecore") || text.includes("content"), `got: ${text.slice(0, 120)}`);
    } catch (e) {
        result("run-powershell-script", false, e.message);
    }
    console.log();

    await client.close();

    console.log(`=== Results: ${passed} passed, ${failed} failed ===\n`);
    process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
    console.error("Fatal:", e.message);
    process.exit(1);
});
