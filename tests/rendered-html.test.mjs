import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the Apollun home page with its SEO and primary sections", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
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
