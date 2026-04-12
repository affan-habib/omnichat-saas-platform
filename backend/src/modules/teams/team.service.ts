import prisma from '../../config/prisma';

export const getTeams = async (tenantId: string) => {
  return await prisma.team.findMany({
    where: { tenantId },
    include: {
      _count: { select: { members: true } }
    }
  });
};

export const createTeam = async (tenantId: string, data: any) => {
  return await prisma.team.create({
    data: { ...data, tenantId }
  });
};

export const updateTeam = async (id: string, tenantId: string, data: any) => {
  return await prisma.team.update({
    where: { id, tenantId },
    data
  });
};

export const deleteTeam = async (id: string, tenantId: string) => {
  return await prisma.team.delete({
    where: { id, tenantId }
  });
};

export const addMember = async (teamId: string, userId: string) => {
  return await prisma.teamMember.create({
    data: { teamId, userId }
  });
};

export const removeMember = async (teamId: string, userId: string) => {
  return await prisma.teamMember.delete({
    where: { userId_teamId: { userId, teamId } }
  });
};
