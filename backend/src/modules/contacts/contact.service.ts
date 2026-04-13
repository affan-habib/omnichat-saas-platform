import prisma from '../../config/prisma';

export const getContacts = async (tenantId: string, query?: string) => {
  return await prisma.contact.findMany({
    where: {
      tenantId,
      OR: query ? [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
      ] : undefined,
    },
    include: {
      _count: {
        select: { conversations: true }
      },
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createContact = async (tenantId: string, data: any) => {
  return await prisma.contact.create({
    data: { ...data, tenantId }
  });
};

export const getContactById = async (id: string, tenantId: string) => {
  return await prisma.contact.findUnique({
    where: { id, tenantId },
    include: { conversations: true }
  });
};

export const updateContact = async (id: string, tenantId: string, data: any) => {
  return await prisma.contact.update({
    where: { id, tenantId },
    data
  });
};

export const deleteContact = async (id: string, tenantId: string) => {
  return await prisma.contact.delete({
    where: { id, tenantId }
  });
};

export const getContactMetrics = async (tenantId: string) => {
  const total = await prisma.contact.count({ where: { tenantId } });
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newlyAcquired = await prisma.contact.count({
    where: { tenantId, createdAt: { gte: thirtyDaysAgo } }
  });

  // Calculate mock or real representations for Churn and High Value based on data patterns
  const activeContacts = await prisma.conversation.groupBy({
    by: ['contactId'],
    where: { tenantId, updatedAt: { gte: thirtyDaysAgo } },
  });
  
  const highValueEstimate = Math.ceil(activeContacts.length * 0.4); 
  const churnRiskEstimate = Math.max(0, total - newlyAcquired - activeContacts.length);

  return {
    total,
    newlyAcquired,
    highValue: highValueEstimate,
    churnRisk: churnRiskEstimate,
    growthRate: total === 0 ? 0 : Math.round((newlyAcquired / total) * 100)
  };
};
