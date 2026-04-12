import prisma from '../../config/prisma';

// GET /api/tenants/me
export const getTenantSettings = async (tenantId: string) => {
  return await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true, name: true, slug: true, settings: true, createdAt: true }
  });
};

// PUT /api/tenants/me
export const updateTenantSettings = async (tenantId: string, data: any) => {
  const { name, settings } = data;

  // Deep-merge incoming settings with existing ones
  const existing = await prisma.tenant.findUnique({ where: { id: tenantId } });
  const currentSettings = (existing?.settings as any) || {};
  const mergedSettings = settings ? { ...currentSettings, ...settings } : currentSettings;

  return await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...(name && { name }),
      settings: mergedSettings
    },
    select: { id: true, name: true, slug: true, settings: true, createdAt: true }
  });
};
