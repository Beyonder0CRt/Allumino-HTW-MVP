const request = require('supertest');
const app = require('../src/app');

describe('Health Endpoint', () => {
  it('GET /api/health should return service status', async () => {
    const response = await request(app).get('/api/health');

    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('databases');
  });
});

describe('Root Endpoint', () => {
  it('GET / should return API info', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Allumino Backend API');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('status', 'running');
  });
});

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/api/nonexistent');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});
