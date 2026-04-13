import { Router, Request, Response } from 'express';
import prisma from '../config/prisma';
import { verifyFacebookSignature } from '../services/meta/messenger.client';
import {
  processWhatsAppWebhook,
  processMessengerWebhook,
  processInstagramWebhook,
} from '../services/meta/webhook.processor';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP WEBHOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /webhooks/whatsapp
 * Meta calls this to verify the webhook endpoint during setup.
 * We look up which connector owns the verify token and respond with the challenge.
 */
router.get('/whatsapp', async (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode !== 'subscribe') {
    return res.status(403).json({ error: 'Invalid mode' });
  }

  // Check against global env token first (dev / single-tenant)
  if (token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('[Webhook] WhatsApp verified (global token)');
    return res.status(200).send(challenge);
  }

  // Check against per-connector tokens (multi-tenant)
  const connector = await prisma.connector.findFirst({
    where: { webhookVerifyToken: token as string, channel: 'WHATSAPP' }
  });

  if (!connector) {
    console.warn('[Webhook] WhatsApp verification failed — unknown verify token');
    return res.status(403).send('Forbidden');
  }

  console.log(`[Webhook] WhatsApp verified for connector: ${connector.id}`);
  return res.status(200).send(challenge);
});

/**
 * POST /webhooks/whatsapp
 * Receives incoming messages from Meta.
 * Resolves which connector this belongs to via the phone number ID.
 */
router.post('/whatsapp', async (req: Request, res: Response) => {
  // Always respond 200 immediately — Meta retries if we don't
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body.object !== 'whatsapp_business_account') return;

    // Get the phone number ID from the payload to identify the connector
    const phoneNumberId = body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;

    // Find connector by phone number ID
    const connector = await prisma.connector.findFirst({
      where: { waPhoneNumberId: phoneNumberId, status: 'ACTIVE' }
    });

    if (!connector) {
      // Fallback: use env vars (single connector / dev mode)
      const envConnector = {
        id: 'env-whatsapp',
        tenantId: process.env.DEFAULT_TENANT_ID || '',
        waPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
        waAccessToken: process.env.WHATSAPP_ACCESS_TOKEN,
        channel: 'WHATSAPP',
      };
      if (!envConnector.tenantId || !envConnector.waPhoneNumberId) return;
      await processWhatsAppWebhook(body, envConnector);
      return;
    }

    await processWhatsAppWebhook(body, connector);
  } catch (err) {
    console.error('[Webhook] WhatsApp POST error:', err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// MESSENGER WEBHOOK
// ─────────────────────────────────────────────────────────────────────────────

router.get('/messenger', async (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode !== 'subscribe') return res.status(403).send('Forbidden');

  if (token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  const connector = await prisma.connector.findFirst({
    where: { webhookVerifyToken: token as string, channel: 'MESSENGER' }
  });

  if (!connector) return res.status(403).send('Forbidden');
  return res.status(200).send(challenge);
});

router.post('/messenger', async (req: Request, res: Response) => {
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body.object !== 'page') return;

    const pageId = body.entry?.[0]?.id;
    const connector = await prisma.connector.findFirst({
      where: { fbPageId: pageId, channel: 'MESSENGER', status: 'ACTIVE' }
    });

    if (!connector) {
      // Verify signature from env
      const sig = req.headers['x-hub-signature-256'] as string;
      if (process.env.FACEBOOK_APP_SECRET && sig) {
        const valid = verifyFacebookSignature(
          process.env.FACEBOOK_APP_SECRET,
          (req as any).rawBody || Buffer.from(JSON.stringify(body)),
          sig
        );
        if (!valid) { console.warn('[Webhook] Messenger signature mismatch'); return; }
      }

      const envConnector = {
        id: 'env-messenger',
        tenantId: process.env.DEFAULT_TENANT_ID || '',
        fbPageId: process.env.FACEBOOK_PAGE_ID,
        fbPageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
        channel: 'MESSENGER',
      };
      if (!envConnector.tenantId || !envConnector.fbPageId) return;
      await processMessengerWebhook(body, envConnector);
      return;
    }

    // Verify signature for DB connector
    const sig = req.headers['x-hub-signature-256'] as string;
    if (connector.fbAppSecret && sig) {
      const valid = verifyFacebookSignature(
        connector.fbAppSecret,
        (req as any).rawBody || Buffer.from(JSON.stringify(body)),
        sig
      );
      if (!valid) { console.warn('[Webhook] Messenger signature invalid'); return; }
    }

    await processMessengerWebhook(body, connector);
  } catch (err) {
    console.error('[Webhook] Messenger POST error:', err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// INSTAGRAM WEBHOOK
// ─────────────────────────────────────────────────────────────────────────────

router.get('/instagram', async (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode !== 'subscribe') return res.status(403).send('Forbidden');

  if (token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  const connector = await prisma.connector.findFirst({
    where: { webhookVerifyToken: token as string, channel: 'INSTAGRAM' }
  });

  if (!connector) return res.status(403).send('Forbidden');
  return res.status(200).send(challenge);
});

router.post('/instagram', async (req: Request, res: Response) => {
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body.object !== 'instagram') return;

    const igAccountId = body.entry?.[0]?.id;
    const connector = await prisma.connector.findFirst({
      where: { igAccountId, channel: 'INSTAGRAM', status: 'ACTIVE' }
    });

    if (!connector) return;
    await processInstagramWebhook(body, connector);
  } catch (err) {
    console.error('[Webhook] Instagram POST error:', err);
  }
});

export default router;
