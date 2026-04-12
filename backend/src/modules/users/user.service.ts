import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (tenantId: string, currentUser: any) => {
  const where: any = { tenantId, isActive: true };

  if (currentUser.role === 'SUPERVISOR') {
    // Get teams the supervisor belongs to
    const supervisorTeams = await prisma.teamMember.findMany({
      where: { userId: currentUser.id },
      select: { teamId: true }
    });
    const teamIds = supervisorTeams.map(st => st.teamId);

    where.teamMemberships = {
      some: {
        teamId: { in: teamIds }
      }
    };
  } else if (currentUser.role === 'AGENT') {
     // Agents maybe only see themselves or their team? 
     // User said "agent will se their messages assigmed to them". 
     // For user list, maybe agents don't need to see everyone.
     // I'll limit agents to their team members too.
     const agentTeams = await prisma.teamMember.findMany({
       where: { userId: currentUser.id },
       select: { teamId: true }
     });
     const teamIds = agentTeams.map(at => at.teamId);
     where.teamMemberships = {
       some: {
         teamId: { in: teamIds }
       }
     };
  }

  return await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      avatarUrl: true,
      isActive: true,
      createdAt: true,
      teamMemberships: {
        include: { team: true }
      }
    }
  });
};

export const inviteUser = async (tenantId: string, data: any) => {
  const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);
  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      tenantId,
    }
  });
};

export const updateUser = async (id: string, tenantId: string, data: any) => {
  const updateData = { ...data };
  
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  return await prisma.user.update({
    where: { id, tenantId },
    data: updateData
  });
};

export const deleteUser = async (id: string, tenantId: string) => {
  return await prisma.user.update({
    where: { id, tenantId },
    data: { isActive: false }
  });
};

export const updateStatus = async (id: string, tenantId: string, status: any) => {
  return await prisma.user.update({
    where: { id, tenantId },
    data: { status }
  });
};
