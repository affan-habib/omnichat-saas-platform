import request from 'supertest';
import app from '../src/app';

describe('Messages API', () => {
  let token: string;
  let convoId: string;
  let contactId: string;
  let messageId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    token = res.body.token;

    const contactRes = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Message Test User', phone: '0987654321' });
    contactId = contactRes.body.id;

    const convoRes = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        contactId,
        channel: 'WHATSAPP',
        subject: 'Msg Test Convo'
      });
    convoId = convoRes.body.id;
  });

  it('should send a message to a conversation', async () => {
    const res = await request(app)
      .post(`/api/messages/conversation/${convoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Hello, testing messages',
        type: 'TEXT'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Hello, testing messages');
    messageId = res.body.id;
  });

  it('should get messages for a conversation', async () => {
    const res = await request(app)
      .get(`/api/messages/conversation/${convoId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should mark a message as read', async () => {
    const res = await request(app)
      .put(`/api/messages/${messageId}/read`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.isRead).toBe(true);
  });
});
