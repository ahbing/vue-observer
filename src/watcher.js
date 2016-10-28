import { observe } from './index';
import { isObject } from './util';
import Dep from './dep';
import queueWatcher from './queue';

let uid = 0;
export function Watcher(obj, expOrFun, cb, options={}) { 
  let getter;
  if (typeof expOrFun === 'function') {
    let that = obj && obj.value ? obj.value : obj;
    getter = expOrFun.bind(that);
  } else {
    // console.info('暂只支持 function')
    return new Error(expOrFun + 'is not a function');
  }
  // 如果数据没有被 observe
  this.ob = obj.__ob__ ? obj.__ob__ : observe(obj);
  this.active = true;
  this.sync = !!options.sync;
  this.id = ++uid;
  this.val = obj;
  this.getter = getter;
  this.deps = [];
  this.depIds = {};
  this.cb = cb;
  this.initDep(this.val);
  this.value = this.get();
}

Watcher.prototype.initDep = function(self) {
  this.addDepend(this.ob.dep); // init self dep
  if (Array.isArray(self)) {
    let i = self.length;
    while (i--) {
      let child = self[i];
      let childDep = child.__ob__ && child.__ob__.dep;
      if (childDep && Array.isArray(child)) {
        this.addDepend(childDep);
        return this.initDep(child);
      }
    }
  }
};

Watcher.prototype.get = function() {
  Dep.target = this;
  const value = this.getter();
  Dep.target = null;
  return value;
}

Watcher.prototype.addDepend = function(dep) {
  if (!this.depIds[dep.id]) {
    dep.add(this);
  }
}

Watcher.prototype.depend = function() {
  for (let i = 0, len = this.deps.length; i < len; i++) {
    this.addDepend(this.deps[i]);
  }
}

Watcher.prototype.remove = function() {
  if (this.active) {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].remove(this);
    }
    this.active = false;
  }
}

Watcher.prototype.update = function() {
  if (this.sync) { // 同步更新
    return this.run();
  }
  // console.log('添加到队列');
  queueWatcher(this); 
}

Watcher.prototype.run = function() {
  if (this.active) {
    const value = this.get();
    if (value !== this.value || isObject(value)) {
      const oldValue = this.value;
      this.value = value
      try {
        this.cb.call(this.val, oldValue, value);
      } catch(e) {
        console.error(e);
      }
    } 
  }
}
