import chai from 'chai';
import sinon from 'sinon';
import { Watcher } from '../src/watcher';
import { observe } from '../src/index';
let expect = chai.expect;


describe('#Watcher object', function() {
  let obObj, cb;
  beforeEach(function() {
    obObj = observe({
      a: 1,
      b: {
        c: 2,
        d: 4
      },
      c: 'c',
      msg: 'hello'
    });
    obObj = obObj.value;
    cb = sinon.spy();
  });
  
  it('watcher value change', function(done) {
    const watcher = new Watcher(obObj, function() {
      return this.a + this.b.c;
    }, cb);
    expect(watcher.value).to.equal(3);
    obObj.b.c = 3;
    setTimeout(function() {
      expect(watcher.value).to.equal(4);
      expect(cb.calledWith(3, 4));
      obObj.b = {
        c: 5
      };
      setTimeout(function() {
        expect(watcher.value).to.equal(6);
        expect(cb.calledWith(4, 6));
        done();
      }, 0);
    }, 0);
  });
  it('watcher value change sync', function() {
    const watcher = new Watcher(obObj, function() {
      return this.a + this.b.c;
    }, cb, { sync: true });
    expect(watcher.value).to.equal(3);
    obObj.b.c = 3;
    expect(watcher.value).to.equal(4);
    expect(cb.calledWith(3, 4));
  });
  it('watcher non-existent value', function(done) {
    const watcher = new Watcher(obObj, function() {
      return this.e;
    }, cb);
    expect(watcher.value).to.be.undefined;
    done();
  });
  it('warn not support path', function() {
    const watcher = new Watcher(obObj, 'a + b.c', cb);
    expect(watcher).to.be.an('error');
  })
});

describe('#Watcher array', function() {

});