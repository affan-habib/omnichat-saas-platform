import prisma from '../../config/prisma';

export const getOverview = async (tenantId: string) => {
  const [totalConversations, openConversations, resolvedConversations] = await Promise.all([
    prisma.conversation.count({ where: { tenantId } }),
    prisma.conversation.count({ where: { tenantId, status: 'OPEN' } }),
    prisma.conversation.count({ where: { tenantId, status: 'RESOLVED' } }),
  ]);

  return {
    totalConversations,
    openConversations,
    resolvedConversations,
    resolutionRate: totalConversations > 0 ? (resolvedConversations / totalConversations) * 100 : 0
  };
};

export const getAgentStats = async (tenantId: string) => {
  return await prisma.user.findMany({
    where: { tenantId, role: 'AGENT' },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          assignedConversations: { where: { status: 'RESOLVED' } }
        }
      }
    }
  });
};

export const getChannelStats = async (tenantId: string) => {
  const stats = await prisma.conversation.groupBy({
    by: ['channel'],
    where: { tenantId },
    _count: { id: true }
  });
  return stats;
};

export const getDispositionStats = async (tenantId: string) => {
  const stats = await prisma.conversation.groupBy({
    by: ['disposition'],
    where: { tenantId, NOT: { disposition: null } },
    _count: { id: true }
  });
  return stats;
};
