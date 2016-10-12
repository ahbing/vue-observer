const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
[
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'splice',
  'reverse'
].forEach(function(method) {
  const originMethod = arrayProto[method];
  Object.defineProperty(arrayMethods, method, {
    enumberable: false,
    writable: true,
    configurable: true,
    value: function() {
      var args = new Array(arguments.length);
      for (var i = 0, l = arguments.length; i < l; i++) {
        args[i] = arguments[i]
      }
      const result = originMethod.apply(this, args);
      let ob = this.__ob__;
      let inserted;
      switch(method) {
        case 'push':
          inserted = args
          break;
        case 'unshift':
          inserted = args
          break;
        case 'splice':
          inserted = arguments.slice(2)
          break;
      }
      if (inserted) ob.observerArray(inserted);
      ob.dep.notify();
      return result;
    }
  })
});
