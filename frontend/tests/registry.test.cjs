const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const source = path.resolve(__dirname, '../app/api/srs/registries/store.ts');
const compiled = ts.transpileModule(require('node:fs').readFileSync(source, 'utf8'), { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loaded = new Module(source, module);
loaded.filename = source;
loaded.paths = module.paths;
loaded._compile(compiled, source);
const { parseCsv, stringifyCsv, readRegistry, mutateRegistry } = loaded.exports;

test('CSV round trip preserves commas, quotes, whitespace, CRLF and multiline fields', () => {
    assert.deepEqual(parseCsv(stringifyCsv(['value'], [{ value: '' }])), { headers: ['value'], items: [{ value: '' }] });
    const headers = ['code', 'description'];
    const items = [{ code: ' A ', description: '"quoted" only' }, { code: 'B', description: 'one,two\r\nthree\nfour' }];
    assert.deepEqual(parseCsv('\uFEFF' + stringifyCsv(headers, items)), { headers, items });
    assert.throws(() => parseCsv('a,b\n1,2,3'), /khớp/);
    assert.throws(() => parseCsv('a,b\n1,"oops'), /ngoặc/);
});
test('row mutations preserve unseen rows and address page-two identity; final deletion retains schema', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cic-registry-'));
    try {
        const items = Array.from({ length: 21 }, (_, i) => ({ ma: `ROW-${i}`, ten: `Name ${i}` }));
        await fs.writeFile(path.join(dir, 'roles.csv'), stringifyCsv(['ma', 'ten'], items));
        let state = await readRegistry('roles', dir);
        const stale = state.revision;
        state = await mutateRegistry({ registry: 'roles', revision: state.revision, action: 'update', rowId: state.rowIds[20], values: { ma: 'ROW-20', ten: 'Edited search result' } }, dir);
        assert.equal(state.items.length, 21);
        assert.deepEqual(state.items[0], items[0]);
        assert.equal(state.items[20].ten, 'Edited search result');
        await assert.rejects(mutateRegistry({ registry: 'roles', revision: stale, action: 'delete', rowId: state.rowIds[0] }, dir), /thay đổi/);
        while (state.items.length) state = await mutateRegistry({ registry: 'roles', revision: state.revision, action: 'delete', rowId: state.rowIds.at(-1) }, dir);
        assert.deepEqual(state.headers, ['ma', 'ten']);
        assert.deepEqual(state.items, []);
        state = await mutateRegistry({ registry: 'roles', revision: state.revision, action: 'add', values: { ma: 'NEW', ten: '' } }, dir);
        assert.equal(state.items[0].ma, 'NEW');
        assert.deepEqual((await fs.readdir(dir)).sort(), ['roles.csv']);
    } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
test('empty registry exposes schema; concurrent writers cannot overwrite each other', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cic-registry-'));
    try {
        const state = await readRegistry('roles', dir);
        assert.ok(state.headers.length);
        const values = Object.fromEntries(state.headers.map(h => [h, 'test']));
        const results = await Promise.allSettled([1, 2].map(() => mutateRegistry({ registry: 'roles', revision: state.revision, action: 'add', values }, dir)));
        assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
        assert.equal((await readRegistry('roles', dir)).items.length, 1);
        await assert.rejects(readRegistry('../bad', dir), /không hợp lệ/);
    } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

