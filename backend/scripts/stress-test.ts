import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function stressTest() {
  console.log('🚀 Starting Stress Test...');
  
  // Get a tenant and agent to work with
  const tenant = await prisma.tenant.findFirst({ where: { slug: 'acme' } });
  const agent = await prisma.user.findFirst({ where: { email: 'agent@acme.com' } });

  if (!tenant || !agent) {
    console.error('❌ Acme tenant or agent not found. Please seed first.');
    return;
  }

  const ITERATIONS = 500;
  console.log(`📦 Simulating ${ITERATIONS} concurrent conversations and 2000 messages...`);

  const startTime = Date.now();

  try {
    // 1. Create Contacts in Bulk
    console.log('👥 Creating 500 contacts...');
    const contactPromises = Array.of(...Array(ITERATIONS)).map(() => 
      prisma.contact.create({
        data: {
          tenantId: tenant.id,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
        }
      })
    );
    const contacts = await Promise.all(contactPromises);
    console.log(`✅ ${contacts.length} contacts created.`);

    // 2. Create Conversations
    console.log('💬 Creating 500 conversations...');
    const convoPromises = contacts.map(c => 
      prisma.conversation.create({
        data: {
          tenantId: tenant.id,
          contactId: c.id,
          channel: 'WHATSAPP',
          status: 'OPEN',
          subject: faker.commerce.productDescription().slice(0, 100),
          assigneeId: agent.id
        }
      })
    );
    const convos = await Promise.all(convoPromises);
    console.log(`✅ ${convos.length} conversations created.`);

    // 3. Blast Messages
    console.log('✉️ Blasting 2000 messages...');
    const messagePromises = [];
    for(let i=0; i < 2000; i++) {
        const randomConvo = convos[Math.floor(Math.random() * convos.length)];
        messagePromises.push(
            prisma.message.create({
                data: {
                    conversationId: randomConvo.id,
                    senderType: i % 2 === 0 ? 'CONTACT' : 'AGENT',
                    content: faker.lorem.sentence(),
                    senderId: i % 2 === 0 ? null : agent.id
                }
            })
        );
        // Batch them to avoid connection pool exhaustion
        if (messagePromises.length >= 100) {
            await Promise.all(messagePromises);
            messagePromises.length = 0;
        }
    }
    await Promise.all(messagePromises);
    console.log('✅ 2000 messages persisted.');

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n--- Stress Test Results ---');
    console.log(`⏱ Total Duration: ${duration}s`);
    console.log(`📊 Avg Write Speed: ${Math.round((ITERATIONS * 2 + 2000) / duration)} ops/sec`);
    console.log('✅ Stress test complete. Checking data integrity...');
    
    const count = await prisma.conversation.count({ where: { tenantId: tenant.id } });
    console.log(`📈 Final Conversation Count for Acme: ${count}`);

  } catch (error) {
    console.error('❌ Stress test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

stressTest();
