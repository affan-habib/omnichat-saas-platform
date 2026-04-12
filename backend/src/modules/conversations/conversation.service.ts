import prisma from '../../config/prisma';

export const getConversations = async (tenantId: string, filters: any, user: any) => {
  const { status, assigneeId, teamId, channel } = filters;
  
  const where: any = {
    tenantId,
    status: status || undefined,
    channel: channel || undefined,
  };

  // Role-based visibility & Filter Application
  if (user.role === 'AGENT') {
    // Agents ONLY see conversations assigned to them
    where.assigneeId = user.id;
  } else if (user.role === 'SUPERVISOR') {
    // Get teams the supervisor belongs to
    const supervisorTeams = await prisma.teamMember.findMany({
      where: { userId: user.id },
      select: { teamId: true }
    });
    const teamIds = supervisorTeams.map(st => st.teamId);
    
    // Supervisors see team chats OR their own chats
    const roleBaseQuery = {
      OR: [
        { teamId: { in: teamIds } },
        { assigneeId: user.id }
      ]
    };

    // Apply specific filters if provided
    if (assigneeId === 'null') {
      where.assigneeId = null;
    } else if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (teamId === 'null') {
      where.teamId = null;
    } else if (teamId) {
       where.teamId = teamId;
    }

    // Merge RBAC with filters
    where.AND = [roleBaseQuery];
  } else if (user.role === 'ADMIN' || user.role === 'OWNER') {
    // Admins see everything, just apply filters
    if (assigneeId === 'null') {
      where.assigneeId = null;
    } else if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (teamId === 'null') {
      where.teamId = null;
    } else if (teamId) {
      where.teamId = teamId;
    }
  }

  return await prisma.conversation.findMany({
    where,
    include: {
      contact: true,
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      team: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      _count: { select: { messages: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });
};

export const createConversation = async (tenantId: string, data: any) => {
  return await prisma.conversation.create({
    data: { ...data, tenantId }
  });
};

export const getConversationById = async (id: string, tenantId: string) => {
  return await prisma.conversation.findUnique({
    where: { id, tenantId },
    include: {
      contact: true,
      assignee: true,
      team: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 50
      },
      tags: { include: { tag: true } }
    }
  });
};

export const updateConversation = async (id: string, tenantId: string, data: any) => {
  return await prisma.conversation.update({
    where: { id, tenantId },
    data
  });
};

export const assignConversation = async (id: string, tenantId: string, assigneeId: string | null) => {
  return await prisma.conversation.update({
    where: { id, tenantId },
    data: { assigneeId }
  });
};

export const transferConversation = async (id: string, tenantId: string, teamId: string | null) => {
  return await prisma.conversation.update({
    where: { id, tenantId },
    data: { teamId, assigneeId: null }
  });
};

export const updateStatus = async (id: string, tenantId: string, data: any) => {
  return await prisma.conversation.update({
    where: { id, tenantId },
    data
  });
};
