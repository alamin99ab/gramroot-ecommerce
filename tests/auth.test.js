const request = require('supertest');
const app = require('../server'); // server.js থেকে app export করে থাকলে

describe('Auth APIs', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test' + Date.now() + '@mail.com',
        password: '123456'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/OTP sent/);
  });
});
