import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create tenant
  const tenant = await prisma.tenant.create({
    data: { name: 'Acme Corp', slug: 'acme' },
  })

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@acme.com',
      name: 'Admin User',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
      status: 'ONLINE',
    },
  })

  // Create agents
  const agent1 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'agent1@acme.com',
      name: 'Sarah Miller',
      password: await bcrypt.hash('password123', 10),
      role: 'AGENT',
      status: 'ONLINE',
    },
  })

  // Create team
  const team = await prisma.team.create({
    data: { tenantId: tenant.id, name: 'Support', color: '#6366f1' },
  })

  await prisma.teamMember.create({
    data: { userId: agent1.id, teamId: team.id },
  })

  // Create contact & conversation with seeded messages
  const contact = await prisma.contact.create({
    data: { tenantId: tenant.id, name: 'John Doe', phone: '+12025550100' },
  })

  const convo = await prisma.conversation.create({
    data: {
      tenantId: tenant.id,
      contactId: contact.id,
      assigneeId: agent1.id,
      teamId: team.id,
      channel: 'WHATSAPP',
      status: 'OPEN',
    },
  })

  await prisma.message.createMany({
    data: [
      { conversationId: convo.id, senderType: 'CONTACT', content: 'Hi, I need help with my order.' },
      { conversationId: convo.id, senderType: 'AGENT', senderId: agent1.id, content: 'Sure! Can you share your order number?' },
      { conversationId: convo.id, senderType: 'CONTACT', content: '#ORD-4521' },
    ],
  })

  console.log('✅ Seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
