import chai from 'chai';
import { observe, Observer } from '../src/index';
import Dep from '../src/dep';
import sinon from 'sinon';

const expect = chai.expect;

describe('#Observer', function() {
  it('create on non-observables', function() {
    const ob1 = observe(1);
    expect(ob1).to.be.undefined;
    const ob2 = observe(Object.freeze({}));
    expect(ob2).to.be.undefined;
  });
  it('create on object', function() {
    const obj = {
      a: {},
      b: {}
    };
    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).to.be.true;
    expect(ob1.value).to.be.obj;
    // children
    expect(obj.a.__ob__ instanceof Observer).to.be.true;
    expect(obj.b.__ob__ instanceof Observer).to.be.true;
    // cache
    const ob2 = observe(obj);
    expect(ob1).to.be.ob2;
  });
  it('create on null', function() {
    const obj = Object.create(null);
    obj.a = {};
    obj.b = {};
    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).to.be.true;
    expect(ob1.value).to.be.obj;
    // children
    expect(obj.a.__ob__ instanceof Observer).to.be.true;
    expect(obj.b.__ob__ instanceof Observer).to.be.true;
    // cache
    const ob2 = observe(obj);
    expect(ob1).to.be.ob2;
  });
  it('create on already observed object', function() {
    const obj = {};
    let getCount = 0;
    let val = 0;
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get() {
        getCount++;
        return val;
      },
      set(v) {
        val = v;
      }
    });
    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).to.be.true;
    expect(ob1.value).to.be.obj;
    expect(obj.__ob__).to.be.ob1;

    getCount = 0; // 清零是因为在 observe/defineReactive 过程中 调用 get 方法了；
    obj.a
    expect(getCount).to.equal(1);
    obj.a
    expect(getCount).to.equal(2);
    obj.a = 0;
    expect(val).to.equal(0);
    obj.a = 20;
    expect(val).to.equal(20);

    const ob2 = observe(obj);
    expect(ob2).to.be.ob1;
  });
  it('create on property with only getter', function() {
    const obj = {};
    let val = 0;
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get() {
        return val;
      }
    });
    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).to.be.true;
    expect(obj.__ob__).to.be.ob1;
    expect(ob1.value).to.be.obj;
    // get
    expect(obj.a).to.equal(0);
    // can't set
    try {
      obj.a = 2333;
    } catch(e) {
      expect(obj.a).to.equal(0);
    }

    const ob2 = observe(obj)
    expect(ob2).to.be.ob1;
  });
  it('create on property with only setter', function() {
    const obj = {};
    let val = 0;
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      set(v) { val = v }
    });

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).to.be.true;
    expect(ob1.value).to.be.obj;
    expect(obj.__ob__).to.be.ob1;

    obj.a = 233;
    expect(val).to.equal(233);
    // reads should return undefined
    expect(obj.a).to.be.undefined;

    const ob2 = observe(obj);
    expect(ob1).to.be.ob2;
  });
  it('create on property which is marked not configurable', function() {
    const obj = {};
    Object.defineProperty(obj, 'a', {
      configurable: false,
      enumerable: true,
      value: 2333
    });
    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).to.be.true;
    expect(ob1.value).to.be.obj;
    expect(obj.__ob__).to.be.ob1;
  });



  it('create on array', function() {
    const arr = [{}, {}];
    const ob1 = observe(arr);
    expect(ob1 instanceof Observer).to.be.true;
    expect(ob1.value).to.be.arr;
    expect(arr.__ob__).to.be.ob1;
    
    expect(arr[0].__ob__ instanceof Observer).to.be.true;
    expect(arr[1].__ob__ instanceof Observer).to.be.true;
  });

  it('observing object prop change', function() {
    const obj = { a: { b: 2 } };
    let updateSpy = sinon.spy();
    observe(obj);
    // mock watcher
    const watcher = {
      deps: [],
      addDepend(dep) {
        this.deps.push(dep);
        dep.add(this);
      },
      update: updateSpy,
    };
    Dep.target = watcher;
    // obj.a; watcher.deps.length === 2   // obj.a + (childOb = observe({b: 2}))
    obj.a.b
    expect(watcher.deps.length).to.equal(3); // obj.a 2 + a.b 1
    Dep.target = null;
    obj.a.b = 3;
    expect(updateSpy.calledOnce).to.be.true;
    obj.a = { b: 4 };
    expect(updateSpy.calledTwice).to.be.true;
    watcher.deps = [];
    Dep.target = watcher;
    obj.a.b;
    Dep.target = null;
    expect(watcher.deps.length).to.equal(3); // obj.a + a.b + b
    obj.a.b = 5;
    expect(updateSpy.calledThrice).to.be.true;
  });
  it('observing object prop change on defined property', function() {
    const obj = { val: 2 };
    let updateSpy = sinon.spy();
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get() { return this.val },
      set(v) {
         this.val = v;
         return this.val;
      }
    });
    observe(obj);
    // mock watcher
    const watcher = {
      deps: [],
      addDepend(dep) {
        this.deps.push(dep);
        dep.add(this);
      },
      update: updateSpy
    };
    Dep.target = watcher;
    expect(obj.a).to.equal(2);
    Dep.target = null;
    obj.a = 3;
    expect(obj.val).to.equal(3);
    obj.val = 5;
    expect(obj.a).to.equal(5);
  });

  it('create on object with a deep array', function() {
    const obj = { a: [{ b: 'b' }] };
    const ob1 = observe(obj);

    let updateSpy = sinon.spy();
    // mock watcher
    const watcher = {
      deps: [],
      addDepend(dep) {
        this.deps.push(dep);
        dep.add(this);
      },
      update: updateSpy
    };
    Dep.target = watcher;
    obj.a[0].b;
    expect(watcher.deps.length).to.equal(4);
    Dep.target = null;
    obj.a[0].b = 'bb';
    expect(updateSpy.calledOnce).to.be.true;
    obj.a[0].b = 'bbb';
    expect(updateSpy.calledTwice).to.be.true;
  });

  it('observing array mutation', function() {
    const arr = [];
    const ob = observe(arr);
    const dep = ob.dep;
    sinon.spy(dep, "notify");
    const objs = [{}, {}, {}];
    arr.push(objs[0]);
    arr.pop();
    arr.unshift(objs[1]);
    arr.shift();
    arr.splice(0, 0, objs[2]);
    arr.sort();
    arr.reverse();
    expect(dep.notify.callCount).to.equal(7);
  });
});
