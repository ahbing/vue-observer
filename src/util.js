
export function isObject(val) {
  return val !== null && typeof val === 'object';
};

export function isPlainObject(val) {
  return Object.prototype.toString.call(val).slice(8, -1) === 'Object';  
};