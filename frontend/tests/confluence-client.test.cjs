const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app/api/confluence/confluenceClient.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const output = { exports: {} };
new Function('exports', 'require', 'module', code)(output.exports, require, output);
const { cfFetch, cfFetchCollection, fetchImageAsDataUrl, trustedUrl } = output.exports;
const cfg = { baseUrl: 'https://wiki.example/confluence' };

test('reject lookalikes, external/private destinations, credentials and schemes before fetch', async () => {
  const original = global.fetch;
  global.fetch = () => { throw new Error('must not fetch'); };
  try {
    for (const url of ['https://wiki.example.evil.test/x', '//127.0.0.1/x', 'http://169.254.169.254/x', 'file:///etc/passwd', 'https://user:pass@wiki.example/x']) {
      assert.throws(() => trustedUrl(cfg, url));
      assert.equal((await fetchImageAsDataUrl(cfg, 'fake', url)).dataUrl, null);
    }
  } finally { global.fetch = original; }
});
test('never forward PAT to a redirect outside the configured origin', async () => {
  const original = global.fetch;
  let calls = 0;
  global.fetch = async (url, opts) => {
    calls++;
    assert.equal(url.origin, 'https://wiki.example');
    assert.equal(opts.redirect, 'manual');
    return new Response(null, { status: 302, headers: { location: 'https://evil.test/image' } });
  };
  try { await assert.rejects(cfFetch(cfg, 'fake', '/rest/api/content')); assert.equal(calls, 1); }
  finally { global.fetch = original; }
});
test('stream limits cancel oversized bodies even without Content-Length', async () => {
  const original = global.fetch;
  let cancelled = false;
  global.fetch = async () => new Response(new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(8)); },
    cancel() { cancelled = true; }
  }));
  try { await assert.rejects(cfFetch(cfg, 'fake', '/x', 10), /byte limit/); assert.equal(cancelled, true); }
  finally { global.fetch = original; }
});
test('follow bounded pagination and preserve context path', async () => {
  const original = global.fetch;
  const paths = [];
  global.fetch = async (url) => {
    paths.push(url.pathname + url.search);
    return Response.json(paths.length === 1 ? { results: [1], _links: { next: '/confluence/rest/api/content?start=1' } } : { results: [2] });
  };
  try {
    assert.deepEqual(await cfFetchCollection(cfg, 'fake', '/rest/api/content'), [1, 2]);
    assert.deepEqual(paths, ['/confluence/rest/api/content', '/confluence/rest/api/content?start=1']);
  } finally { global.fetch = original; }
});
test('pagination loops are errors, not silently partial collections', async () => {
  const original = global.fetch;
  global.fetch = async () => Response.json({ results: [], _links: { next: 'https://wiki.example/loop' } });
  try { await assert.rejects(cfFetchCollection(cfg, 'fake', 'https://wiki.example/loop'), /loop/); }
  finally { global.fetch = original; }
});
