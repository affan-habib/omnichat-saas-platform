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
