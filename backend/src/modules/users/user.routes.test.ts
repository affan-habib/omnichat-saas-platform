import request from 'supertest';
import app from '../../app';
import prisma from '../../config/prisma';

describe('User Routes API', () => {
  let token: string;
  let userId: string;
  let tenantId: string;

  beforeAll(async () => {
    // We assume the DB has been seeded with standard OmniChat Dev Seed.
    // Let's login to get a token and IDs
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    
    token = res.body.token;
    userId = res.body.user.id;
    tenantId = res.body.user.tenantId;
  });

  it('should list users within the tenant', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch user metrics', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}/metrics`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openInboxCount');
    expect(res.body).toHaveProperty('resolvedTodayCount');
    expect(res.body).toHaveProperty('dailyTarget');
  });

  it('should update user status', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'AWAY' });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('AWAY');
  });
});
