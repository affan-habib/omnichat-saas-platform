/**
 * Core webhook processing service.
 * Handles incoming messages from all Meta channels (WhatsApp, Messenger, Instagram),
 * creates/finds conversations and contacts, persists messages, and fires socket events.
 */

import prisma from '../../config/prisma';
import { emitToTenant, emitToConversation, SOCKET_EVENTS } from '../../socket/socket.server';

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

export const processWhatsAppWebhook = async (body: any, connector: any) => {
  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;
    if (!changes) return;

    // Status updates (delivered, read, failed) — ignore for now
    if (changes.statuses) return;

    const messages = changes.messages;
    if (!messages?.length) return;

    for (const msg of messages) {
      const fromPhone = msg.from;              // e.g. "923001234567"
      const waMessageId = msg.id;
      const timestamp = new Date(parseInt(msg.timestamp) * 1000);

      // Extract text content (handle different message types)
      let content = '';
      let mediaUrl = '';
      let msgType = 'TEXT';

      if (msg.type === 'text') {
        content = msg.text?.body || '';
      } else if (['image', 'video', 'audio', 'document'].includes(msg.type)) {
        content = msg[msg.type]?.caption || `[${msg.type}]`;
        mediaUrl = msg[msg.type]?.link || '';
        msgType = msg.type.toUpperCase();
      } else if (msg.type === 'sticker') {
        content = '[Sticker]';
      } else {
        content = `[${msg.type}]`;
      }

      // Upsert contact by phone number
      const contact = await prisma.contact.upsert({
        where: {
          tenantId_phone: { tenantId: connector.tenantId, phone: fromPhone }
        },
        create: {
          tenantId: connector.tenantId,
          name: changes.contacts?.[0]?.profile?.name || fromPhone,
          phone: fromPhone,
        },
        update: {}
      });

      // Find or create open conversation for this contact + connector
      let conversation = await prisma.conversation.findFirst({
        where: {
          tenantId: connector.tenantId,
          connectorId: connector.id,
          externalId: fromPhone,
          status: { in: ['OPEN', 'PENDING'] },
        }
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            tenantId: connector.tenantId,
            contactId: contact.id,
            connectorId: connector.id,
            channel: 'WHATSAPP',
            externalId: fromPhone,
            status: 'OPEN',
          }
        });

        // Notify agents of new conversation
        emitToTenant(connector.tenantId, SOCKET_EVENTS.CONVERSATION_NEW, conversation);
      }

      // Persist message
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: 'CONTACT',
          content,
          type: msgType as any,
          mediaUrl: mediaUrl || null,
          createdAt: timestamp,
        }
      });

      // Update conversation last-activity
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      // Push to agents via socket
      emitToConversation(conversation.id, SOCKET_EVENTS.MESSAGE_NEW, message);
      emitToTenant(connector.tenantId, SOCKET_EVENTS.CONVERSATION_STATUS, {
        conversationId: conversation.id,
        lastMessage: { content, createdAt: timestamp },
        updatedAt: new Date(),
      });
    }
  } catch (err) {
    console.error('[Webhook] processWhatsAppWebhook error:', err);
  }
};

// ─── Messenger ────────────────────────────────────────────────────────────────

export const processMessengerWebhook = async (body: any, connector: any) => {
  try {
    const entries = body.entry || [];

    for (const entry of entries) {
      const messaging = entry.messaging || [];

      for (const event of messaging) {
        // Skip delivery/read events
        if (event.delivery || event.read || event.postback) continue;

        const psid = event.sender?.id;  // Page-Scoped ID — uniquely identifies the user
        const msg = event.message;
        if (!psid || !msg) continue;

        let content = msg.text || '';
        let mediaUrl = '';
        let msgType = 'TEXT';

        if (msg.attachments?.length) {
          const att = msg.attachments[0];
          content = `[${att.type}]`;
          mediaUrl = att.payload?.url || '';
          msgType = att.type.toUpperCase();
        }

        // Upsert contact by PSID stored in customData
        let contact = await prisma.contact.findFirst({
          where: {
            tenantId: connector.tenantId,
            customData: { path: ['psid'], equals: psid }
          }
        });

        if (!contact) {
          contact = await prisma.contact.create({
            data: {
              tenantId: connector.tenantId,
              name: `Messenger User ${psid.slice(-4)}`,
              customData: { psid },
            }
          });
        }

        // Find or create open conversation
        let conversation = await prisma.conversation.findFirst({
          where: {
            tenantId: connector.tenantId,
            connectorId: connector.id,
            externalId: psid,
            status: { in: ['OPEN', 'PENDING'] },
          }
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              tenantId: connector.tenantId,
              contactId: contact.id,
              connectorId: connector.id,
              channel: 'MESSENGER',
              externalId: psid,
              status: 'OPEN',
            }
          });

          emitToTenant(connector.tenantId, SOCKET_EVENTS.CONVERSATION_NEW, conversation);
        }

        const message = await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderType: 'CONTACT',
            content,
            type: msgType as any,
            mediaUrl: mediaUrl || null,
          }
        });

        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() }
        });

        emitToConversation(conversation.id, SOCKET_EVENTS.MESSAGE_NEW, message);
        emitToTenant(connector.tenantId, SOCKET_EVENTS.CONVERSATION_STATUS, {
          conversationId: conversation.id,
          lastMessage: { content, createdAt: message.createdAt },
          updatedAt: new Date(),
        });
      }
    }
  } catch (err) {
    console.error('[Webhook] processMessengerWebhook error:', err);
  }
};

// ─── Instagram ────────────────────────────────────────────────────────────────
// Instagram DMs use the same webhook format as Messenger but with different scoped IDs.

export const processInstagramWebhook = async (body: any, connector: any) => {
  // Instagram webhook payload is nearly identical to Messenger — reuse the handler
  return processMessengerWebhook(body, { ...connector, channel: 'INSTAGRAM' });
};
