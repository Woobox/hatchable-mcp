#!/usr/bin/env node
// Stdio ↔ HTTP passthrough for the Hatchable MCP server.
//
// Registries and quality scanners (Glama, etc.) that want to run the
// server locally via stdio get this tiny proxy. It reads newline-
// delimited JSON-RPC messages from stdin, POSTs them to the live MCP
// endpoint, and writes each response back to stdout.
//
// No auth handling, no OAuth discovery, no extra protocol negotiation
// — just raw forwarding. On `initialize` with no Authorization header,
// hatchable.com/mcp auto-mints a pending API key (surfaced in the
// `_meta.api_key` field of the response) so introspection works
// without any prior credentials.
//
// End users don't need this file — configure https://hatchable.com/mcp
// directly in your MCP client and let its native HTTP transport do the
// work.

const MCP_URL = process.env.HATCHABLE_MCP_URL || 'https://hatchable.com/mcp';

let buffer = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    forward(line).catch((err) => {
      process.stderr.write(`proxy error: ${err.message}\n`);
    });
  }
});

async function forward(body) {
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body,
  });
  const text = await res.text();
  if (text) process.stdout.write(text + '\n');
}
