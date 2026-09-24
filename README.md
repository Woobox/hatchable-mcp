# Hatchable MCP

[![MCP Registry](https://img.shields.io/badge/MCP_Registry-com.hatchable%2Fhatchable-blue)](https://registry.modelcontextprotocol.io/v0/servers?search=hatchable)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Build and host full-stack web apps and sites on Hatchable from any MCP client. Every project gets its own Postgres database, auth, storage, domains, cron and email, plus a live URL in seconds. Free tier, no credits.

This repo is two things: the **Claude Code plugin** for Hatchable (this directory is the plugin), and the connector notes for every other MCP client. Hatchable's code runs on our infrastructure, not yours; there is nothing to build or install locally.

| | |
|---|---|
| **Endpoint** | `https://hatchable.com/mcp` |
| **Transport** | Streamable HTTP (MCP 2025-03-26) |
| **Authentication** | OAuth 2.1 with PKCE and Dynamic Client Registration (RFC 7591). Bearer fallback. |
| **Registry** | [`com.hatchable/hatchable`](https://registry.modelcontextprotocol.io/v0/servers?search=hatchable) |
| **Homepage** | [hatchable.com](https://hatchable.com) |
| **Docs** | [hatchable.com/docs/developers](https://hatchable.com/docs/developers) |

## Claude Code plugin

```
/plugin marketplace add anthropics/claude-plugins-community
/plugin install hatchable@claude-community
```

Then connect your account: run `/mcp`, pick **hatchable**, and complete the sign-in. New accounts are free, and the first app you publish to the open web is free too.

What the plugin adds:

- **The Hatchable MCP server, preconfigured.** 34 tools for creating projects, writing files, running SQL, deploying, reading logs, and forking templates. Full reference at [hatchable.com/docs/developers/mcp](https://hatchable.com/docs/developers/mcp).
- **`/hatchable:new <description>`**: build and deploy an app from a plain-language description. Returns a live URL.
- **`/hatchable:import`**: deploy the repo you are sitting in. Maps your files to the platform structure, runs the validators, and walks any blockers.
- **`/hatchable:fix <what's wrong>`**: diagnose a rejected deploy or a broken live app using the platform's own logs and dry-run validators.
- **The `hatchable:builder` agent**: an app builder Claude can delegate whole build tasks to. It creates, codes, deploys and verifies in the cloud, then hands back the live URL. Mention it with `@hatchable:builder` or let Claude pick it.

A Hatchable project is a folder: paths become routes, SQL files become schema, one TOML file declares the rest. The platform serves its own build patterns to your agent over MCP (`list_skills`, `read_skill`), so Claude reads the current conventions at build time instead of relying on training data.

To try the plugin from a checkout before installing it: `claude --plugin-dir .` in this directory.

## Setup by client

### Claude Code (terminal)

Install the plugin (see above), or add the server directly. OAuth handles the rest:

```bash
claude mcp add --transport http hatchable https://hatchable.com/mcp
```

Don't have Claude Code? [Install it here](https://claude.com/claude-code).

### Claude.ai (web)

1. Open [claude.ai/customize/connectors](https://claude.ai/customize/connectors) and click the **+** next to **Connectors**.
2. In the **Add custom connector** dialog, name it **Hatchable**, paste `https://hatchable.com/mcp`, and click **Add**.
3. Claude redirects you to hatchable.com to approve — that creates your free account.

Works on Free (1 connector), Pro, Max, Team, and Enterprise. On Team/Enterprise, an owner adds it from *Organization settings → Connectors*.

### ChatGPT

1. Open [chatgpt.com/apps#settings/Connectors/Advanced](https://chatgpt.com/apps#settings/Connectors/Advanced), toggle on **Developer Mode**, and click **Create app**.
2. Name it **Hatchable**, paste `https://hatchable.com/mcp` under **MCP Server URL**, keep **OAuth**, tick the consent box, and click **Create**.
3. ChatGPT redirects you to hatchable.com to approve — that creates your free account.

Requires a Plus, Pro, Business, Enterprise, or Edu plan (Developer Mode prerequisite).

### Codex

1. Open Codex → **Settings → MCP servers → + Add server**.
2. Name it **Hatchable**, pick **Streamable HTTP**, paste `https://hatchable.com/mcp`, and **Save**.
3. Click **Authenticate** on the new row and approve the popup on hatchable.com — that creates your free account.

Don't have Codex? [Download it here](https://openai.com/codex).

### Cursor

Paste into `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "hatchable": {
      "url": "https://hatchable.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_HATCHABLE_TOKEN"
      }
    }
  }
}
```

Grab your token from [hatchable.com/console/settings?tab=api-keys](https://hatchable.com/console/settings?tab=api-keys) after signing up (10 seconds, no credit card).

### Google Antigravity

1. Open the Command Palette (**Cmd/Ctrl + Shift + P**).
2. Select **Antigravity: Manage MCP Servers**, then click **View raw config**.
3. Paste and save:

   ```json
   {
     "mcpServers": {
       "hatchable": {
         "serverUrl": "https://hatchable.com/mcp"
       }
     }
   }
   ```
4. Reopen **Manage MCP Servers**, click **Authenticate** on the hatchable row, and approve on hatchable.com.

Don't have Antigravity? [Download from Google](https://antigravity.google) — free, no credit card.

### Other MCP clients

Any client that supports Streamable HTTP + OAuth will work. Configure `https://hatchable.com/mcp` as the endpoint and let the client handle the OAuth dance. Clients that only support bearer tokens should send `Authorization: Bearer <API_KEY>`, where the key comes from [the console](https://hatchable.com/console/settings?tab=api-keys).

## What you can do (tool surface)

34 tools, served live by the endpoint:

- **Project lifecycle**: `create_project`, `get_project`, `list_projects`, `update_project`, `fork_project`, `create_preview_link`
- **Files**: `write_file`, `write_files`, `patch_file`, `read_file`, `grep`, `list_files`, `delete_file`, `upload_file`, `list_pending_uploads`, `import_file_from_url`
- **Database**: `execute_sql`, `get_schema`
- **Deploy and observability**: `dry_run_deploy`, `deploy`, `list_deployments`, `get_deployment`, `list_functions`, `run_function`, `run_code`, `view_logs`, `list_cron_jobs`
- **Agent tasks**: `list_agent_tasks`, `update_agent_task` (plain-language requests the project owner files in the console)
- **Guidance and discovery**: `list_skills`, `read_skill`, `search_documentation`, `search_projects`, `submit_platform_feedback`

Each project ships with a dedicated Postgres database, built-in auth (email code and OAuth providers), cron scheduling, object storage, email sending and AI routing, all reached through the `hatchable` SDK inside your handlers. No `npm install`, no build step. See [hatchable.com/docs/developers](https://hatchable.com/docs/developers) for the SDK and handler contract.

## Manifests

- [`server.json`](./server.json) — MCP Registry manifest (schema version 2025-12-11), also served at [`hatchable.com/server.json`](https://hatchable.com/server.json) and [`hatchable.com/.well-known/mcp/server.json`](https://hatchable.com/.well-known/mcp/server.json).
- [`smithery.yaml`](./smithery.yaml) — Smithery submission config.

## Security and auth

- OAuth metadata (RFC 8414): [`/.well-known/oauth-authorization-server`](https://hatchable.com/.well-known/oauth-authorization-server)
- Protected-resource metadata (RFC 9728): [`/.well-known/oauth-protected-resource`](https://hatchable.com/.well-known/oauth-protected-resource)
- Dynamic Client Registration (RFC 7591) is supported — MCP clients can register themselves automatically.

Bearer tokens are scoped per-account. You can rotate or revoke them in [the console](https://hatchable.com/console/settings?tab=api-keys).

## Docker (for registries and scanners)

The [`Dockerfile`](./Dockerfile) in this repo is a small stdio-to-HTTP proxy ([`proxy.mjs`](./proxy.mjs)). It exists so registries and quality scanners that expect a runnable container (Glama, Smithery, etc.) can introspect the tool surface. End users don't need to build it — configure `https://hatchable.com/mcp` directly in your MCP client and let the client's native HTTP transport talk to the server.

```bash
docker build -t hatchable-mcp .
docker run --rm -i hatchable-mcp  # stdio ↔ https://hatchable.com/mcp
```

## License

MIT. See [`LICENSE`](./LICENSE).

## Contact

- **Website:** [hatchable.com](https://hatchable.com)
- **Email:** hello@hatchable.com
- **Issues:** file an issue in this repo for MCP-integration questions; use the in-console support flow for account or billing questions.
