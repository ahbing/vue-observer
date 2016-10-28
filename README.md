# Vue-observer


## example

```JavaScript

const obj = {
  a: 1,
  b: {
    c: 2
  }
}
const obValue = observe(obj).value;

const callback = function(oldValue, newValue) {
  console.log('value changed, the oldValue is', oldValue, 'and this new value is', newValue);
}

const watcher = new Watcher(obValue, function() {
  return this.a + this.b.c;
}, callback);

// do some change, then will call callback function auto; 

obValue.a = 2;

```

## todo

- add Set function
- add Delete function 