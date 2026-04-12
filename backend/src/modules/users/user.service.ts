import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (tenantId: string) => {
  return await prisma.user.findMany({
    where: { tenantId, isActive: true },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      avatarUrl: true,
      isActive: true,
      createdAt: true
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
  return await prisma.user.update({
    where: { id, tenantId },
    data
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
