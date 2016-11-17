# Vue-observer
[![Build Status](https://travis-ci.org/ahbing/vue-observer.svg?branch=master)](https://travis-ci.org/ahbing/vue-observer)
[![NPM version](https://img.shields.io/npm/v/vue-observer.svg?style=flat)](https://www.npmjs.com/package/vue-observer)
[![Coverage Status](https://coveralls.io/repos/github/ahbing/vue-observer/badge.svg?branch=master)](https://coveralls.io/github/ahbing/vue-observer?branch=master)
![David DM](https://david-dm.org/ahbing/vue-observer.svg)

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
