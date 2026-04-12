import request from 'supertest';
import app from '../src/app';

describe('Routing Rules API', () => {
  let token: string;
  let ruleId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    token = res.body.token;
  });

  it('should create a new routing rule', async () => {
    const res = await request(app)
      .post('/api/routing-rules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Rule',
        conditions: { contentMatch: 'urgent' },
        action: { assignToTeam: '123' },
        priority: 1
      });
    
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Rule');
    ruleId = res.body.id;
  });

  it('should list routing rules', async () => {
    const res = await request(app)
      .get('/api/routing-rules')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should toggle routing rule status', async () => {
    const res = await request(app)
      .put(`/api/routing-rules/${ruleId}/toggle`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });
    
    expect(res.status).toBe(200);
    expect(res.body.isActive).toBe(false);
  });

  it('should delete a routing rule', async () => {
    const res = await request(app)
      .delete(`/api/routing-rules/${ruleId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(204);
  });
});
