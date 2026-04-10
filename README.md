# Vibe Sitecore

[![Build](https://github.com/kevin-buckley/vibe-sitecore/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/kevin-buckley/vibe-sitecore/actions/workflows/publish-npm.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Source repository: https://github.com/kevin-buckley/vibe-sitecore

Acknowledgement: Thanks to [Antonytm](https://github.com/Antonytm) for the original work on [mcp-sitecore-server](https://github.com/Antonytm/mcp-sitecore-server), which this project builds on.

Minimal Sitecore MCP server exposing PowerShell-oriented tools plus a bundled migration skills manager.

## Supported tools

This trimmed server intentionally exposes only six tools:

- `skills-manager`: lists, retrieves, and searches bundled XP-to-XM Cloud migration skills with `list`, `get`, and `search` actions.
- `config`: prints the current server configuration.
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

## Installation

Add the following Model Context Protocol server to your Cursor, VS Code, Claude:

```json
    "Vibe Sitecore": {
        "type": "stdio",
        "command": "npx",
        "args": ["vibe-sitecore@latest"],
        "env": {
          "TRANSPORT": "stdio",
          "POWERSHELL_DOMAIN": "sitecore",
          "POWERSHELL_USERNAME": "admin",
          "POWERSHELL_PASSWORD": "b",
          "POWERSHELL_SERVER_URL": "https://xmcloudcm.localhost/",
        }
    }
```

### Environment Variables Description

- `TRANSPORT`: The transport protocol to use. Options are `streamable-http`, `stdio` or `sse`.
- `POWERSHELL_DOMAIN`: The domain for the Sitecore PowerShell Remoting API authentication. Default is `sitecore`.
- `POWERSHELL_USERNAME`: The username for the Sitecore PowerShell Remoting API authentication.
- `POWERSHELL_PASSWORD`: The password for the Sitecore PowerShell Remoting API authentication.
- `POWERSHELL_SERVER_URL`: The base URL for the Sitecore PowerShell Remoting API.
- `AUTORIZATION_HEADER`: Optional. If set, it will be used as an authorization header for access to the server. MCP server will expect `authorization` header to be passed with the value of this environment variable. If environment variable is not set, the server will not check for the authorization header.

## Docker images

Local Docker builds use the tags `vibe-sitecore-linux` and `vibe-sitecore-windows`.

## Local Installation / Development

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the project
4. Run `npm start` to start the server

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.
