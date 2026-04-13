/**
 * Jest Global Setup — seeds the database before any test runs.
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

module.exports = async () => {
  // Clean slate
  await prisma.message.deleteMany();
  await prisma.conversationTag.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.cannedResponse.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.routingRule.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.connector.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Seed tenant
  const tenant = await prisma.tenant.create({
    data: { name: 'Acme Corp', slug: 'acme' }
  });

  // Seed users
  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@acme.com',
      name: 'Admin User',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
      status: 'ONLINE',
      needsPasswordChange: false,
    }
  });

  const agent1 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'agent1@acme.com',
      name: 'Sarah Miller',
      password: await bcrypt.hash('password123', 10),
      role: 'AGENT',
      status: 'ONLINE',
      needsPasswordChange: false,
    }
  });

  // Seed team
  const team = await prisma.team.create({
    data: { tenantId: tenant.id, name: 'Support', color: '#6366f1' }
  });

  await prisma.teamMember.create({
    data: { userId: agent1.id, teamId: team.id }
  });

  // Seed contact & conversation
  const contact = await prisma.contact.create({
    data: { tenantId: tenant.id, name: 'John Doe', phone: '+12025550100' }
  });

  const convo = await prisma.conversation.create({
    data: {
      tenantId: tenant.id,
      contactId: contact.id,
      assigneeId: agent1.id,
      teamId: team.id,
      channel: 'WHATSAPP',
      status: 'OPEN',
    }
  });

  await prisma.message.createMany({
    data: [
      { conversationId: convo.id, senderType: 'CONTACT', content: 'Hi, I need help.' },
      { conversationId: convo.id, senderType: 'AGENT', senderId: agent1.id, content: 'Sure! How can I help?' },
    ]
  });

  // Seed canned response
  await prisma.cannedResponse.create({
    data: {
      tenantId: tenant.id,
      shortCode: '/hello',
      title: 'Hello',
      content: 'Hello! How can I help you today?',
      category: 'General'
    }
  });

  // Seed tag
  await prisma.tag.create({
    data: { tenantId: tenant.id, name: 'VIP', color: '#f59e0b' }
  });

  // Seed routing rule
  await prisma.routingRule.create({
    data: {
      tenantId: tenant.id,
      name: 'WhatsApp → Support Team',
      priority: 1,
      conditions: [{ field: 'channel', operator: 'eq', value: 'WHATSAPP' }],
      action: { assignToTeam: team.id },
      isActive: true,
    }
  });

  // Seed audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: admin.id,
      action: 'USER_INVITED',
      resource: 'USER',
      details: { email: agent1.email }
    }
  });

  // Seed connector
  await prisma.connector.create({
    data: {
      tenantId: tenant.id,
      name: 'WhatsApp Test',
      channel: 'WHATSAPP',
      status: 'INACTIVE',
      webhookVerifyToken: 'test_verify_token',
    }
  });

  await prisma.$disconnect();
  console.log('[Test Setup] Database seeded successfully');
};
