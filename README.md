# Hatchable MCP

[![MCP Registry](https://img.shields.io/badge/MCP_Registry-com.hatchable%2Fhatchable-blue)](https://registry.modelcontextprotocol.io/v0/servers?search=hatchable)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Build and host full-stack web apps and sites on Hatchable from any MCP client. Every project gets its own Postgres database, auth, storage, domains, and cron — plus a live URL in seconds. Free tier, no credits.

| | |
|---|---|
| **Endpoint** | `https://hatchable.com/mcp` |
| **Transport** | Streamable HTTP (MCP 2025-03-26) |
| **Authentication** | OAuth 2.1 with PKCE and Dynamic Client Registration (RFC 7591). Bearer fallback. |
| **Registry** | [`com.hatchable/hatchable`](https://registry.modelcontextprotocol.io/v0/servers?search=hatchable) |
| **Homepage** | [hatchable.com](https://hatchable.com) |
| **Docs** | [hatchable.com/docs](https://hatchable.com/docs) |

This repo is a thin connector — Hatchable's code runs on our infrastructure, not yours. There's nothing to install locally. You configure the endpoint in your MCP client and sign in with OAuth (or a bearer token).

## Setup by client

### Claude Code (terminal)

One command, OAuth handles the rest:

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

Any client that supports Streamable HTTP + OAuth will work. Configure `https://hatchable.com/mcp` as the endpoint and let the client handle the OAuth dance. Clients that only support bearer tokens should send `Authorization: Bearer <API_KEY>`, where the key comes from [the console](https://hatchable.com/console/settings?tab=api-keys). Clients that send no auth at all will receive a pending key on first `initialize` that they can persist for future calls.

## What you can do (tool surface)

Hatchable exposes 30+ tools. Highlights:

- **Project lifecycle** — `create_project`, `get_project`, `list_projects`, `fork_project`, `set_visibility`, `update_project`
- **Files** — `write_file`, `write_files`, `read_file`, `grep`, `list_files`, `patch_file`, `delete_file`, `import_file_from_url`, `upload_file`
- **Database** — `execute_sql`, `get_schema`
- **Deploy + observability** — `deploy`, `dry_run_deploy`, `run_function`, `run_code`, `view_logs`, `list_deployments`, `get_deployment`, `list_functions`, `list_cron_jobs`
- **Environment** — `set_env`, `list_env`, `delete_env`
- **Discovery** — `search_projects`, `search_documentation`

Each project ships with Node.js 20, a dedicated Postgres database, built-in auth (email + OAuth providers), cron scheduling, object storage, and email sending. See [hatchable.com/docs](https://hatchable.com/docs) for the full SDK and handler contract.

## Manifests

- [`server.json`](./server.json) — MCP Registry manifest (schema version 2025-12-11), also served at [`hatchable.com/server.json`](https://hatchable.com/server.json) and [`hatchable.com/.well-known/mcp/server.json`](https://hatchable.com/.well-known/mcp/server.json).
- [`smithery.yaml`](./smithery.yaml) — Smithery submission config.

## Security and auth

- OAuth metadata (RFC 8414): [`/.well-known/oauth-authorization-server`](https://hatchable.com/.well-known/oauth-authorization-server)
- Protected-resource metadata (RFC 9728): [`/.well-known/oauth-protected-resource`](https://hatchable.com/.well-known/oauth-protected-resource)
- Dynamic Client Registration (RFC 7591) is supported — MCP clients can register themselves automatically.

Bearer tokens are scoped per-account. You can rotate or revoke them in [the console](https://hatchable.com/console/settings?tab=api-keys).

## License

MIT. See [`LICENSE`](./LICENSE).

## Contact

- **Website:** [hatchable.com](https://hatchable.com)
- **Email:** hello@hatchable.com
- **Issues:** file an issue in this repo for MCP-integration questions; use the in-console support flow for account or billing questions.
