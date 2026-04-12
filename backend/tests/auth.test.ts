import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  const credentials = {
    email: 'admin@acme.com',
    password: 'password123'
  };

  let token: string;

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(credentials);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(credentials.email);
    token = res.body.token;
  });

  it('should fail to login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'wrongpassword' });
    
    expect(res.status).toBe(401);
  });

  it('should get current user info with token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(credentials.email);
  });

  it('should fail to get me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
