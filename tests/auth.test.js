const request = require('supertest');
const app = require('../src/app');

describe('Auth Endpoints', () => {
  describe('GET /api/auth/login', () => {
    it('should redirect to Auth0', async () => {
      const response = await request(app).get('/api/auth/login');

      expect([302, 301]).toContain(response.status);
      expect(response.headers.location).toContain('authorize');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return logout URL', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('logoutUrl');
    });
  });
});

describe('Protected Endpoints', () => {
  it('should return 401 for unauthorized access to /api/me', async () => {
    const response = await request(app).get('/api/me');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
