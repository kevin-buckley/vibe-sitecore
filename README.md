# Vibe Sitecore

[![Build](https://github.com/kevin-buckley/vibe-sitecore/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/kevin-buckley/vibe-sitecore/actions/workflows/publish-npm.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Source repository: https://github.com/kevin-buckley/vibe-sitecore

Acknowledgement: Thanks to [Antonytm](https://github.com/Antonytm) for the original work on [mcp-sitecore-server](https://github.com/Antonytm/mcp-sitecore-server), which this project builds on.

Minimal Sitecore MCP server exposing PowerShell-oriented tools plus a bundled migration skills manager.

## Supported tools

This trimmed server intentionally exposes seven tools:

- `skills-manager`: lists, retrieves, and searches bundled XP-to-XM Cloud migration skills with `list`, `get`, and `search` actions.
- `config`: prints the current server configuration.
- `get-page-html`: fetches rendered page HTML by absolute URL or by path relative to the configured page HTML base URL.
- `discover-powershell-commands`: lists available Sitecore PowerShell (SPE) commands.
- `get-powershell-help`: returns full help for a specific SPE command.
- `logging-get-logs`: retrieves Sitecore logs from the log directory.
- `run-powershell-script`: runs a PowerShell script and returns the output.

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
        "POWERSHELL_SERVER_URL": "https://xmcloudcm.localhost/",
        "PAGE_HTML_BASE_URL": "http://localhost:3000"
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
        "POWERSHELL_SERVER_URL": "https://xmcloudcm.localhost/",
        "PAGE_HTML_BASE_URL": "http://localhost:3000"
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
| `POWERSHELL_USERNAME` | No | `admin` | Username used for Sitecore PowerShell Remoting authentication. Also used when `get-page-html` is called with `useConfiguredBasicAuth: true`. |
| `POWERSHELL_PASSWORD` | No | `b` | Password used for Sitecore PowerShell Remoting authentication. Also used when `get-page-html` is called with `useConfiguredBasicAuth: true`. |
| `POWERSHELL_SERVER_URL` | No | `https://xmcloudcm.localhost/` | Base URL for Sitecore PowerShell Remoting. If `PAGE_HTML_BASE_URL` is not set, `get-page-html` falls back to this value. |
| `PAGE_HTML_BASE_URL` | No | `POWERSHELL_SERVER_URL` | Base URL used by `get-page-html` when the tool is called with a relative `path`. For XM Cloud this is usually the rendering host, for example `http://localhost:3000`. |
| `AUTORIZATION_HEADER` | No | empty string | Optional shared secret for HTTP transports. If set, the server requires the incoming `authorization` header to match this value. The variable name is intentionally spelled `AUTORIZATION_HEADER` to match the current implementation. |
| `NODE_REJECT_UNAUTHORIZED` | No | Node.js default | Optional Node.js TLS setting. Set `NODE_REJECT_UNAUTHORIZED=0` only for local development when you need to call self-signed HTTPS endpoints such as local Sitecore CM instances. |

### Transport behavior

- `stdio`: no network port is opened. This is the right choice when the MCP client launches the server process for you.
- `streamable-http`: starts an HTTP MCP endpoint at `http://localhost:3001/mcp`.
- `sse`: starts the legacy SSE transport at `http://localhost:3001/sse` and `http://localhost:3001/messages`.

For `streamable-http` and `sse`, if `AUTORIZATION_HEADER` is set, clients must send that value in the `authorization` header. A `Bearer ` prefix is accepted and stripped before comparison.

### XM Cloud local example

This is the typical local XM Cloud setup:

- `POWERSHELL_SERVER_URL=https://xmcloudcm.localhost/`
- `PAGE_HTML_BASE_URL=http://localhost:3000`

That combination lets PowerShell-oriented tools talk to CM while `get-page-html` fetches rendered HTML from the local rendering host.

### XP local example

For a classic XP CM instance where rendered pages come from the same host, both values can point at CM:

```json
{
  "env": {
    "TRANSPORT": "stdio",
    "POWERSHELL_DOMAIN": "sitecore",
    "POWERSHELL_USERNAME": "superuser",
    "POWERSHELL_PASSWORD": "b",
    "POWERSHELL_SERVER_URL": "https://cm.lighthouse.localhost/",
    "PAGE_HTML_BASE_URL": "https://cm.lighthouse.localhost/"
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
