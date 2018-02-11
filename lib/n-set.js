'use strict';

class NSet {
  constructor() {
    this._data = new Map();
    this._size = 0;
  }
  get size() {
    return this._size;
  }
  clear () {
    this._data = new Map();
    this._size = 0;
  }
  add (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;
    let pos = this._data;
    let i;
    for (i = 0; i < arr.length; i++) {
      const item = arr[i];
      let v = pos.get(item);
      if (i < arr.length - 1) {
        if (v === undefined) {
          v = new Map();
          pos.set(item, v);
        } else if (v === null) {
          v = new Map();
          pos.set(item, v);
          v.set(undefined, true);
        }
      } else if (v === undefined && !pos.has(item)) {
        pos.set(item, null);
        this._size++;
      } else if (v !== null && !v.has(undefined)) {
        v.set(undefined, true); // termination is indicated by undefined
        this._size++;
      }
      pos = v;
    };
    return this;
  }
  has (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;
    let pos = this._data;
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const v = pos.get(item);
      if (v === undefined) {
        return false;
      } else if (v === null) {
        return i === arr.length - 1;
      }
      pos = v;
    }
    return pos.has(undefined);
  }
  delete (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;
    let pos = this._data;
    let i;
    for (i = 0; i < arr.length - 1; i++) {
      const item = arr[i];
      const v = pos.get(item);
      if (v === undefined || v === null) {
        return false;
      }
      pos = v;
    };
    if (!pos.has(arr[i])) {
      return false;
    }
    const parent = pos;
    pos = pos.get(arr[i]);

    if (pos === null) {
      parent.delete(arr[i]);
      this._size--;
      return true;
    }

    if (pos.has(undefined)) {
      pos.delete(undefined);
      this._size--;
      return true;
    }

    return false;
  }
  entries () {
    const iterators = [this._data.entries()];
    const values = [];
    let iteratorIndex = 0;

    return {
      next: () => {
        while (true) {
          const it = iterators[iteratorIndex];
          const v = it.next();
          if (iteratorIndex === 0 && v.done) {
            break;
          } else if (v.done) {
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
          } else if (content === null) {
            const newItem = values.slice(0, iteratorIndex + 1);
            return {
              value: [newItem, newItem],
              done: false,
            };
          } else if (content.size > 0) {
            iteratorIndex++;
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