/**
 * WhatsApp Cloud API Client
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages
 *
 * Sends messages back to WhatsApp users via Meta's Cloud API.
 * All functions gracefully no-op when credentials are not configured.
 */

const WA_API_BASE = 'https://graph.facebook.com/v19.0';

interface WhatsAppTextPayload {
  phoneNumberId: string;
  accessToken: string;
  to: string;   // Recipient phone number with country code (e.g. "923001234567")
  text: string;
}

interface WhatsAppMediaPayload extends WhatsAppTextPayload {
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  caption?: string;
}

// ─── Send Text Message ────────────────────────────────────────────────────────

export const sendWhatsAppText = async (payload: WhatsAppTextPayload): Promise<any> => {
  const { phoneNumberId, accessToken, to, text } = payload;

  if (!phoneNumberId || !accessToken) {
    console.warn('[WhatsApp] Credentials not configured — message not sent');
    return null;
  }

  const res = await fetch(`${WA_API_BASE}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text, preview_url: false },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('[WhatsApp] Send failed:', err);
    throw new Error(err?.error?.message || 'WhatsApp send failed');
  }

  return res.json();
};

// ─── Send Media Message ───────────────────────────────────────────────────────

export const sendWhatsAppMedia = async (payload: WhatsAppMediaPayload): Promise<any> => {
  const { phoneNumberId, accessToken, to, mediaUrl, mediaType, caption } = payload;

  if (!phoneNumberId || !accessToken) {
    console.warn('[WhatsApp] Credentials not configured — media not sent');
    return null;
  }

  const mediaPayload: any = { link: mediaUrl };
  if (caption) mediaPayload.caption = caption;

  const res = await fetch(`${WA_API_BASE}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: mediaType,
      [mediaType]: mediaPayload,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'WhatsApp media send failed');
  }

  return res.json();
};

// ─── Mark Message as Read ─────────────────────────────────────────────────────

export const markWhatsAppRead = async (
  phoneNumberId: string,
  accessToken: string,
  messageId: string
): Promise<any> => {
  if (!phoneNumberId || !accessToken) return null;

  const res = await fetch(`${WA_API_BASE}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  });

  return res.ok ? res.json() : null;
};
