/**
 * Messenger & Instagram Graph API Client
 * Docs: https://developers.facebook.com/docs/messenger-platform/send-messages
 *       https://developers.facebook.com/docs/instagram-api/reference/ig-user/messages
 */

const GRAPH_BASE = 'https://graph.facebook.com/v19.0';

interface MessengerTextPayload {
  pageAccessToken: string;
  recipientId: string;  // PSID (Page-Scoped ID)
  text: string;
}

interface MessengerMediaPayload {
  pageAccessToken: string;
  recipientId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'file';
}

// ─── Send Text Message (Messenger or Instagram) ───────────────────────────────

export const sendMessengerText = async (payload: MessengerTextPayload): Promise<any> => {
  const { pageAccessToken, recipientId, text } = payload;

  if (!pageAccessToken) {
    console.warn('[Messenger] Page access token not configured — message not sent');
    return null;
  }

  const res = await fetch(
    `${GRAPH_BASE}/me/messages?access_token=${pageAccessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
        messaging_type: 'RESPONSE',
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error('[Messenger] Send failed:', err);
    throw new Error(err?.error?.message || 'Messenger send failed');
  }

  return res.json();
};

// ─── Send Media Message ───────────────────────────────────────────────────────

export const sendMessengerMedia = async (payload: MessengerMediaPayload): Promise<any> => {
  const { pageAccessToken, recipientId, mediaUrl, mediaType } = payload;

  if (!pageAccessToken) {
    console.warn('[Messenger] Page access token not configured — media not sent');
    return null;
  }

  const res = await fetch(
    `${GRAPH_BASE}/me/messages?access_token=${pageAccessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: mediaType,
            payload: { url: mediaUrl, is_reusable: true },
          },
        },
        messaging_type: 'RESPONSE',
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Messenger media send failed');
  }

  return res.json();
};

// ─── Verify Webhook Signature ─────────────────────────────────────────────────

import crypto from 'crypto';

export const verifyFacebookSignature = (
  appSecret: string,
  rawBody: Buffer,
  signature: string
): boolean => {
  if (!appSecret) return true; // Skip verification if no secret set yet
  const expected = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody)
    .digest('hex');
  return `sha256=${expected}` === signature;
};
