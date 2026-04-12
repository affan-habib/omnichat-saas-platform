import prisma from '../../config/prisma';

export const getTags = async (tenantId: string) => {
  return await prisma.tag.findMany({
    where: { tenantId }
  });
};

export const createTag = async (tenantId: string, data: any) => {
  return await prisma.tag.create({
    data: { ...data, tenantId }
  });
};

export const updateTag = async (id: string, tenantId: string, data: any) => {
  return await prisma.tag.update({
    where: { id, tenantId },
    data
  });
};

export const deleteTag = async (id: string, tenantId: string) => {
  return await prisma.tag.delete({
    where: { id, tenantId }
  });
};

export const addTagToConversation = async (conversationId: string, tagId: string) => {
  return await prisma.conversationTag.upsert({
    where: { conversationId_tagId: { conversationId, tagId } },
    create: { conversationId, tagId },
    update: {}
  });
};

export const removeTagFromConversation = async (conversationId: string, tagId: string) => {
  return await prisma.conversationTag.delete({
    where: { conversationId_tagId: { conversationId, tagId } }
  });
};
