import { observe } from './index';
import Dep from './dep';
let uid = 0;
export function Watcher(obj, expOrFun, cb, options) { 
  let getter;
  if (typeof expOrFun === 'function') {
    getter = expOrFun.bind(obj);
  } else {
    console.info('暂只支持 function')
  }
  if (!obj.__ob__) this.ob = observe(obj);
  this.uid = ++uid;
  this.val = obj;
  this.ob = obj.__ob__;
  this.getter = getter;
  this.cb = cb;
  const value = this.get()
}

Watcher.prototype.get = function() {
  Dep.target = this;
  this.getter();
  this.addDepend();
}

Watcher.prototype.addDepend = function() {
  // @todo 添加是否存在的验证
  this.ob.dep.add(this);
}

Watcher.prototype.update = function() {
  this.run();
}

Watcher.prototype.run = function() {
  if (this.cb) this.cb();
}
