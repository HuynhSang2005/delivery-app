# Context7 Setup Guide

Context7 is a documentation MCP that gives AI agents access to library documentation. It lets the agent find up-to-date information about the packages in your project.

## Prerequisites

You need OpenCode with the oh-my-opencode plugin installed.

## Setup (Windows PowerShell)

Run this command in a PowerShell terminal to set your API key permanently at the user level.

```powershell
[Environment]::SetEnvironmentVariable("CONTEXT7_API_KEY", "ctx7sk-04e29f14-aa31-41e2-b375-a79619e74461", "User")
```

After you run this, restart your terminal and OpenCode. The change won't take effect until you do.

## Verification

Check if the variable is set in your current session:

```powershell
$env:CONTEXT7_API_KEY
```

Check the persistent value in your user profile:

```powershell
[Environment]::GetEnvironmentVariable("CONTEXT7_API_KEY", "User")
```

## Usage

Once set, AI agents in OpenCode can use the Context7 MCP to query documentation for any library. This helps with writing accurate code and following the latest best practices.
