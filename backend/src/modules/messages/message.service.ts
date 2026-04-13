import prisma from '../../config/prisma';

export const getMessages = async (conversationId: string, tenantId: string, limit = 50, cursor?: string) => {
  // Verify conversation belongs to tenant
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId, tenantId }
  });
  if (!convo) throw new Error('Unauthorized');

  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
  });
};

export const sendMessage = async (conversationId: string, tenantId: string, data: any) => {
  // Verify conversation belongs to tenant + load connector info for outbound
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId, tenantId },
    include: { connector: true }
  });
  if (!convo) throw new Error('Unauthorized');

  const message = await prisma.$transaction(async (tx) => {
    const msg = await tx.message.create({ data: { ...data, conversationId } });
    await tx.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    return msg;
  });

  // ── Outbound Meta delivery ────────────────────────────────────
  // Only fire when: message is from an AGENT, and the conversation has a connector
  if (data.senderType === 'AGENT' && convo.connector && convo.externalId && data.type === 'TEXT') {
    const connector = convo.connector;

    try {
      if (connector.channel === 'WHATSAPP' && connector.waPhoneNumberId && connector.waAccessToken) {
        const { sendWhatsAppText } = await import('../../services/meta/whatsapp.client');
        await sendWhatsAppText({
          phoneNumberId: connector.waPhoneNumberId,
          accessToken: connector.waAccessToken,
          to: convo.externalId,
          text: data.content,
        });
      } else if (
        (connector.channel === 'MESSENGER' || connector.channel === 'INSTAGRAM') &&
        connector.fbPageAccessToken
      ) {
        const { sendMessengerText } = await import('../../services/meta/messenger.client');
        await sendMessengerText({
          pageAccessToken: connector.fbPageAccessToken,
          recipientId: convo.externalId,
          text: data.content,
        });
      }
    } catch (err: any) {
      // Non-fatal: log but don't block the response
      console.error(`[Meta] Outbound delivery failed for convo ${conversationId}:`, err.message);
    }
  }

  return message;
};

export const markAsRead = async (id: string, tenantId: string) => {
  // This is a bit tricky with tenantId check if message doesn't have it directly.
  // We should ideally check through conversation.
  const message = await prisma.message.findUnique({
    where: { id },
    include: { conversation: { select: { tenantId: true } } }
  });

  if (!message || message.conversation.tenantId !== tenantId) {
    throw new Error('Unauthorized');
  }

  return await prisma.message.update({
    where: { id },
    data: { isRead: true }
  });
};
