import prisma from '../../config/prisma';

export const getConversations = async (tenantId: string, filters: any) => {
  const { status, assigneeId, teamId, channel } = filters;
  return await prisma.conversation.findMany({
    where: {
      tenantId,
      status: status || undefined,
      assigneeId: assigneeId || undefined,
      teamId: teamId || undefined,
      channel: channel || undefined,
    },
    include: {
      contact: true,
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      team: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      _count: { select: { messages: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });
};

export const createConversation = async (tenantId: string, data: any) => {
  return await prisma.conversation.create({
    data: { ...data, tenantId }
  });
};

export const getConversationById = async (id: string, tenantId: string) => {
  return await prisma.conversation.findUnique({
    where: { id, tenantId },
    include: {
      contact: true,
      assignee: true,
      team: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 50
      },
      tags: { include: { tag: true } }
    }
  });
};

export const updateConversation = async (id: string, tenantId: string, data: any) => {
  return await prisma.conversation.update({
    where: { id, tenantId },
    data
  });
};

export const assignConversation = async (id: string, tenantId: string, assigneeId: string | null) => {
  return await prisma.conversation.update({
    where: { id, tenantId },
    data: { assigneeId }
  });
};

export const transferConversation = async (id: string, tenantId: string, teamId: string | null) => {
  return await prisma.conversation.update({
    where: { id, tenantId },
    data: { teamId, assigneeId: null }
  });
};
