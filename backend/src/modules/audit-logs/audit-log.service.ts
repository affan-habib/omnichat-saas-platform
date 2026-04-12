import prisma from '../../config/prisma';

export const getLogs = async (tenantId: string, filters: any = {}) => {
  const { action, resource, userId, from, to } = filters;

  const where: any = { tenantId };
  if (action) where.action = { contains: action, mode: 'insensitive' };
  if (resource) where.resource = { contains: resource, mode: 'insensitive' };
  if (userId) where.userId = userId;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  return await prisma.auditLog.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 200
  });
};

export const createLog = async (tenantId: string, userId: string, data: any) => {
  return await prisma.auditLog.create({
    data: {
      ...data,
      userId,
      tenantId
    }
  });
};
