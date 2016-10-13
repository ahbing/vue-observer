import {observe} from './index';
import {Dep} from './dep';
export function Watcher(obj, expOrFun, cb, options) { 
  let getter;
  if (typeof expOrFun === 'function') {
    getter = expOrFun.bind(obj);
  } else {
    console.info('暂只支持 function')
  }
  this.getter = getter;
  this.cb = cb;
  const value = this.get()
}

Watcher.prototype.get = function() {
  Dep.target = this;
  this.getter();
}

Watcher.prototype.update = function() {
  console.log('watcher update')
  this.run();
}

Watcher.prototype.run = function() {
  if (this.cb) this.cb();
}
