// tslint:disable: only-arrow-functions
import { expect } from 'chai';
import app from '../src';

describe('API Server', function () {
  describe('Health Check', function () {
    it('should export express app', function () {
      expect(app).to.exist;
      expect(typeof app).to.equal('function');
    });
  });
});
