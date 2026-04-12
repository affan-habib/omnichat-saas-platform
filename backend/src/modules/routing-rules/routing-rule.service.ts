import prisma from '../../config/prisma';

export const getRules = async (tenantId: string) => {
  return await prisma.routingRule.findMany({
    where: { tenantId },
    orderBy: { priority: 'desc' }
  });
};

export const createRule = async (tenantId: string, data: any) => {
  return await prisma.routingRule.create({
    data: { ...data, tenantId }
  });
};

export const updateRule = async (id: string, tenantId: string, data: any) => {
  return await prisma.routingRule.update({
    where: { id, tenantId },
    data
  });
};

export const deleteRule = async (id: string, tenantId: string) => {
  return await prisma.routingRule.delete({
    where: { id, tenantId }
  });
};
