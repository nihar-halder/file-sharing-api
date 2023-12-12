const {describe, it} = require('@jest/globals');
const request = require('supertest');
const app = require('../../app');
const httpCodes = require('http-status-codes');

describe('Rate Limit', () => {
  it('should receive a 429 HTTP status code after exceeding the rate limit', (done) => {
    const rateLimit = parseInt(process.env.RATE_LIMIT_IN_HOUR) || 100
    const totalRequests = rateLimit + 1    
      for(let i=1; i<= totalRequests; i++) {
        request(app)
          .get('/')
          .expect(i>rateLimit ? httpCodes.StatusCodes.TOO_MANY_REQUESTS : httpCodes.StatusCodes.OK)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      }
  });
});
