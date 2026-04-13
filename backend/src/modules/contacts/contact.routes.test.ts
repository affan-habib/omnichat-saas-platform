import request from 'supertest';
import app from '../../app';
import prisma from '../../config/prisma';

describe('Contact Routes API', () => {
  let token: string;
  let tenantId: string;

  beforeAll(async () => {
    // Get a valid internal token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    
    token = res.body.token;
    tenantId = res.body.user.tenantId;
  });

  it('should list contacts within the tenant', async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch contact metrics', async () => {
    const res = await request(app)
      .get('/api/contacts/metrics')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('newlyAcquired');
    expect(res.body).toHaveProperty('highValue');
    expect(res.body).toHaveProperty('churnRisk');
    expect(res.body).toHaveProperty('growthRate');
  });

  it('should create a contact', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test CRM Contact',
        email: 'crm.test@example.com',
        phone: '+1 800 555 1234'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test CRM Contact');
  });
});
