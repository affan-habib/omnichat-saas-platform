import request from 'supertest';
import app from '../src/app';

describe('Tags API', () => {
  let token: string;
  let tagId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    token = res.body.token;
  });

  it('should create a new tag', async () => {
    const res = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Urgent',
        color: '#ff0000'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Urgent');
    tagId = res.body.id;
  });

  it('should list all tags', async () => {
    const res = await request(app)
      .get('/api/tags')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete a tag', async () => {
    const res = await request(app)
      .delete(`/api/tags/${tagId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(204);
  });
});
