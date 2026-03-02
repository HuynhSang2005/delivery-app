# MCP Setup Guide — delivery-app

Five MCP servers are configured for this project. Each gives AI agents specialized capabilities beyond basic file editing.

## MCP Servers
| Server | Type | Purpose |
| :--- | :--- | :--- |
| `serena` | local | Code analysis — symbol search, find references, LSP tools across 30+ languages |
| `tavily` | local | Real-time web search — current docs, news, troubleshooting |
| `mobile-mcp` | local | Mobile automation — interact with Android/iOS devices and emulators |
| `exa` | remote | Web and code search — GitHub examples, official docs, Stack Overflow |
| `chrome-devtools` | local | Browser DevTools — debug Next.js, profile performance, inspect network |

> **TanStack** (Query, Router, Table, Form): Documentation is served by Context7, bundled with oh-my-opencode. No separate MCP needed.
---
## Prerequisites
### Required for all MCPs
- **Node.js v20+** with `npx` — verify: `node --version`
### Serena (code analysis)
Requires `uv` (Python package manager):
```powershell
# Install uv on Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```
Verify: `uv --version`
### Mobile Next (mobile automation)
- **Android Studio** already installed ✅
- Verify Android SDK is in PATH: `adb --version`
- Connect a device or start an emulator before using this MCP
### Chrome DevTools (browser debugging)
- **Google Chrome** must be installed
- Verify: `chrome --version` (or check Start Menu)
---
## API Key Setup
Two MCPs require API keys. Add them to your environment (NOT to `.env.example`):

### Windows (PowerShell — persistent)
```powershell
[Environment]::SetEnvironmentVariable("TAVILY_API_KEY", "your-tavily-key", "User")
[Environment]::SetEnvironmentVariable("EXA_API_KEY", "your-exa-key", "User")
```
Restart terminal and OpenCode after setting.

### Verify
```powershell
$env:TAVILY_API_KEY   # Should show your Tavily key
$env:EXA_API_KEY      # Should show your Exa key
```

### Get API Keys
- **Tavily**: https://tavily.com → Sign up → API Keys
- **Exa**: https://dashboard.exa.ai/api-keys → Sign up → Create key

> The Exa MCP works without a key (free tier). A key removes rate limits.
---
## Troubleshooting
**Serena fails to start**
```
Error: uvx not found
```
→ Install `uv` (see Prerequisites above). Restart terminal after install.

**Mobile Next: no devices found**
```
mobile_list_available_devices → empty
```
→ Start Android emulator in Android Studio, or connect a physical device via USB with debugging enabled.

**Tavily: authentication error**
```
Error: 401 Unauthorized
```
→ Set `TAVILY_API_KEY` as a persistent env var (see API Key Setup above). Restart OpenCode.

**Chrome DevTools: connection refused**
→ Ensure Chrome is installed. The MCP launches Chrome automatically — check Task Manager if Chrome is already running with conflicting flags.

**All MCPs: not appearing in OpenCode**
→ Restart OpenCode after any `opencode.json` changes. MCP configs are loaded at startup.
---
## Configuration Reference
All MCPs are configured in `opencode.json`:
- Serena: `type: "local"`, uses `uvx`
- Tavily: `type: "local"`, uses `npx mcp-remote` with `TAVILY_API_KEY` env var
- Mobile Next: `type: "local"`, uses `npx @mobilenext/mobile-mcp@latest`
- Exa: `type: "remote"`, URL `https://mcp.exa.ai/mcp`
- Chrome DevTools: `type: "local"`, uses `npx chrome-devtools-mcp@latest`

See `AGENTS.md` for which agents use which MCPs.
