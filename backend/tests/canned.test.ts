import request from 'supertest';
import app from '../src/app';

describe('Canned Responses API', () => {
  let adminToken: string;
  let responseId: string;

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    adminToken = adminRes.body.token;
  });

  it('should create a canned response', async () => {
    const res = await request(app)
      .post('/api/canned-responses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Welcome Message',
        shortCode: '/welcome',
        content: 'Hello! How can I help you today?',
        category: 'General'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Welcome Message');
    responseId = res.body.id;
  });

  it('should list canned responses', async () => {
    const res = await request(app)
      .get('/api/canned-responses')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((r: any) => r.id === responseId)).toBe(true);
  });

  it('should delete a canned response', async () => {
    const res = await request(app)
      .delete(`/api/canned-responses/${responseId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect([200, 204]).toContain(res.status);
  });
});
