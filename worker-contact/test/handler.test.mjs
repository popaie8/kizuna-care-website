// node --test worker-contact/test  (送り先は偽物。本物のメールは送らない)
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { handle, _resetMemoryLimiter, isAllowedOrigin } from '../src/handler.js';

const FAKE_TO = 'owner@example.invalid';
const FIXED = new Date('2026-11-15T05:00:00Z');

beforeEach(() => _resetMemoryLimiter());

function setup(overrides = {}) {
  const sent = [];
  const env = {
    MAIL_TO: FAKE_TO,
    MAIL_FROM: 'form@kizuna-houmon.jp',
    MAILER: { send: async (m) => { sent.push(m); } },
    ...overrides,
  };
  const deps = {
    makeMessage: (from, to, raw) => ({ from, to, raw }),
    now: () => FIXED,
    randomId: () => 'test-id',
  };
  return { env, deps, sent };
}

function req(body, { method = 'POST', origin = 'https://www.kizuna-houmon.jp', raw, ip = '192.0.2.1' } = {}) {
  const headers = { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip };
  if (origin) headers.Origin = origin;
  return new Request('https://form.kizuna-houmon.jp/', {
    method,
    headers,
    body: method === 'POST' ? (raw ?? JSON.stringify(body)) : undefined,
  });
}

const good = { name: '試験 太郎', email: 'taro@example.invalid', phone: '03-0000-0000', inquiry_type: 'サービス内容', message: '試験の問い合わせです。\n2 行目。', website: '' };

function decodeBody(raw) {
  const b = raw.split('\r\n\r\n')[1].replace(/\r\n/g, '');
  return Buffer.from(b, 'base64').toString('utf8');
}

test('正しい問い合わせは検証済みの宛先へ送る (自動返信なし)・CORS の許可が付く', async () => {
  const { env, deps, sent } = setup();
  const res = await handle(req(good), env, deps);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://www.kizuna-houmon.jp');
  assert.deepEqual(await res.json(), { success: true, message: 'お問い合わせを受け付けました。' });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, FAKE_TO);
  assert.equal(sent[0].from, 'form@kizuna-houmon.jp');
  assert.match(sent[0].raw, /^Reply-To: <taro@example\.invalid>$/m);
  const text = decodeBody(sent[0].raw);
  assert.match(text, /お名前: 試験 太郎/);
  assert.match(text, /試験の問い合わせです。\n2 行目。/);
  assert.match(text, /電話番号: 03-0000-0000/);
});

test('宛先 3 人なら 1 人ずつ 3 通、To はそれぞれの宛先', async () => {
  const tos = ['a@example.invalid', 'b@example.invalid', 'c@example.invalid'];
  const { env, deps, sent } = setup({ MAIL_TO: tos.join(' , ') });
  const res = await handle(req(good), env, deps);
  assert.equal(res.status, 200);
  assert.deepEqual(sent.map((m) => m.to), tos);
  sent.forEach((m, i) => assert.match(m.raw, new RegExp(`^To: <${tos[i]}>$`, 'm')));
});

test('1 人に失敗しても残りに届けば 200、全員失敗なら 502', async () => {
  let n = 0;
  const partial = setup({ MAIL_TO: 'a@example.invalid,b@example.invalid', MAILER: { send: async () => { n += 1; if (n === 1) throw new Error('x'); } } });
  assert.equal((await handle(req(good), partial.env, partial.deps)).status, 200);
  const all = setup({ MAIL_TO: 'a@example.invalid,b@example.invalid', MAILER: { send: async () => { throw new Error('destination not verified'); } } });
  const res = await handle(req(good), all.env, all.deps);
  assert.equal(res.status, 502);
  assert.equal((await res.json()).success, false);
});

test('件名の Subject を UTF-8 で戻すと名前と種別が入っている', async () => {
  const { env, deps, sent } = setup();
  await handle(req(good), env, deps);
  const enc = sent[0].raw.match(/^Subject: =\?UTF-8\?B\?(.+)\?=$/m)[1];
  assert.equal(Buffer.from(enc, 'base64').toString('utf8'), '【お問い合わせ】サービス内容 - 試験 太郎様より');
});

test('必須の欠け・メールの形の誤りは 400 で、送らない', async () => {
  for (const body of [{ ...good, name: '' }, { ...good, message: '   ' }, { ...good, email: 'not-an-email' }]) {
    const { env, deps, sent } = setup();
    const res = await handle(req(body), env, deps);
    assert.equal(res.status, 400);
    assert.equal((await res.json()).success, false);
    assert.equal(sent.length, 0);
  }
});

test('ヘッダーの差し込み (改行入りのメール・名前) は 1 行に潰すか弾く', async () => {
  const { env, deps, sent } = setup();
  const res = await handle(req({ ...good, email: 'a@b.c\r\nBcc: x@y.z' }), env, deps);
  assert.equal(res.status, 400);
  assert.equal(sent.length, 0);
  const s2 = setup();
  await handle(req({ ...good, name: '太郎\r\nBcc: x@y.z' }), s2.env, s2.deps);
  assert.equal(s2.sent.length, 1);
  assert.doesNotMatch(s2.sent[0].raw, /^Bcc:/m);
});

test('よその Origin・Origin 無しは 403 で送らない。preview の Origin は通す', async () => {
  for (const origin of ['https://evil.example', null, 'https://kizuna-care-x-other-team.vercel.app']) {
    const a = setup();
    assert.equal((await handle(req(good, { origin }), a.env, a.deps)).status, 403);
    assert.equal(a.sent.length, 0);
  }
  assert.ok(isAllowedOrigin('https://kizuna-care-abc123-popaiehy0112-8535s-projects.vercel.app'));
  assert.ok(isAllowedOrigin('https://kizuna-houmon.jp'));
});

test('OPTIONS (preflight) は許した Origin にだけ 204 と CORS を返す', async () => {
  const { env, deps } = setup();
  const ok = await handle(req(null, { method: 'OPTIONS' }), env, deps);
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get('Access-Control-Allow-Methods'), 'POST, OPTIONS');
  const ng = await handle(req(null, { method: 'OPTIONS', origin: 'https://evil.example' }), env, deps);
  assert.equal(ng.status, 403);
});

test('honeypot (website) が埋まっていれば送らない', async () => {
  const { env, deps, sent } = setup();
  const res = await handle(req({ ...good, website: 'http://spam.example' }), env, deps);
  assert.equal(res.status, 200);
  assert.equal(sent.length, 0);
});

test('同じ IP から 10 分に 6 回目は 429、別の IP は通る', async () => {
  const { env, deps, sent } = setup();
  for (let i = 0; i < 5; i += 1) assert.equal((await handle(req(good), env, deps)).status, 200);
  assert.equal((await handle(req(good), env, deps)).status, 429);
  assert.equal(sent.length, 5);
  assert.equal((await handle(req(good, { ip: '192.0.2.2' }), env, deps)).status, 200);
});

test('束縛 RATE_LIMITER があればそれに従う', async () => {
  const { env, deps, sent } = setup({ RATE_LIMITER: { limit: async () => ({ success: false }) } });
  assert.equal((await handle(req(good), env, deps)).status, 429);
  assert.equal(sent.length, 0);
});

test('設定の欠けは 500 で、偽の成功を返さない', async () => {
  for (const o of [{ MAIL_TO: '' }, { MAIL_TO: ' , ' }, { MAILER: undefined }]) {
    const { env, deps } = setup(o);
    const res = await handle(req(good), env, deps);
    assert.equal(res.status, 500);
    assert.equal((await res.json()).success, false);
  }
});

test('GET は 405、壊れた JSON は 400、大きすぎる本文は 413', async () => {
  const a = setup();
  assert.equal((await handle(req(null, { method: 'GET' }), a.env, a.deps)).status, 405);
  const b = setup();
  assert.equal((await handle(req(null, { raw: '{bad' }), b.env, b.deps)).status, 400);
  const c = setup();
  assert.equal((await handle(req(null, { raw: JSON.stringify({ ...good, message: 'x'.repeat(30000) }) }), c.env, c.deps)).status, 413);
});

test('長すぎる本文は 5000 字で切る', async () => {
  const { env, deps, sent } = setup();
  await handle(req({ ...good, message: 'あ'.repeat(6000) }), env, deps);
  const text = decodeBody(sent[0].raw);
  assert.ok(text.includes('あ'.repeat(5000)));
  assert.ok(!text.includes('あ'.repeat(5001)));
});
