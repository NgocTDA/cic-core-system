const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Execute the actual route and menu configuration without starting Next.js.
const root = path.resolve(__dirname, '..');
const cache = new Map();
function loadSource(relativePath) {
  const filename = path.resolve(root, relativePath);
  if (cache.has(filename)) return cache.get(filename);
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    fileName: filename,
  }).outputText;
  const mod = { exports: {} };
  const localRequire = (name) => {
    if (name === 'next/navigation') return {
      notFound() { throw new Error('NOT_FOUND'); },
      redirect(url) { throw new Error(`REDIRECT:${url}`); },
    };
    if (name === '@/components/UnavailableFeature') return { default: 'placeholder' };
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/')
        ? path.join(root, 'src', name.slice(2))
        : path.resolve(path.dirname(filename), name);
      const resolved = [base, `${base}.tsx`, `${base}.ts`].find(f => fs.existsSync(f) && fs.statSync(f).isFile());
      if (!resolved) throw new Error(`Cannot resolve ${name}`);
      return loadSource(path.relative(root, resolved));
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', output)(localRequire, mod, mod.exports);
  cache.set(filename, mod.exports);
  return mod.exports;
}

const page = loadSource('app/[...slug]/page.tsx').default;
test('planned menu entries render an honest placeholder with the menu title', () => {
  const result = page({ params: { slug: ['kkn', 'channel-setup'] } });
  assert.equal(result.props.title, 'Thiết lập kênh');
});
test('unknown descendants and unknown URLs stay 404', () => {
  for (const slug of [['ops-support', 'job-management', 'typo'], ['unknown-feature']]) {
    assert.throws(() => page({ params: { slug } }), /NOT_FOUND/);
  }
});
test('portal fallback resolves the prefixed menu entry', () => {
  const portal = loadSource('app/web-portal/[...slug]/page.tsx').default;
  const wrapper = portal({ params: { slug: ['billing', 'invoices'] } });
  assert.equal(wrapper.type(wrapper.props).props.title,
    page({ params: { slug: ['web-portal', 'billing', 'invoices'] } }).props.title);
});
test('legacy new-template route redirects to the canonical create route', () => {
  const legacy = loadSource('app/ops-support/notification-template/new/page.tsx').default;
  assert.throws(() => legacy(), /REDIRECT:\/ops-support\/notification-template\/create/);
});
