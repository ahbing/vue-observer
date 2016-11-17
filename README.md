# Vue-observer


## example

```JavaScript

import { Watcher, observe } from 'vueObservable';

const obj = {
  a: 1,
  b: {
    c: 2
  }
}
const obValue = observe(obj).value;

const callback = function(oldValue, newValue) {

  document.write('value changed, the old value is ', oldValue, ', and this new value is ', newValue);
}

const watcher = new Watcher(obValue, function() {
  return this.a + this.b.c;
}, callback);

// do some change, then will call callback function auto; 
obValue.a = 2;

```
## run example

```sh

npm run build 

```

then open example.html in your browser。

## todo

- add Set function
- add Delete function 
