import prisma from '../../config/prisma';

export const getCannedResponses = async (tenantId: string, query?: string) => {
  return await prisma.cannedResponse.findMany({
    where: {
      tenantId,
      OR: query ? [
        { shortCode: { contains: query, mode: 'insensitive' } },
        { title: { contains: query, mode: 'insensitive' } },
      ] : undefined,
    }
  });
};

export const createCannedResponse = async (tenantId: string, data: any) => {
  return await prisma.cannedResponse.create({
    data: { ...data, tenantId }
  });
};

export const updateCannedResponse = async (id: string, tenantId: string, data: any) => {
  return await prisma.cannedResponse.update({
    where: { id, tenantId },
    data
  });
};

export const deleteCannedResponse = async (id: string, tenantId: string) => {
  return await prisma.cannedResponse.delete({
    where: { id, tenantId }
  });
};
