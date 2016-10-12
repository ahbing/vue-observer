import observe from './index';

export function Watcher(obj, expOrFun, cb, options) {
  
  const getter;
  if (typeof expOrFun === 'function') {
    getter = expOrFun.bind(obj);
  } else {
    console.info('暂只支持 function')
  }
  this.getter = getter;
  const value = this.get()
}

Watcher.prototype.get = function() {
  Dep.target = this;
  this.getter();
}

Watcher.prototype.update = function() {
  console.log('watcher update')
}

Watcher.prototype.run = function() {

}
