import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database cleanup...');
  // Order matters for relational cleanup
  await prisma.auditLog.deleteMany();
  await prisma.routingRule.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationTag.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.cannedResponse.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.connector.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  console.log('✅ Cleanup complete.');

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

  // 6. SAMPLE DATA FOR ACME
  const contactA = await prisma.contact.create({
    data: { tenantId: tenantA.id, name: 'John Smith', email: 'john@example.com' }
  });

  const agentAcme = await prisma.user.findUnique({ where: { email: 'agent@acme.com' } });

  const convoA = await prisma.conversation.create({
    data: {
      tenantId: tenantA.id,
      contactId: contactA.id,
      channel: 'WHATSAPP',
      status: 'OPEN',
      subject: 'Order inquiry #12345',
      assigneeId: agentAcme?.id
    }
  });

  await prisma.message.create({
    data: {
      conversationId: convoA.id,
      senderType: 'CONTACT',
      content: 'Hi, when will my order arrive?',
    }
  });

  console.log('✅ Seed Complete: Platform Superadmin + 2 Full Tenants + Sample Data created.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
