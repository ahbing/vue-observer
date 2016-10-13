let uid = 0;

export default function Dep() {
  this.is = ++uid;
  this.subs = [];
}

Dep.prototype.add = function() {
  this.subs.push(Dep.target);
}

Dep.prototype.remove = function(sub) {
  let index = this.subs.indexOf(sub);
  return this.subs.splice(index, 1);
}

Dep.prototype.depend = function(dep) {
  Dep.target.addDepend(dep); 
}

Dep.prototype.notify = function() {
  for(let i = 0, l = this.subs.length; i < l; i++) {
    this.subs[i].update();
  }
}

Dep.target = null;
