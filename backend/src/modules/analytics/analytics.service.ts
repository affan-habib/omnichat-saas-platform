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

export const getPaginatedReport = async (tenantId: string, params: any) => {
  const { type = 'conversations', page = 1, limit = 10, search = '', status } = params;
  const skip = (page - 1) * limit;
  const take = Number(limit);

  const where: any = { tenantId };
  
  if (search) {
    if (type === 'agents') {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }];
    } else if (type === 'conversations') {
      where.OR = [{ id: { contains: search, mode: 'insensitive' } }];
    }
  }

  if (status && type === 'conversations') {
    where.status = status;
  }

  let data, total;

  if (type === 'agents') {
    [data, total] = await Promise.all([
      prisma.user.findMany({ 
        where: { ...where, role: 'AGENT' }, 
        skip, take,
        include: { _count: { select: { assignedConversations: true } } }
      }),
      prisma.user.count({ where: { ...where, role: 'AGENT' } })
    ]);
  } else if (type === 'messages') {
    [data, total] = await Promise.all([
      prisma.message.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { sender: true } }),
      prisma.message.count({ where })
    ]);
  } else {
    // Default: conversations
    [data, total] = await Promise.all([
      prisma.conversation.findMany({ 
        where, skip, take, orderBy: { updatedAt: 'desc' },
        include: { assignee: true } 
      }),
      prisma.conversation.count({ where })
    ]);
  }

  return { data, total, page: Number(page), lastPage: Math.ceil(total / limit) };
};
