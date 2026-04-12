import request from 'supertest';
import app from '../src/app';

describe('Analytics API', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    token = res.body.token;
  });

  it('should get overview analytics', async () => {
    const res = await request(app)
      .get('/api/analytics/overview')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalConversations');
    expect(res.body).toHaveProperty('openConversations');
    expect(res.body).toHaveProperty('resolvedConversations');
  });

  it('should get agent analytics', async () => {
    const res = await request(app)
      .get('/api/analytics/agents')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get channel analytics', async () => {
    const res = await request(app)
      .get('/api/analytics/channels')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get disposition analytics', async () => {
    const res = await request(app)
      .get('/api/analytics/dispositions')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
