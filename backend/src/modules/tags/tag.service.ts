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

export const addTagToConversation = async (conversationId: string, tagId: string) => {
  return await prisma.conversationTag.create({
    data: { conversationId, tagId }
  });
};

export const removeTagFromConversation = async (conversationId: string, tagId: string) => {
  return await prisma.conversationTag.delete({
    where: { conversationId_tagId: { conversationId, tagId } }
  });
};
