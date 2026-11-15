// 絆訪問介護 info@kizuna-houmon.jp の受け口 (Cloudflare Email Worker)。
// Email Routing のルール 1 本は宛先 1 つなので、この Worker が検証済みの宛先ごとに forward する。
// 宛先は repo が public なので書かない: secret FORWARD_TO (カンマ区切り、CF の宛先アドレスで検証済みの物だけ)。
// 1 人でも届けば受け取りとして終える。全員に失敗した時だけ差し戻す (黙って捨てない)。

export function parseRecipients(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function forwardAll(message, env) {
  const tos = parseRecipients(env.FORWARD_TO);
  if (tos.length === 0) {
    console.error('mail-forward: FORWARD_TO is empty');
    message.setReject('Temporary configuration error');
    return { ok: 0, failed: 0 };
  }
  let ok = 0;
  let failed = 0;
  for (const to of tos) {
    try {
      await message.forward(to);
      ok += 1;
    } catch (e) {
      failed += 1;
      console.error(`mail-forward: forward #${tos.indexOf(to) + 1} failed`, e?.message);
    }
  }
  if (ok === 0) message.setReject('Delivery failed');
  console.log(`mail-forward: ok=${ok} failed=${failed}`);
  return { ok, failed };
}

export default {
  async email(message, env) {
    await forwardAll(message, env);
  },
};
