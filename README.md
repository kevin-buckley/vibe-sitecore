# Vibe Sitecore

[![Build](https://github.com/kevin-buckley/vibe-sitecore/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/kevin-buckley/vibe-sitecore/actions/workflows/publish-npm.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Source repository: https://github.com/kevin-buckley/vibe-sitecore

Acknowledgement: Thanks to [Antonytm](https://github.com/Antonytm) for the original work on [mcp-sitecore-server](https://github.com/Antonytm/mcp-sitecore-server), which this project builds on.

Minimal Sitecore MCP server exposing PowerShell-oriented tools plus a bundled migration skills manager.

## Supported tools

This trimmed server intentionally exposes six tools:

- `skills-manager`: lists, retrieves, and searches bundled XP-to-XM Cloud migration skills with `list`, `get`, and `search` actions.
- `config`: prints the current server configuration.
- `discover-powershell-commands`: lists available Sitecore PowerShell (SPE) commands.
- `get-powershell-help`: returns full help for a specific SPE command.
- `logging-get-logs`: retrieves Sitecore logs from the log directory.
- `run-powershell-script`: runs a PowerShell script and returns the output.

For fetching rendered page HTML, use a browser-automation MCP (for example `chrome-devtools`) against the rendering host instead of bundling that capability here.

The bundled migration skills currently include:

- `migration-playbook`
- `site-migration`
- `template-migration`
- `component-migration`
- `content-migration`
- `code-migration`

### Tools selection

AI Agents may have limit on the amount of tools they can use. Please make sure that you have disabled the tools you don't need. It will make your agent faster, cheaper and more efficient.

## MCP configuration

You can run `vibe-sitecore` either:

- as a `stdio` MCP server launched directly by the client, which is the most common setup for VS Code, Cursor, and Claude Desktop.
- as an HTTP MCP server using `streamable-http`.
- as a legacy SSE server using `sse`.

### Recommended: stdio configuration

For most MCP clients, add a server entry like this:

```json
{
  "servers": {
    "sitecore-xmcloud": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "vibe-sitecore@latest"],
      "env": {
        "TRANSPORT": "stdio",
        "POWERSHELL_DOMAIN": "sitecore",
        "POWERSHELL_USERNAME": "admin",
        "POWERSHELL_PASSWORD": "b",
        "POWERSHELL_SERVER_URL": "https://xmcloudcm.localhost/"
      }
    }
  }
}
```

For local development from a checked-out repo, point the client at the built bundle instead:

```json
{
  "servers": {
    "sitecore-xmcloud": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/Repo/LightHouse/vibe-sitecore/dist/bundle.js"],
      "env": {
        "TRANSPORT": "stdio",
        "POWERSHELL_DOMAIN": "sitecore",
        "POWERSHELL_USERNAME": "superuser",
        "POWERSHELL_PASSWORD": "b",
        "POWERSHELL_SERVER_URL": "https://xmcloudcm.localhost/"
      }
    }
  }
}
```

### All configuration settings

The server reads the following environment variables:

| Setting | Required | Default | Description |
| --- | --- | --- | --- |
| `TRANSPORT` | No | `stdio` | Startup transport. Supported values are `stdio`, `streamable-http`, and `sse`. `sse` is deprecated. |
| `POWERSHELL_DOMAIN` | No | `sitecore` | Domain used for Sitecore PowerShell Remoting authentication. |
| `POWERSHELL_USERNAME` | No | `admin` | Username used for Sitecore PowerShell Remoting authentication. |
| `POWERSHELL_PASSWORD` | No | `b` | Password used for Sitecore PowerShell Remoting authentication. |
| `POWERSHELL_SERVER_URL` | No | `https://xmcloudcm.localhost/` | Base URL for Sitecore PowerShell Remoting. |
| `AUTORIZATION_HEADER` | No | empty string | Optional shared secret for HTTP transports. If set, the server requires the incoming `authorization` header to match this value. The variable name is intentionally spelled `AUTORIZATION_HEADER` to match the current implementation. |
| `NODE_REJECT_UNAUTHORIZED` | No | Node.js default | Optional Node.js TLS setting. Set `NODE_REJECT_UNAUTHORIZED=0` only for local development when you need to call self-signed HTTPS endpoints such as local Sitecore CM instances. |

### Enable Sitecore PowerShell remoting on CM

The `POWERSHELL_*` environment variables are only one side of the setup. Your Sitecore CM must also allow SPE remoting requests to reach the remoting endpoint instead of redirecting them to the normal login flow.

`vibe-sitecore` sends requests to the SPE remoting endpoint at `/-/script/script/` using Basic authentication. On local XM Cloud and other hardened CM setups, the early `Sitecore.Pipelines.HttpRequest.RequireAuthentication` processor can intercept that request and return a login redirect before SPE gets a chance to authenticate it.

If you see remoting calls fail with login HTML, a redirect, or `Error executing script`, add an include patch on the CM instance that exempts the SPE remoting paths from the early `RequireAuthentication` redirect.

Example patch:

```xml
<!-- Local development example. Do not use as-is in production. -->
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/" xmlns:role="http://www.sitecore.net/xmlconfig/role/">
  <sitecore role:require="Standalone or ContentManagement or XMCloud">
    <pipelines>
      <httpRequestBegin>
        <processor type="Sitecore.Pipelines.HttpRequest.RequireAuthentication, Sitecore.Kernel">
          <IgnoreRules>
            <prefix hint="speRemotingAlias">^/-/script/.*</prefix>
            <prefix hint="speServicesEncoded">^/sitecore%20modules/PowerShell/Services/.*</prefix>
            <prefix hint="speServicesDecoded">^/sitecore modules/PowerShell/Services/.*</prefix>
          </IgnoreRules>
        </processor>
      </httpRequestBegin>
    </pipelines>
  </sitecore>
</configuration>
```

Recommended placement is an include patch such as `App_Config/Include/zzz.Dev/Spe.Remoting.Dev.config` so the change is explicit and easy to remove outside local development.

What to do after adding the patch:

1. Deploy or copy the patch to the CM instance.
2. Restart the app pool or recycle the CM container.
3. Set `POWERSHELL_SERVER_URL` to that CM host.
4. Set `POWERSHELL_USERNAME` and `POWERSHELL_PASSWORD` to credentials that can log in to Sitecore.
5. Reconnect your MCP client and call `discover-powershell-commands` or `run-powershell-script` to verify remoting works.

This exception should be treated as a deliberate development-time allowance. Review the exact paths and your security requirements before carrying the same patch into higher environments.

### Transport behavior

- `stdio`: no network port is opened. This is the right choice when the MCP client launches the server process for you.
- `streamable-http`: starts an HTTP MCP endpoint at `http://localhost:3001/mcp`.
- `sse`: starts the legacy SSE transport at `http://localhost:3001/sse` and `http://localhost:3001/messages`.

For `streamable-http` and `sse`, if `AUTORIZATION_HEADER` is set, clients must send that value in the `authorization` header. A `Bearer ` prefix is accepted and stripped before comparison.

### XM Cloud local example

This is the typical local XM Cloud setup:

- `POWERSHELL_SERVER_URL=https://xmcloudcm.localhost/`

### XP local example

For a classic XP CM instance, point `POWERSHELL_SERVER_URL` at CM:

```json
{
  "env": {
    "TRANSPORT": "stdio",
    "POWERSHELL_DOMAIN": "sitecore",
    "POWERSHELL_USERNAME": "superuser",
    "POWERSHELL_PASSWORD": "b",
    "POWERSHELL_SERVER_URL": "https://cm.lighthouse.localhost/"
  }
}
```

### Validate your configuration

After connecting, call the `config` tool to confirm the runtime settings the server resolved from your environment.

## Docker images

Local Docker builds use the tags `vibe-sitecore-linux` and `vibe-sitecore-windows`.

## Local installation / development

1. Clone the repository.
2. Run `npm install`.
3. Run `npm run build`.
4. Start the transport you want:

  - `npm run start:stdio`
  - `npm run start:streamable-http`
  - `npm run start:sse`

If you use the local bundle from an MCP client, build first and point the client at `dist/bundle.js`.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.
