let uid = 0;

export default function Dep() {
  this.id = ++uid;
  this.subs = [];
}

Dep.prototype.add = function(sub) {
  this.subs.push(sub);
}

Dep.prototype.remove = function(sub) {
  let index = this.subs.indexOf(sub);
  return this.subs.splice(index, 1);
}

Dep.prototype.depend = function() {
  if (Dep.target) {
    Dep.target.addDepend(this);
  }
}

Dep.prototype.notify = function() {
  for(let i = 0, l = this.subs.length; i < l; i++) {
    this.subs[i].update();
  }
}

Dep.target = null;
