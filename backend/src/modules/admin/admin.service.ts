import prisma from '../../config/prisma';

export const getAllTenants = async () => {
  return await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          users: true,
          conversations: true,
        }
      },
      users: {
        where: { role: 'OWNER' },
        select: { email: true, name: true },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateTenantStatus = async (id: string, status: any) => {
  return await prisma.tenant.update({
    where: { id },
    data: { status }
  });
};

export const getPlatformOverview = async () => {
  const [tenantCount, userCount, messageCount, activeConnectors] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.message.count(),
    prisma.connector.count({ where: { status: 'ACTIVE' } })
  ]);

  // Aggregate message volume by channel
  const channelStats = await prisma.conversation.groupBy({
    by: ['channel'],
    _count: true,
  });

  return {
    totals: {
      tenants: tenantCount,
      users: userCount,
      messages: messageCount,
      activeConnectors
    },
    channelStats
  };
};

export const getGlobalAuditLogs = async (limit = 100) => {
  return await prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      tenant: { select: { name: true } },
      user: { select: { name: true, email: true } }
    }
  });
};
