# Changelog

## 2.0.0

### Breaking

**The `skills-manager` tool has been removed.** Calls to it will fail with an unknown-tool error.

The 26 Sitecore skills it served now live in
[kevin-buckley/sitecore-skills](https://github.com/kevin-buckley/sitecore-skills), restructured to
follow the [Agent Skills specification](https://agentskills.io/specification). Install them there
instead — see that repo's [README](https://github.com/kevin-buckley/sitecore-skills#install).

Agents that support Agent Skills natively (Claude Code, Claude, Cursor, Copilot, Codex, Gemini CLI,
OpenCode, Goose and others) load them directly, with progressive disclosure and automatic
activation, rather than needing the model to call `list` and then `get`.

Skill ids gained a `sitecore-` prefix in the move, so names that were previously generic no longer
collide with skills installed from elsewhere:

| Before | After |
| --- | --- |
| `migration-playbook` | `sitecore-migration-playbook` |
| `security` | `sitecore-security` |
| `workflow` | `sitecore-workflow` |
| `media` | `sitecore-media` |
| ... | every skill is prefixed `sitecore-` |

### Changed

`vibe-sitecore` now exposes five tools, all PowerShell-oriented: `config`,
`run-powershell-script`, `discover-powershell-commands`, `get-powershell-help`, and
`logging-get-logs`. Server, package and registry descriptions updated to match.

## 1.3.5 and earlier

See the [commit history](https://github.com/kevin-buckley/vibe-sitecore/commits/main).
