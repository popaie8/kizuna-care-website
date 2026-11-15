import { EmailMessage } from 'cloudflare:email';
import { handle } from './handler.js';

export default {
  fetch(request, env) {
    return handle(request, env, {
      makeMessage: (from, to, raw) => new EmailMessage(from, to, raw),
      now: () => new Date(),
      randomId: () => crypto.randomUUID(),
    });
  },
};
