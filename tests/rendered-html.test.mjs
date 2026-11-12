import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";
import test from "node:test";

async function reservePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

async function render(pathname = "/") {
  const port = await reservePort();
  const wrangler = fileURLToPath(
    new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url),
  );
  const config = fileURLToPath(
    new URL("../dist/server/wrangler.json", import.meta.url),
  );
  const child = spawn(
    process.execPath,
    [wrangler, "dev", "--config", config, "--port", String(port)],
    { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
  );
  let diagnostics = "";
  child.stdout.on("data", (chunk) => (diagnostics += chunk.toString()));
  child.stderr.on("data", (chunk) => (diagnostics += chunk.toString()));

  try {
    const deadline = Date.now() + 20_000;
    let response;
    while (Date.now() < deadline) {
      if (child.exitCode !== null) {
        throw new Error(`Wrangler exited before startup.\n${diagnostics}`);
      }
      try {
        response = await fetch(`http://127.0.0.1:${port}${pathname}`, {
          headers: { accept: "text/html" },
        });
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }
    if (!response) {
      throw new Error(`Wrangler did not become ready.\n${diagnostics}`);
    }
    return {
      status: response.status,
      contentType: response.headers.get("content-type") ?? "",
      html: await response.text(),
    };
  } finally {
    child.kill();
    await Promise.race([
      new Promise((resolve) => child.once("exit", resolve)),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
  }
}

test("renders the Apollun home page with its SEO and primary sections", async () => {
  const { status, contentType, html } = await render();
  assert.equal(status, 200);
  assert.match(contentType, /^text\/html\b/i);
  assert.match(html, /<html[^>]*lang=["']pt-BR["']/i);
  assert.match(
    html,
    /<title>Apollun\.Dev — Transformando ideias em experiências digitais<\/title>/i,
  );
  assert.match(html, /<link[^>]*rel=["']canonical["'][^>]*apollundev\.com/i);
  assert.match(html, /id=["']inicio["']/i);
  assert.match(html, /id=["']servicos["']/i);
  assert.match(html, /id=["']planos["']/i);
  assert.match(html, /id=["']portfolio["']/i);
  assert.match(html, /id=["']faq["']/i);
  assert.match(html, /Sites que transformam/);
  assert.match(html, /Apollun Care/);
});

test("renders the Apollun Care demonstration", async () => {
  const { status, contentType, html } = await render("/care");
  assert.equal(status, 200);
  assert.match(contentType, /^text\/html\b/i);
  assert.match(html, /<title>Apollun Care — Agenda inteligente para psicólogos<\/title>/i);
  assert.match(html, /Demonstração interativa/);
  assert.match(html, /Visão geral/);
  assert.match(html, /Financeiro/);
  assert.match(html, /Nenhum dado clínico real/);
});

test("renders both legal pages", async () => {
  for (const pathname of ["/politica-de-privacidade", "/termos-de-uso"]) {
    const { status, contentType, html } = await render(pathname);
    assert.equal(status, 200, pathname);
    assert.match(contentType, /^text\/html\b/i, pathname);
    assert.match(html, /Henrique de Freitas Pinto/, pathname);
    assert.match(html, /São Bernardo do Campo/, pathname);
  }
});

test("keeps legacy blue and purple UI accents out of the main stylesheet", async () => {
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  const legacyHex =
    /#(?:7c3aed|2563eb|6ea4ff|9a78ff|5c7cff|6545e8|7890ff|5b8cff|9a6dff|8e7dff|8e83ff|8277ff|6f66ff|8d8dff|b3adff|9c92ff|8a8cff|a395ff|7b86ff|4a54d4|442b84|9d95ff|8faaff|3149b8|172459|ad9aff|5b28d4|1a0c48|8875ff|8883ff|8881ff|8580ff|7770ff|8c83ff|101c4a|2c1b63|120d2e|a7b8ff|5269d9|675df2|3f37be|8b88ff|27336a|8d8aff|6575e7|24305a|848fff|858eff|8d92ff|a99fff|9287ff|766bff|9489ff)\b/i;
  const legacyRgb =
    /rgba?\((?:124,\s*58,\s*237|37,\s*99,\s*235|112,\s*105,\s*255|122,\s*113,\s*255|114,\s*108,\s*255|111,\s*101,\s*255|130,\s*81,\s*255|113,\s*106,\s*255|76,\s*57,\s*190|125,\s*116,\s*255|120,\s*112,\s*255|91,\s*67,\s*231|135,\s*146,\s*255|112,\s*95,\s*255|137,\s*168,\s*255|67,\s*36,\s*165|60,\s*67,\s*220|92,\s*78,\s*214|91,\s*89,\s*255|139,\s*136,\s*255|68,\s*64,\s*220|125,\s*114,\s*255|86,\s*66,\s*230)/i;

  assert.doesNotMatch(stylesheet, legacyHex);
  assert.doesNotMatch(stylesheet, legacyRgb);
  assert.match(stylesheet, /--navy:#20364e/);
  assert.match(stylesheet, /--slate:#34485f/);
  assert.match(stylesheet, /--sand:#cfb496/);
  assert.match(stylesheet, /--cream:#f5f1eb/);
});
