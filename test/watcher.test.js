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
  });
  it('remove watcher', function() {
    const watcher = new Watcher(obObj, function() {
      return this.a + this.b.c;
    }, cb);
    expect(watcher.value).to.equal(3);
    watcher.remove();
    expect(watcher.active).to.be.false;
    obObj.a = 2;
    expect(watcher.value).to.equal(3);
  });
});

describe('#Watcher array', function() {
  let obArr, cb;
  beforeEach(function() {
    obArr = observe([1, { a: 2, c: 3}, 3, [4, 5, 6]]);
    obArr = obArr.value;
    cb = sinon.spy();
  });
  it('watcher value change', function(done) {
    const watcher = new Watcher(obArr, function() {
      // 1 + 2 + 4
      return this[0] + this[1]['a'] + this[3][0];
    }, cb);
    expect(watcher.value).to.equal(7);
    obArr.push(2333);  
    setTimeout(function() {
      expect(watcher.value).to.equal(7);
      expect(cb.calledWith(7, 7));
      done();
    }, 0);
  });
  it('watcher value change in child object', function(done) {
    const watcher = new Watcher(obArr, function() {
      // 1 + 2 + 4
      return this[0] + this[1]['a'] + this[3][0];
    }, cb);
    expect(watcher.value).to.equal(7);
    obArr[1]['a'] = 3;  
    setTimeout(function() {
      expect(watcher.value).to.equal(8);
      expect(cb.calledWith(7, 8));
      done();
    }, 0)
  });
  it('watcher value change in child array', function(done) {
    const watcher = new Watcher(obArr, function() {
      // 1 + 2 + 4
      return this[0] + this[1]['a'] + this[3][0];
    }, cb);
    expect(watcher.value).to.equal(7);
    // obArr[3][0] = 5;
    obArr.splice(3, 1, [5]);
    setTimeout(function() {
      expect(watcher.value).to.equal(8);
      expect(cb.calledWith(7, 8));
      done();
    }, 0);
  });

  it('watcher value change in deep child array', function(done) {
    const watcher = new Watcher(obArr, function() {
      // 1 + 2 + 4
      return this[0] + this[1]['a'] + this[3][0];
    }, cb);
    expect(watcher.value).to.equal(7);
    const obArrChild = obArr[3];
    obArrChild.splice(0, 1, 5);
    setTimeout(function() {      
      expect(watcher.value).to.equal(8);
      expect(cb.calledWith(7, 8));
      obArrChild.splice(0, 1, 6);
      setTimeout(function() {
        expect(watcher.value).to.equal(9);
        expect(cb.calledWith(8, 9));
        done();
      }, 0)
    }, 0)
  });
});

describe('#Watcher non-observed object/array', function() {
  let plainObject = {
    a: 1,
    b: {
      c: 2,
      d: 4
    },
    c: 'c',
    msg: 'hello'
  };
  
  let cb = sinon.spy();
  it('object', function(done) {
    const watcher = new Watcher(plainObject, function() {
      return this.a + this.b.c;
    }, cb);
    expect(watcher.value).to.equal(3);
    plainObject.b.c = 3;
    setTimeout(function() {
      expect(watcher.value).to.equal(4);
      expect(cb.calledWith(3, 4));
      plainObject.b = {
        c: 5
      };
      setTimeout(function() {
        expect(watcher.value).to.equal(6);
        expect(cb.calledWith(4, 6));
        done();
      }, 0);
    }, 0);
  });

  let plainArray = [1, { a: 2, c: 3}, 3, [4, 5, 6]];
  it('array', function(done) {
    const watcher = new Watcher(plainArray, function() {
      // 1 + 2 + 4
      return this[0] + this[1]['a'] + this[3][0];
    }, cb);
    expect(watcher.value).to.equal(7);
    plainArray.push(2333);  
    setTimeout(function() {
      expect(watcher.value).to.equal(7);
      expect(cb.calledWith(7, 7));
      done();
    }, 0);
  })
});
