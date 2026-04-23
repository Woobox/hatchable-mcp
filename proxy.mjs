#!/usr/bin/env node
// Stdio ↔ HTTP passthrough for the Hatchable MCP server.
//
// Registries and quality scanners (Glama, etc.) that want to run the
// server locally via stdio get this tiny proxy. It reads newline-
// delimited JSON-RPC messages from stdin, POSTs them to the live MCP
// endpoint, and writes each response back to stdout.
//
// State captured across calls:
//   - api_key: on the first `initialize` response with no prior auth,
//     hatchable.com/mcp mints a pending API key in `result.meta.api_key`.
//     We stash it and send it as `Authorization: Bearer <key>` on every
//     subsequent call so `tools/call` (which requires auth) works.
//   - Mcp-Session-Id: echoed back on future requests when the server
//     issues one on `initialize`.
//
// End users don't need this file — configure https://hatchable.com/mcp
// directly in your MCP client and let its native HTTP transport handle
// the session.

const MCP_URL = process.env.HATCHABLE_MCP_URL || 'https://hatchable.com/mcp';

let apiKey = process.env.HATCHABLE_TOKEN || null;
let sessionId = null;
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
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  if (sessionId) headers['Mcp-Session-Id'] = sessionId;

  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers,
    body,
  });

  const sid = res.headers.get('Mcp-Session-Id');
  if (sid) sessionId = sid;

  const text = await res.text();

  if (text && !apiKey) {
    try {
      const parsed = JSON.parse(text);
      const key = parsed?.result?.meta?.api_key;
      if (typeof key === 'string' && key.length > 0) {
        apiKey = key;
      }
    } catch {
      // response may not be JSON (e.g. notifications/initialized returns
      // a malformed envelope upstream); ignore and keep going.
    }
  }

  if (text) process.stdout.write(text + '\n');
}
