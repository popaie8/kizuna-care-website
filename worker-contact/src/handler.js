// 絆訪問介護 お問い合わせの受け口 (Cloudflare Worker、form.kizuna-houmon.jp)。
// サイトの 2 つのフォーム (トップと /contact) がブラウザから直接ここへ POST する (CORS)。
// 送りは Cloudflare Email Routing の send_email だけを使う。Xserver の SMTP には頼らない。
// 宛先は Email Routing で検証済みの物だけ (secret MAIL_TO、カンマ区切り。公開 repo に書かない)。
// 問い合わせた人への自動返信はしない (send_email は検証済みの宛先にしか送れない。HQ の決め 2026-11-15)。
// 送れなかった時は 200 にしない (旧 api/contact.js の「SMTP の設定が無いと 200」の偽の成功を繰り返さない)。

const ALLOWED_ORIGINS = new Set([
  'https://www.kizuna-houmon.jp',
  'https://kizuna-houmon.jp',
]);
// Vercel の preview (この project・この team の物だけ)。試しの送信に使う
const PREVIEW_ORIGIN_RE = /^https:\/\/kizuna-care-[a-z0-9-]+-popaiehy0112-8535s-projects\.vercel\.app$/;

const LIMITS = { name: 100, email: 254, phone: 30, inquiry_type: 50, message: 5000 };
const MAX_BODY_BYTES = 20000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_MSG = '送信に失敗しました。お電話でお問い合わせください。\n📞 03-6820-5308';

// 回数の上限 (同じ IP から 10 分に 5 回)。束縛 RATE_LIMITER (Workers の Rate Limiting) があればそれを使い、
// 無ければこの isolate の中だけで数える (弱いが 0 よりよい)
const WINDOW_MS = 10 * 60 * 1000;
const PER_WINDOW = 5;
const memoryHits = new Map();

export function isAllowedOrigin(origin) {
  return !!origin && (ALLOWED_ORIGINS.has(origin) || PREVIEW_ORIGIN_RE.test(origin));
}

function corsHeaders(origin) {
  if (!isAllowedOrigin(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

function json(status, body, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });
}

function clean(v, max) {
  if (typeof v !== 'string') return '';
  // 制御文字 (改行とタブ以外) を落とし、前後の空白を除く
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

function oneLine(v) {
  return v.replace(/[\r\n]+/g, ' ');
}

function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function encodeWord(str) {
  return `=?UTF-8?B?${b64(str)}?=`;
}

export function parseRecipients(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildRawEmail({ from, to, replyTo, subject, text, date, messageId }) {
  const body = b64(text).replace(/.{1,76}/g, '$&\r\n');
  return [
    `From: ${encodeWord('絆訪問介護 お問い合わせフォーム')} <${from}>`,
    `To: <${to}>`,
    `Reply-To: <${replyTo}>`,
    `Subject: ${encodeWord(subject)}`,
    `Date: ${date.toUTCString()}`,
    `Message-ID: <${messageId}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n');
}

export function parseInquiry(data) {
  const inq = {
    name: oneLine(clean(data?.name, LIMITS.name)),
    email: oneLine(clean(data?.email, LIMITS.email)),
    phone: oneLine(clean(data?.phone, LIMITS.phone)),
    inquiry_type: oneLine(clean(data?.inquiry_type, LIMITS.inquiry_type)),
    message: clean(data?.message, LIMITS.message),
  };
  if (!inq.name || !inq.email || !inq.message) return { error: '必須項目を入力してください' };
  if (!EMAIL_RE.test(inq.email)) return { error: '有効なメールアドレスを入力してください' };
  return { inquiry: inq };
}

export function composeText(inq, now) {
  return [
    'ホームページのお問い合わせフォームから送信がありました。',
    '',
    `お名前: ${inq.name}`,
    `メールアドレス: ${inq.email}`,
    `電話番号: ${inq.phone || 'なし'}`,
    `お問い合わせ種別: ${inq.inquiry_type || '一般'}`,
    '',
    '【お問い合わせ内容】',
    inq.message,
    '',
    '---',
    `受信日時: ${now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`,
    'このメールに返信すると、お問い合わせの方へ届きます。',
  ].join('\n');
}

export async function overLimit(env, key, nowMs) {
  if (env.RATE_LIMITER && typeof env.RATE_LIMITER.limit === 'function') {
    const { success } = await env.RATE_LIMITER.limit({ key });
    return !success;
  }
  const hits = (memoryHits.get(key) || []).filter((t) => nowMs - t < WINDOW_MS);
  hits.push(nowMs);
  memoryHits.set(key, hits);
  if (memoryHits.size > 5000) memoryHits.clear();
  return hits.length > PER_WINDOW;
}

export function _resetMemoryLimiter() {
  memoryHits.clear();
}

// deps: { makeMessage(from, to, raw) => EmailMessage, now() => Date, randomId() => string }
export async function handle(request, env, deps) {
  const origin = request.headers.get('Origin');

  if (request.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin)) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== 'POST') return json(405, { success: false, error: 'Method not allowed' }, origin);

  // ブラウザからの POST には必ず Origin が付く。無い・よその物は弾く
  if (!isAllowedOrigin(origin)) {
    return json(403, { success: false, error: '送信元が正しくありません' }, origin);
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (await overLimit(env, ip, deps.now().getTime())) {
    console.warn('contact: rate limited');
    return json(429, { success: false, error: '短い間に送信が続いたため受け付けませんでした。しばらくしてから、またはお電話でお問い合わせください。\n📞 03-6820-5308' }, origin);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return json(413, { success: false, error: '送信内容が長すぎます' }, origin);
  }
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch {
    return json(400, { success: false, error: '送信内容を読み取れませんでした' }, origin);
  }

  // honeypot: 人には見えない欄。埋まっていたら機械の投稿とみなし、送らずに受け付けた形で返す
  if (typeof data?.website === 'string' && data.website.trim() !== '') {
    console.warn('contact: honeypot filled, dropped');
    return json(200, { success: true, message: 'お問い合わせを受け付けました。' }, origin);
  }

  const { inquiry, error } = parseInquiry(data);
  if (error) return json(400, { success: false, error }, origin);

  const tos = parseRecipients(env.MAIL_TO);
  if (tos.length === 0 || !env.MAIL_FROM || !env.MAILER) {
    console.error('contact: missing MAIL_TO / MAIL_FROM / MAILER binding');
    return json(500, { success: false, error: PHONE_MSG }, origin);
  }

  const now = deps.now();
  const domain = env.MAIL_FROM.split('@')[1];
  const subject = `【お問い合わせ】${inquiry.inquiry_type || '一般'} - ${inquiry.name}様より`;
  const text = composeText(inquiry, now);

  // 宛先ごとに 1 通 (send_email の 1 通は宛先 1 つ)。1 人にでも届けば受け付け、全員に失敗した時だけ誤りを返す
  let ok = 0;
  let failed = 0;
  for (let i = 0; i < tos.length; i += 1) {
    const raw = buildRawEmail({
      from: env.MAIL_FROM,
      to: tos[i],
      replyTo: inquiry.email,
      subject,
      text,
      date: now,
      messageId: `${deps.randomId()}@${domain}`,
    });
    try {
      await env.MAILER.send(deps.makeMessage(env.MAIL_FROM, tos[i], raw));
      ok += 1;
    } catch (e) {
      failed += 1;
      console.error(`contact: send #${i + 1} failed`, e?.message);
    }
  }
  console.log(`contact: ok=${ok} failed=${failed}`);
  if (ok === 0) return json(502, { success: false, error: PHONE_MSG }, origin);

  return json(200, { success: true, message: 'お問い合わせを受け付けました。' }, origin);
}
