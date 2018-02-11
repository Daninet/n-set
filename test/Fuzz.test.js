'use strict';

const NSet = require('../');
const NMAX = 50;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compareArrayAndSet(arr, nset) {
  arr.forEach(it => {
    expect(nset.has(it)).toEqual(true);
    expect(nset.has([...it, 100])).toBe(false);
    expect(nset.has([...it.slice(0, -1), 51])).toBe(false);
  });
  const strElements = arr.map(f => JSON.stringify(f));
  nset.forEach(it => {
    const strArr = JSON.stringify(it);
    const res = strElements.find(f => f === strArr);
    expect(res).not.toBeUndefined();
  });
}

test('set-simple', () => {
  for (let n = 0; n < NMAX; n++) {
    const set = new Set();
    const nset = new NSet();
    for (let i = 0; i < 1000; i++) {
      const rnd = randInt(0, 100);
      expect(nset.has(rnd)).toBe(set.has(rnd));
      set.add(rnd);
      nset.add(rnd);
      expect(nset.has(rnd)).toBe(true);
    }
    expect(nset.size).toBe(set.size);
    for (let i = 0; i < 100; i++) {
      const rnd = randInt(0, 100);
      expect(nset.has(rnd)).toBe(set.has(rnd));
      expect(nset.delete(rnd)).toBe(set.delete(rnd));
      expect(nset.has(rnd)).toBe(false);
    }
    expect(nset.size).toBe(set.size);
    for (let i = 0; i <= 100; i++) {
      expect(nset.has(i)).toBe(set.has(i));
    }
  }
});

test('set-deep', () => {
  for (let n = 0; n < NMAX; n++) {
    let items = [];
    const nset = new NSet();
    for (let i = 0; i < 1000; i++) {
      const arr = [];
      const c = randInt(1, 9);
      for (let j = 0; j < c; j++) {
        arr.push(randInt(1, 50));
      }
      nset.add(arr);
      expect(nset.has(arr)).toBe(true);
      items.push(arr);
    }
    expect(nset.size).toBeLessThanOrEqual(1000);
    compareArrayAndSet(items, nset);
    const startSize = nset.size;
    for (let i = 0; i < 10; i++) {
      const arr = [];
      const c = randInt(1, 9);
      for (let j = 0; j < c; j++) {
        arr.push(randInt(1, 50));
      }
      if (nset.has(arr)) {
        continue;
      }
      expect(nset.delete(arr)).toBe(false);
    }
    expect(nset.size).toEqual(startSize);
    compareArrayAndSet(items, nset);
    let removedItems = 0;
    for (let i = 0; i < 100; i++) {
      const index = randInt(0, items.length - 1);
      const val = items[index];
      const valString = JSON.stringify(val);
      items = items.filter(it => { // remove all occurences from array
        if (it.length !== val.length || it[0] !== val[0]) {
          return true;
        }
        return JSON.stringify(it) !== valString;
      });
      if (nset.delete(val)) removedItems++;
    }
    expect(nset.size).toEqual(startSize - removedItems);
    compareArrayAndSet(items, nset);
  }
});