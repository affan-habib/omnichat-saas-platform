import request from 'supertest';
import app from '../src/app';

describe('Contacts API', () => {
  let token: string;
  let contactId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@acme.com', password: 'password123' });
    token = res.body.token;
  });

  it('should create a new contact', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Contact',
        email: 'test@example.com',
        phone: '+1234567890',
        customData: { location: 'New York' }
      });
    
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Contact');
    expect(res.body.email).toBe('test@example.com');
    contactId = res.body.id;
  });

  it('should list all contacts', async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a contact', async () => {
    const res = await request(app)
      .put(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Contact'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Contact');
  });

  it('should delete a contact', async () => {
    const res = await request(app)
      .delete(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(204);
  });
});
