import { observe } from './src/index';
import { Watcher } from './src/watcher';
const vueObservable = {
  observe,
  Watcher
}

module.exports = vueObservable['default'] = vueObservable['vueObservable'] = vueObservable;
