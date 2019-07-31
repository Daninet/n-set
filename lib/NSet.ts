interface RecursiveNode<T> extends Map<T, Set<T> | RecursiveNode<T>> {}

type Node<T> = Set<T> | RecursiveNode<T>;

export default class NSet<T> {
  private _data: Node<T>;
  private _size: number;

  constructor (arr?: T[] | NSet<T> | Set<T>) {
    this._size = 0;
    if (arr === undefined) {
      this._data = new Set<T>();
      return;
    }

    if (arr instanceof NSet) {
      const newSet = arr.clone();
      this._data = newSet._data;
      this._size = newSet._size;
      return;
    }

    if (arr instanceof Set) {
      this._size = arr.size;
      this._data = new Set<T>(arr);
      return;
    }

    if (Array.isArray(arr)) {
      this._data = new Set<T>();
      arr.forEach(item => {
        this.add(item);
      });
      return;
    }
    throw new Error('Invalid type for NSet constructor');
  }

  get size (): number {
    return this._size;
  }

  clear (): void {
    this._data = new Set<T>();
    this._size = 0;
  }

  private _cloneWalk (node: Node<T>): Node<T> {
    if (node instanceof Set) {
      return new Set(node);
    }
    const map = new Map();
    node.forEach((value, key) => {
      map.set(key, !value ? value : this._cloneWalk(value));
    });
    return map;
  }

  clone (): NSet<T> {
    const newSet = new NSet<T>();
    newSet._size = this._size;
    newSet._data = this._cloneWalk(this._data);
    return newSet;
  }

  private _addWalk (arr: T[]): Node<T> {
    const forLength = arr.length - 1;
    let posParent = null;
    let pos = this._data;
    let item = arr[0];
    for (let i = 0; i < forLength; i++) {
      if (item === undefined) {
        throw new TypeError('Undefined values are unsupported by NSet');
      }
      if (pos instanceof Set) {
        const map: RecursiveNode<T> = new Map();
        pos.forEach(it => map.set(it, null));
        if (map.has(item)) {
          map.set(item, new Set<T>([undefined]));
        } else {
          map.set(item, new Set<T>());
        }
        if (posParent === null) {
          this._data = map;
        } else {
          posParent.set(arr[i - 1], map);
        }
        pos = map;
      } else if (!pos.has(item)) { // already is a Map
        if (i < arr.length - 2) {
          pos.set(item, new Map());
        } else {
          pos.set(item, new Set<T>());
        }
      } else if (pos.get(item) === null) {
        pos.set(item, new Set<T>([undefined]));
      }
      posParent = pos;
      pos = pos.get(item);
      item = arr[i + 1];
    }
    return pos;
  }

  add (value: T[]): NSet<T>;
  add (...values: T[]): NSet<T>;
  add (...values): NSet<T> {
    const arr = Array.isArray(values[0]) ? values[0] as unknown as T[] : values as T[];
    return this._add(arr);
  }

  private _add (arr: T[]): NSet<T> {
    const pos = arr.length > 1 ? this._addWalk(arr) : this._data;
    const item = arr[arr.length - 1];
    if (item === undefined) {
      throw new TypeError('Undefined values are unsupported by NSet');
    }
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

  private _walkToItem (arr: T[]): false | Node<T> {
    const forLength = arr.length - 1;
    let pos = this._data;
    let item = arr[0];
    for (let i = 0; i < forLength; i++) {
      if (item === undefined) {
        throw new TypeError('Undefined values are unsupported by NSet');
      }
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

  has (value: T[]): boolean;
  has (...values: T[]): boolean;
  has (...values): boolean {
    const arr = Array.isArray(values[0]) ? values[0] as unknown as T[] : values as T[];
    return this._has(arr);
  }

  private _has (arr: T[]): boolean {
    let pos = this._data;
    if (arr.length > 1) {
      const res = this._walkToItem(arr);
      if (res === false) {
        return false;
      }
      pos = res;
    }
    const item = arr[arr.length - 1];

    if (item === undefined) {
      throw new TypeError('Undefined values are unsupported by NSet');
    }

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

  delete (value: T[]): boolean;
  delete (...values: T[]): boolean;
  delete (...values): boolean {
    const arr = Array.isArray(values[0]) ? values[0] as unknown as T[] : values as T[];
    return this._delete(arr);
  }

  private _delete (arr: T[]): boolean {
    let pos = this._data;
    if (arr.length > 1) {
      const res = this._walkToItem(arr);
      if (res === false) {
        return false;
      }
      pos = res;
    }
    const item = arr[arr.length - 1];
    if (item === undefined) {
      throw new TypeError('Undefined values are unsupported by NSet');
    }

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

  entries (): Iterator<[T[], T[]]> {
    const values = this.values();
    return {
      next: () => {
        const it = values.next();
        return {
          value: [it.value, it.value],
          done: it.done,
        };
      }
    };
  }

  values (): Iterator<T[]> {
    const iterators = [this._data.entries()];
    const values: T[] = [];
    let iteratorIndex: number = 0;
    let inSet: boolean = this._data instanceof Set;

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
              value: newItem,
              done: false
            };
          } else if (content === null || inSet) {
            const newItem = values.slice(0, iteratorIndex + 1);
            return {
              value: newItem,
              done: false
            };
          } else if ((content as Node<T>).size > 0) {
            iteratorIndex++;
            inSet = content instanceof Set;
            iterators[iteratorIndex] = (content as Node<T>).entries();
          }
        }
        return {
          value: undefined,
          done: true
        };
      }
    };
  }

  forEach (func: (value: T[], index: number, set: NSet<T>) => void): void {
    const entries = this.values();
    let index = 0;
    while (true) {
      const v = entries.next();
      if (v.done) {
        break;
      }
      func(v.value, index++, this);
    }
  }

  toJSON (): T[][] {
    const obj: T[][] = [];
    const entries = this.values();
    while (true) {
      const v = entries.next();
      if (v.done) {
        break;
      }
      obj.push(v.value);
    }
    return obj;
  }

  [Symbol.iterator] (): Iterator<T[]> {
    return this.values();
  }

  inspect (): string {
    const entries = this.values();
    const pairs = [];
    while (true) {
      const v = entries.next();
      if (v.done) {
        break;
      }
      pairs.push(v.value);
    }

    return `NSet { ${pairs.map(p => `(${p.join(', ')})`).join(', ')} }`;
  }
}
