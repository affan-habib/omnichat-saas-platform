import request from 'supertest';
import app from '../src/app';

describe('Tenant API', () => {
  let adminToken: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    adminToken = res.body.token;
  });

  it('should get current tenant settings', async () => {
    const res = await request(app)
      .get('/api/tenants/me')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('slug');
  });

  it('should update tenant settings', async () => {
    const res = await request(app)
      .put('/api/tenants/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Acme Corp',
        settings: {
          brandColor: '#ff0000',
          whiteLabelEnabled: true,
          adminChatting: false
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Acme Corp');
    expect((res.body.settings as any).brandColor).toBe('#ff0000');
  });

  it('should merge settings on partial update', async () => {
    // First set full settings
    await request(app)
      .put('/api/tenants/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ settings: { brandColor: '#6366f1', timezone: 'UTC' } });

    // Then do a partial update
    const res = await request(app)
      .put('/api/tenants/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ settings: { timezone: 'Asia/Karachi' } });

    expect(res.status).toBe(200);
    // Both keys should be present after merge
    expect((res.body.settings as any).brandColor).toBe('#6366f1');
    expect((res.body.settings as any).timezone).toBe('Asia/Karachi');
  });
});

describe('Auth - Change Password', () => {
  let agentToken: string;
  const timestamp = Date.now();
  const agentEmail = `changepw_agent_${timestamp}@acme.com`;

  beforeAll(async () => {
    // Get admin token to create a test user
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    const adminToken = adminRes.body.token;

    // Create test agent
    await request(app)
      .post('/api/users/invite')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'PW Test Agent', email: agentEmail, password: 'oldpass123', role: 'AGENT' });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: agentEmail, password: 'oldpass123' });
    agentToken = loginRes.body.token;
  });

  it('should reject change-password with wrong current password', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ currentPassword: 'wrong!!!', newPassword: 'newpass456' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/incorrect/i);
  });

  it('should change password successfully with correct current password', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ currentPassword: 'oldpass123', newPassword: 'newpass456' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/updated/i);
  });

  it('should be able to login with new password after rotation', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: agentEmail, password: 'newpass456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
