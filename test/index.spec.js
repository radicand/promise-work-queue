const expect = require('chai').expect;

const PromiseWorkQueue = require('../dist/index').default;

describe('PromiseWorkQueue(multi)', () => {
  describe('onDrain', () => {
    let queue = new PromiseWorkQueue(2);
    it('should notify when queue is empty', (done) => {
      queue.onDrain(() => {
        done();
      });

      queue.addPayload(1);
    });
  });

  describe('addStep', () => {
    let queue = new PromiseWorkQueue(2);
    it('should allow one step', (done) => {
      const payload = { var: 1 };
      queue.addStep((payload) => {
        payload.var = payload.var + 1;
        return payload;
      }); // incrememnt the payload
      queue.onDrain(() => {
        try {
          expect(payload.var).to.equal(2);
          done();
        } catch (err) {
          done(err);
        }
      });
      queue.addPayload(payload);
    });
  });

  describe('onError', () => {
    let queue = new PromiseWorkQueue(2);
    it('should catch an error', (done) => {
      const payload = { var: 1 };
      queue.addStep((payload) => {
        throw new Error('catch me if you can');
      }); // incrememnt the payload
      queue.onError((err, payload) => {
        done();
      });
      queue.onDrain(() => {
        done(new Error('onError not called'));
      });

      queue.addPayload(1);
    });
  });
});
