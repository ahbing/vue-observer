/**
 * observer 一个 对象/数组 先对其类型做判断
 * observer 数组（遍历每个数组值，如果是复杂值继续 observer）
 * observer 对象， 对每个属性调用 definedReactive 方法
 */
import {isObject, isPlainObject} from './util';
import { Dep } from './dep';
import { arrayMethods } from './array';

export function Observer(obj, options) {
  const dep = new Dep();
  this.dep = dep;
  this.value = obj;
  Object.defineProperty(obj, '__ob__', {
    value: this
  });
  if (Array.isArray(obj)) {
    obj.__proto__ = arrayMethods;
    this.observerArray(obj);
  } else {
    this.walk(obj);
  }
}

Observer.prototype.walk = function(obj) {
  let keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
}

Observer.prototype.observerArray = function(arr) {
  for(var i = 0, l = arr.length; i < l; i++) {
    observe(arr[i]);
  }
}
export function observe(val) {
  if (!isObject(val)) return;
  if (val.hasOwnProperty('__ob__') && val.__ob__ instanceof Observer) return val.__ob__;
  let ob;
  if (Array.isArray(val) || isPlainObject(val) && Object.isExtensible(val)) {
    ob = new Observer(val);
  }
  return ob;
}

const reactiveDescriptor = {
  configurable: true,
  enumberable: true,
  writable: true,
}

export function defineReactive(obj, key, val) {
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  if (desc && desc.configurable === false) return;
  const dep = new Dep();
  const getter = desc && desc.get;
  const setter = desc && desc.set;
  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      const value = getter ? getter.call(obj) : val; 
      if (Dep.target) {
        dep.add(Dep.target);
        if (childOb) childOb.dep.add();
      }
      if (Array.isArray(value)) {
        for (let i = 0, l = value.length; i < l; i++) {
          let e = value[i];
          e && e.__ob__ && e.__ob__.dep.depend();
        }
      }
      return value;
    },
    set: function(newVal) {
      const value = getter ? getter.call(obj) : val;
      if (value === newVal) return;
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal);
      dep.notify();
    }
  })
}