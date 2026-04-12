import request from 'supertest';
import app from '../src/app';

describe('Conversations API', () => {
  let adminToken: string;
  let agentToken: string;
  let agentId: string;
  let convoId: string;
  let contactId: string;

  beforeAll(async () => {
    // Get Admin Token
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    adminToken = adminRes.body.token;

    // Get Agent Info
    const agentRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'agent1@acme.com', password: 'password123' });
    agentToken = agentRes.body.token;
    agentId = agentRes.body.user.id;

    // Create a contact first
    const contactRes = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test User', phone: '1234567890' });
    contactId = contactRes.body.id;
  });

  it('should list all conversations for admin', async () => {
    const res = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should list only assigned conversations for agent', async () => {
    // Assign at least one convo to this agent later or check current
    const res = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${agentToken}`);
    
    expect(res.status).toBe(200);
    res.body.forEach((c: any) => {
      expect(c.assigneeId).toBe(agentId);
    });
  });

  it('should create a new conversation', async () => {
    const res = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        contactId,
        channel: 'WHATSAPP',
        subject: 'Test Conversation'
      });
    
    expect(res.status).toBe(201);
    convoId = res.body.id;
  });

  it('should assign an agent to a conversation', async () => {
    expect(convoId).toBeDefined();
    const res = await request(app)
      .put(`/api/conversations/${convoId}/assign`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ assigneeId: agentId });
    
    expect(res.status).toBe(200);
    expect(res.body.assigneeId).toBe(agentId);
  });

  it('should update conversation status', async () => {
    expect(convoId).toBeDefined();
    const res = await request(app)
      .put(`/api/conversations/${convoId}/status`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ status: 'RESOLVED', disposition: 'inquiry' });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('RESOLVED');
  });
});
