
export isObject = function(val) {
  return val !== null && typeof val === 'object';
};

export isPlainObject = function(val) {
  return Object.prototype.toString.call(val).slice(8, -1) === 'Object';  
};