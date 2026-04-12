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
  // Verify conversation belongs to tenant
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId, tenantId }
  });
  if (!convo) throw new Error('Unauthorized');

  return await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        ...data,
        conversationId,
      }
    });

    // Update conversation updatedAt timestamp
    await tx.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return message;
  });
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
