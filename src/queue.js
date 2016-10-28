const queue = [];
let flushing = false;
let waiting = false;
let has = {};
let index = 0;
const nextTick = (function() {
  let timerFunc;
  let callbacks = [];
  let pending = false;
  // 还有一种就是使用 promise;
  timerFunc = setTimeout;
  function nextTickHandler() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0, len = copies.length; i < len; i++) {
      copies[i]();
    }
  }
  return function queueNextTick(cb, ctx) {
    const func = ctx 
      ? function() { cb.call(ctx) }
      : cb;
    callbacks.push(func)
    if (!pending) {
      pending = true;
      timerFunc(nextTickHandler, 0);
    }
  }
})();
export default function queueWatcher(watcher) {
  let id = watcher.id;
  if (!has[id]) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher)
    } else {
      let i = queue.length - 1;
      while (i >= 0 && queue[i].id > id) {
        i--
      }
      queue.splice(Math.max(i, id) + 1, 0, wather);
    }
    if (!waiting) {
      waiting = true;
      nextTick(flushQueue);
    }
  }
};

function flushQueue() {
  flushing = true;
  queue.sort(function(a, b) { return a.id - b.id });
  for (index = 0; index < queue.length; index++) {
    const watcher = queue[index];
    const id = watcher.id;
    has[id] = null;
    watcher.run();
  }
  resetQueueState();
}

function resetQueueState() {
  waiting = flushing = false;
  has = {};
  queue.length = 0;
}