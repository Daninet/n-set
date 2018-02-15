'use strict';

class NSet {
  constructor () {
    this._data = new Set();
    this._size = 0;
  }

  get size () {
    return this._size;
  }

  clear () {
    this._data = new Set();
    this._size = 0;
  }

  _addWalk(arr) {
    let posParent = null;
    let pos = this._data;
    let forLength = arr.length - 1;
    let item = arr[0];
    for (let i = 0; i < forLength; i++) {
      if (pos instanceof Set) {
        const map = new Map();
        pos.forEach(it => map.set(it, null));
        if (map.has(item)) {
          map.set(item, new Set([undefined]));
        } else {
          map.set(item, new Set());
        }
        if (posParent === null) {
          this._data = map;
        } else {
          posParent.set(arr[i-1], map);
        }
        pos = map;
      } else if (!pos.has(item)) { // already is a Map
        if (i < arr.length - 2) {
          pos.set(item, new Map());
        } else {
          pos.set(item, new Set());
        }
      } else if (pos.get(item) === null) {
        pos.set(item, new Set([undefined]));
      }
      posParent = pos;
      pos = pos.get(item);
      item = arr[i + 1];
    }
    return pos;
  }

  add (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;
    if (arr.some(val => val === undefined)) {
      throw new Error('Adding undefined is unsupported by NSet');
    }
    const pos = arr.length > 1 ? this._addWalk(arr) : this._data;
    const item = arr[arr.length - 1];
    // processing last index
    if (pos instanceof Set) {
      const s1 = pos.size;
      pos.add(item);
      this._size += pos.size - s1;
    } else {
      const it = pos.get(item);
      if (it === undefined) {
        pos.set(item, null);
        this._size++;
      } else if (it === null) {
      } else if (it instanceof Map) {
        const s1 = it.size;
        it.set(undefined, null);
        this._size += it.size - s1;
      } else { // it is Set
        const s1 = it.size;
        it.add(undefined);
        this._size += it.size - s1;
      }
    }
    return this;
  }

  _walkToItem(arr) {
    let pos = this._data;
    const forLength = arr.length - 1;
    let item = arr[0];
    for (let i = 0; i < forLength; i++) {
      if (!(pos instanceof Map)) {
        return false;
      }
      pos = pos.get(item);
      if (pos === undefined) {
        return false;
      }
      item = arr[i + 1];
    }
    return pos;
  }

  has (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;

    let pos = this._data;
    if (arr.length > 1) {
      pos = this._walkToItem(arr);
      if (pos === false) {
        return false;
      }
    }
    const item = arr[arr.length - 1];

    if (pos === null) {
      return false;
    }
    if (pos instanceof Set) {
      return pos.has(item);
    } else { // Map
      const it = pos.get(item);
      if (it === undefined) {
        return false;
      }
      if (it === null) {
        return true;
      }
      if (it.has(undefined)) {
        return true;
      }
    }
    return false; // pos.has(undefined);
  }

  delete (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;
    let pos = this._data;
    if (arr.length > 1) {
      pos = this._walkToItem(arr);
      if (pos === false) {
        return false;
      }
    }
    const item = arr[arr.length - 1];

    if (pos instanceof Set) {
      const res = pos.delete(item);
      if (res) this._size--;
      return res;
    } else if (pos instanceof Map) {
      const it = pos.get(item);
      if (it === undefined) {
        return false;
      }
      if (it === null) {
        pos.delete(item);
        this._size--;
        return true;
      }
      // Has Map or Set
      const res = it.delete(undefined);
      if (res) this._size--;
      return res;
    }
    return false;
  }

  entries () {
    const iterators = [this._data.entries()];
    const values = [];
    let iteratorIndex = 0;
    let inSet = this._data instanceof Set;

    return {
      next: () => {
        while (true) {
          const it = iterators[iteratorIndex];
          const v = it.next();

          if (iteratorIndex === 0 && v.done) {
            break;
          } else if (v.done) {
            inSet = false;
            values[iteratorIndex] = undefined;
            iteratorIndex--;
            continue;
          }
          values[iteratorIndex] = v.value[0];
          const content = v.value[1];
          if (v.value[0] === undefined) { // terminator
            const newItem = values.slice(0, iteratorIndex);
            return {
              value: [newItem, newItem],
              done: false,
            };
          } else if (content === null || inSet) {
            const newItem = values.slice(0, iteratorIndex + 1);
            return {
              value: [newItem, newItem],
              done: false,
            };
          } else if (content.size > 0) {
            iteratorIndex++;
            inSet = content instanceof Set;
            iterators[iteratorIndex] = content.entries();
          }
        }
        return {
          value: undefined,
          done: true,
        };
      }
    };
  }

  values () {
    const entries = this.entries();
    return {
      next: () => {
        const it = entries.next();
        return {
          value: it.value && it.value[1],
          done: it.done
        };
      }
    }
  }

  forEach (func) {
    const entries = this.values();
    while (1) {
      const v = entries.next();
      if (v.done) {
        break;
      }
      func(v.value, v.value, this);
    }
  }

  [Symbol.iterator] () {
    return this.values();
  }
  
  inspect () {
    const entries = this.values();
    const pairs = [];
    while (1) {
      const v = entries.next();
      if (v.done) {
        break;
      }
      pairs.push(v.value);
    }

    return `NSet { ${pairs.map(p => `(${p.join(', ')})`).join(', ')} }`;
  }
}
module.exports = NSet;