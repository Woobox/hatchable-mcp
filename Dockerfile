# Stdio ↔ HTTP proxy for Hatchable MCP.
#
# The real MCP server runs at https://hatchable.com/mcp (Streamable HTTP
# transport, OAuth 2.1 + PKCE + DCR, bearer fallback). This image exists
# only so registries and quality scanners (Glama, Smithery, etc.) that
# expect a runnable container can introspect the tool surface.
#
# proxy.mjs is a small, dependency-free stdio-to-HTTP bridge. On
# `initialize` with no Authorization header, the server auto-mints a
# pending API key, so introspection works without any prior credentials.
#
# End users don't need this container — configure
# https://hatchable.com/mcp directly in your MCP client.

FROM node:20-alpine

RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY proxy.mjs /app/proxy.mjs

ENV HATCHABLE_MCP_URL=https://hatchable.com/mcp

ENTRYPOINT ["node", "/app/proxy.mjs"]
