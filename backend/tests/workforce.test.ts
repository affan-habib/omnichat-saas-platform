import request from 'supertest';
import app from '../src/app';

describe('Workforce API', () => {
  let adminToken: string;
  let supervisorToken: string;
  let supervisorId: string;
  let teamId: string;
  const timestamp = Date.now();
  const supervisorEmail = `supervisor_${timestamp}@acme.com`;

  beforeAll(async () => {
    // Get Admin Token
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    adminToken = adminRes.body.token;

    // Create a Team
    const teamRes = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `VIP Team ${timestamp}`, color: '#ff0000' });
    teamId = teamRes.body.id;

    // Create a Supervisor
    const supRes = await request(app)
      .post('/api/users/invite')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Supervisor User',
        email: supervisorEmail,
        password: 'password123',
        role: 'SUPERVISOR'
      });
    
    expect(supRes.status).toBe(201);
    supervisorId = supRes.body.id;

    // Assign Supervisor to Team
    await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userId: supervisorId });

    // Login as Supervisor
    const supLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: supervisorEmail, password: 'password123' });
    
    expect(supLoginRes.status).toBe(200);
    supervisorToken = supLoginRes.body.token;
  });

  it('should list all users for admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should list only team members for supervisor', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${supervisorToken}`);
    
    expect(res.status).toBe(200);
    // Should see at least themselves
    const self = res.body.find((u: any) => u.id === supervisorId);
    expect(self).toBeDefined();
    
    // Check that admin is NOT visible (since admin is not in the same team)
    const adminUser = res.body.find((u: any) => u.role === 'ADMIN');
    expect(adminUser).toBeUndefined();
  });

  it('should list all teams for admin', async () => {
    const res = await request(app)
      .get('/api/teams')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
