const {describe, expect, test, it} = require('@jest/globals');
const request = require('supertest');
const app = require('../../app');
const httpCodes = require('http-status-codes');

describe('POST /upload', () => {
  it('should upload an image successfully', (done) => {
    const imagePath = 'public/test-file-1.png';
    request(app)
      .post('/files')
      .attach('file_name', imagePath)
      .expect(httpCodes.StatusCodes.CREATED)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).not.toBeFalsy()      
        done();
      });
  });

  it('should fail to upload a text file', (done) => {
    const filePath = 'public/text-file.txt';
    request(app)
      .post('/files')
      .attach('file_name', filePath)
      .expect(httpCodes.StatusCodes.INTERNAL_SERVER_ERROR)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should fail to upload a large file - 2.4MB', (done) => {
    const filePath = 'public/big-image.jpg';
    request(app)
      .post('/files')
      .attach('file_name', filePath)
      .expect(httpCodes.StatusCodes.BAD_REQUEST)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
