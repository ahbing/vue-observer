import { isObject, isPlainObject } from '../src/util';
import chai from 'chai';

let expect = chai.expect;

describe('#isObject', function() {
  it('{}, new Array() should return true', function() {
    expect(isObject({})).to.eql(true);
    expect(isObject(new Array())).to.eql(true);
  });
  it('null should return false', function() {
    expect(isObject(null)).to.eql(false);
  });
})


describe('#isPlainObject', function() {
  it('{} should return true', function() {
    expect(isPlainObject({})).to.eql(true);
  });
  it('null, new Array() should return false', function() {
    expect(isPlainObject(null)).to.eql(false);
    expect(isPlainObject(new Array())).to.eql(false);
  });
})
