import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // 1. TENANT A: Acme Corp
  const tenantA = await prisma.tenant.create({
    data: { name: 'Acme Corp', slug: 'acme', status: 'ACTIVE' },
  })

  // 2. TENANT B: Globex Core
  const tenantB = await prisma.tenant.create({
    data: { name: 'Globex Core', slug: 'globex', status: 'ACTIVE' },
  })

  // 3. GLOBAL SUPERADMIN
  await prisma.user.create({
    data: {
      tenantId: tenantA.id,
      email: 'superadmin@omnichat.com',
      name: 'Platform Founder',
      password: adminPassword,
      role: 'SUPERADMIN',
      status: 'ONLINE',
      needsPasswordChange: false,
    },
  })

  // 4. USERS FOR ACME CORP
  const acmeUsers = [
    { email: 'admin@acme.com', name: 'Alice Admin', role: 'ADMIN' as const },
    { email: 'supervisor@acme.com', name: 'Sam Supervisor', role: 'SUPERVISOR' as const },
    { email: 'agent@acme.com', name: 'Andy Agent', role: 'AGENT' as const },
  ];

  for (const u of acmeUsers) {
    await prisma.user.create({
      data: { ...u, tenantId: tenantA.id, password, status: 'ONLINE', needsPasswordChange: false }
    });
  }

  // 5. USERS FOR GLOBEX CORE
  const globexUsers = [
    { email: 'admin@globex.com', name: 'Grace Globex', role: 'ADMIN' as const },
    { email: 'supervisor@globex.com', name: 'Steve Super', role: 'SUPERVISOR' as const },
    { email: 'agent@globex.com', name: 'Annie Agent', role: 'AGENT' as const },
  ];

  for (const u of globexUsers) {
    await prisma.user.create({
      data: { ...u, tenantId: tenantB.id, password, status: 'ONLINE', needsPasswordChange: false }
    });
  }

  console.log('✅ Seed Complete: Platform Superadmin + 2 Full Tenants created.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
