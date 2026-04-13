import prisma from '../../config/prisma';

export const listConnectors = async (tenantId: string) => {
  return await prisma.connector.findMany({
    where: { tenantId },
    select: {
      id: true, name: true, channel: true, status: true,
      waPhoneNumberId: true, waBusinessId: true,
      fbPageId: true, igAccountId: true,
      createdAt: true, updatedAt: true,
      // Never expose tokens in list responses
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getConnector = async (id: string, tenantId: string) => {
  return await prisma.connector.findUnique({
    where: { id },
    select: {
      id: true, tenantId: true, name: true, channel: true, status: true,
      waPhoneNumberId: true, waBusinessId: true,
      fbPageId: true, igAccountId: true,
      webhookVerifyToken: true,
      createdAt: true, updatedAt: true,
      // Tokens still excluded from GET — only admin can update them
    }
  });
};

export const createConnector = async (tenantId: string, data: any) => {
  return await prisma.connector.create({
    data: { ...data, tenantId }
  });
};

export const updateConnector = async (id: string, tenantId: string, data: any) => {
  return await prisma.connector.update({
    where: { id },
    data
  });
};

export const deleteConnector = async (id: string, tenantId: string) => {
  return await prisma.connector.delete({ where: { id } });
};

export const testConnector = async (id: string, tenantId: string) => {
  // In future: ping Meta API with the stored token to verify it's still valid
  const connector = await prisma.connector.findUnique({ where: { id } });
  if (!connector || connector.tenantId !== tenantId) return null;

  // For now, return the connector status and basic info
  return {
    id: connector.id,
    channel: connector.channel,
    status: connector.status,
    healthy: connector.status === 'ACTIVE',
  };
};
