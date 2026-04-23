# Thin stdio-to-HTTP proxy for Hatchable MCP.
#
# The real MCP server runs at https://hatchable.com/mcp (Streamable HTTP
# transport, OAuth 2.1 + PKCE + DCR, bearer fallback). This image exists
# only so registries and quality scanners (Glama, Smithery, etc.) that
# expect a runnable container can introspect the tool surface.
#
# At runtime, `mcp-remote` bridges stdio ↔ HTTP and forwards every
# JSON-RPC message to the live service. A client running this image
# sees the same protocol it would see talking to hatchable.com/mcp
# directly, including the anonymous auto-provisioning flow (on
# `initialize` with no Authorization header, the server mints a pending
# API key the client can persist for subsequent calls).

FROM node:20-alpine

RUN apk add --no-cache ca-certificates

RUN npm install -g mcp-remote@latest

ENV HATCHABLE_MCP_URL=https://hatchable.com/mcp

ENTRYPOINT ["npx", "--yes", "mcp-remote", "https://hatchable.com/mcp"]
