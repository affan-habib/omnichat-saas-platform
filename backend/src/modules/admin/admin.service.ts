import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';

export const createTenantManual = async (data: any) => {
  const { tenantName, slug, ownerName, ownerEmail, ownerPassword } = data;
  const hashedPassword = await bcrypt.hash(ownerPassword, 10);

  return await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: tenantName,
        slug: slug,
        status: 'ACTIVE' // Manually created by Superadmin
      }
    });

    const user = await tx.user.create({
      data: {
        tenantId: tenant.id,
        name: ownerName,
        email: ownerEmail,
        password: hashedPassword,
        role: 'OWNER',
        status: 'ONLINE',
        isActive: true,
        needsPasswordChange: true // Force them to change it on first login
      }
    });

    return { tenant, user };
  });
};

export const getAllTenants = async () => {
  return await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          users: true,
          conversations: true,
        }
      },
      users: {
        where: { role: 'OWNER' },
        select: { email: true, name: true },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateTenantStatus = async (id: string, status: any) => {
  return await prisma.tenant.update({
    where: { id },
    data: { status }
  });
};

export const getPlatformOverview = async () => {
  const [tenantCount, userCount, messageCount, activeConnectors] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.message.count(),
    prisma.connector.count({ where: { status: 'ACTIVE' } })
  ]);

  // Aggregate message volume by channel
  const channelStats = await prisma.conversation.groupBy({
    by: ['channel'],
    _count: true,
  });

  return {
    totals: {
      tenants: tenantCount,
      users: userCount,
      messages: messageCount,
      activeConnectors
    },
    channelStats
  };
};

export const getGlobalAuditLogs = async (limit = 100) => {
  return await prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      tenant: { select: { name: true } },
      user: { select: { name: true, email: true } }
    }
  });
};
