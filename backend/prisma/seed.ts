import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

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
      data: { ...u, tenantId: tenantA.id, password, status: 'ONLINE', needsPasswordChange: false, settings: { dailyTarget: 15 } }
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

  // 6. MASSIVE REALISTIC SEED DATA FOR ACME
  console.log('📊 Generating 150 CRM Contacts & Analytical Data for Acme Corp...');
  const agentAcme = await prisma.user.findUnique({ where: { email: 'agent@acme.com' } });
  
  const createdContacts = [];

  for (let i = 0; i < 150; i++) {
    // Distribute creation dates over the last 90 days
    const createdDate = faker.date.recent({ days: 90 });
    
    // Create contact
    const contact = await prisma.contact.create({
      data: {
        tenantId: tenantA.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        avatarUrl: faker.image.avatar(),
        createdAt: createdDate,
      }
    });

    createdContacts.push(contact);

    // 70% chance they have conversations
    if (Math.random() > 0.3) {
      const numConvos = faker.number.int({ min: 1, max: 4 });
      for (let j = 0; j < numConvos; j++) {
        // Resolve most conversations, keep some open
        const isResolved = Math.random() > 0.2;
        const convoStatus = isResolved ? 'RESOLVED' : 'OPEN';
        
        // Some were today, some were past
        const isToday = Math.random() > 0.7;
        const convoDate = isToday ? new Date() : faker.date.between({ from: createdDate, to: new Date() });

        const convo = await prisma.conversation.create({
          data: {
            tenantId: tenantA.id,
            contactId: contact.id,
            channel: faker.helpers.arrayElement(['WHATSAPP', 'MESSENGER', 'INSTAGRAM', 'EMAIL', 'WIDGET']),
            status: convoStatus,
            subject: `Inquiry regarding ${faker.commerce.productName()}`,
            assigneeId: faker.helpers.arrayElement([agentAcme?.id, null]),
            resolvedAt: isResolved ? faker.date.between({ from: convoDate, to: new Date() }) : null,
            createdAt: convoDate,
          }
        });

        // Messages
        await prisma.message.create({
          data: {
            conversationId: convo.id,
            senderType: 'CONTACT',
            content: faker.lorem.sentences({ min: 1, max: 3 }),
            createdAt: convoDate,
          }
        });

        if (isResolved) {
           await prisma.message.create({
            data: {
              conversationId: convo.id,
              senderType: 'AGENT',
              senderId: agentAcme?.id,
              content: `Hello! ${faker.lorem.sentences({ min: 2, max: 4 })}`,
            }
          });
        }
      }
    }
  }

  console.log('✅ Seed Complete: Analytics and CRM Dashboards populated!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
