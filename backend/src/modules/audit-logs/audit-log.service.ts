import prisma from '../../config/prisma';

export const getLogs = async (tenantId: string) => {
  return await prisma.auditLog.findMany({
    where: { tenantId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
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
