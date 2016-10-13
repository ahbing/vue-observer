const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
[
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'splice',
  'reverse'
].forEach(method => {
  const originMethod = arrayProto[method];
  Object.defineProperty(arrayMethods, method, {
    enumberable: false,
    writable: true,
    configurable: true,
    value: function() {
      let args = new Array(arguments.length);
      for (let i = 0, l = arguments.length; i < l; i++) {
        args[i] = arguments[i]
      }
      const result = originMethod.apply(this, args);
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case 'push':
          inserted = args;
          break;
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
        default:
          break;
      }
      if (inserted) ob.observerArray(inserted);
      ob.dep.notify();
      return result;
    }
  });
});

export default arrayMethods; 
