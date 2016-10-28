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
  this.newDeps = [];
  this.depIds = {};
  this.newDepIds = {};
  this.cb = cb;
  this.addDepend(this.ob.dep); // init dep
  this.value = this.get()
}

Watcher.prototype.get = function() {
  Dep.target = this;
  const value = this.getter();
  Dep.target = null;
  this.updateDepend()
  return value;
}

Watcher.prototype.addDepend = function(dep) {
  if (!this.newDepIds[dep.id]) {
    this.newDepIds[dep.id] = true;
    this.newDeps.push(dep);
    if (!this.depIds[dep.id]) {
      dep.add(this);
    }
  }
}

Watcher.prototype.updateDepend = function() {
  let i = this.deps.length;
  while (i--) {
    let dep = this.deps[i];
    if (!this.newDepIds[dep.id]) {
      dep.remove(this);
    }
  }
  let tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
  tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds = {};
}

Watcher.prototype.depend = function() {
  for (let i = 0, len = this.deps.length; i < len; i++) {
    this.deps[i].depend();
  }
}

Watcher.prototype.remove = function() {
  let i = this.deps.length;
  while (i--) {
    this.deps[i].remove(this);
  }
  this.newDeps.length = 0;
  this.deps.length = 0;
  this.newDepIds = {};
  this.depIds = {};
  this.active = false;
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
