// node --test worker-mail-forward/test  (宛先は偽物)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { forwardAll, parseRecipients } from '../src/index.js';

function msg(failFor = []) {
  const m = { forwarded: [], rejected: null };
  m.forward = async (to) => { if (failFor.includes(to)) throw new Error('not verified'); m.forwarded.push(to); };
  m.setReject = (r) => { m.rejected = r; };
  return m;
}

test('カンマ区切りを空白と空要素を除いて読む', () => {
  assert.deepEqual(parseRecipients(' a@x.invalid , ,b@x.invalid '), ['a@x.invalid', 'b@x.invalid']);
  assert.deepEqual(parseRecipients(undefined), []);
});

test('2 人ともへ forward する', async () => {
  const m = msg();
  const r = await forwardAll(m, { FORWARD_TO: 'a@x.invalid,b@x.invalid' });
  assert.deepEqual(m.forwarded, ['a@x.invalid', 'b@x.invalid']);
  assert.equal(m.rejected, null);
  assert.deepEqual(r, { ok: 2, failed: 0 });
});

test('1 人に失敗してももう 1 人へは届け、差し戻さない', async () => {
  const m = msg(['a@x.invalid']);
  const r = await forwardAll(m, { FORWARD_TO: 'a@x.invalid,b@x.invalid' });
  assert.deepEqual(m.forwarded, ['b@x.invalid']);
  assert.equal(m.rejected, null);
  assert.deepEqual(r, { ok: 1, failed: 1 });
});

test('全員に失敗したら差し戻す (黙って捨てない)', async () => {
  const m = msg(['a@x.invalid']);
  await forwardAll(m, { FORWARD_TO: 'a@x.invalid' });
  assert.equal(m.rejected, 'Delivery failed');
});

test('宛先の設定が空なら差し戻す', async () => {
  const m = msg();
  await forwardAll(m, {});
  assert.equal(m.rejected, 'Temporary configuration error');
  assert.equal(m.forwarded.length, 0);
});
