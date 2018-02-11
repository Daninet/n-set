'use strict';

const NSet = require('../');

function toArray(set) {
  const arr = [];
  set.forEach(it => arr.push(it));
  return arr;
}

test('add', () => {
  const set = new NSet();
  expect(set.size).toBe(0);
  set.add(1);
  expect(set.size).toBe(1);
  expect(toArray(set)).toEqual([ [ 1 ] ]);
  set.add(1);
  expect(set.size).toBe(1);
  set.add(2);
  expect(set.size).toBe(2);
  expect(toArray(set)).toEqual([ [ 1 ], [ 2 ] ]);
  set.add(1, 2);
  expect(set.size).toBe(3);
  set.add(1, 2);
  expect(set.size).toBe(3);
  set.add([1, 3]);
  expect(set.size).toBe(4);
  set.add([2, 3]);
  expect(set.size).toBe(5);
  set.add(2, 3, 6);
  expect(set.size).toBe(6);
  expect(toArray(set)).toEqual([ [ 1 ], [ 1, 2 ], [ 1, 3 ], [ 2 ], [ 2, 3 ], [ 2, 3, 6 ] ]);
  set.add(2, 3);
  expect(set.size).toBe(6);
  set.add(2);
  expect(set.size).toBe(6);
  set.add(1, 2);
  expect(set.size).toBe(6);
  expect(toArray(set)).toEqual([ [ 1 ], [ 1, 2 ], [ 1, 3 ], [ 2 ], [ 2, 3 ], [ 2, 3, 6 ] ]);
});

test('has', () => {
  const set = new NSet();
  set.add(1);
  expect(set.has(1)).toBe(true);
  expect(set.has(2)).toBe(false);
  expect(set.has(1, 2)).toBe(false);
  set.add(2, 3, 4);
  expect(set.has([2])).toBe(false);
  expect(set.has(3)).toBe(false);
  expect(set.has(4)).toBe(false);
  expect(set.has(2, 3)).toBe(false);
  expect(set.has([2, 3, 4])).toBe(true);
  expect(set.has([2, 3, 4, 5])).toBe(false);
  expect(set.has(2, 3, 3, 5)).toBe(false);
  expect(set.has(2, 2, 4)).toBe(false);
  set.add(1, 2);
  expect(set.has([1])).toBe(true);
  expect(set.has(1, 2)).toBe(true);
  set.add(1, 2);
  expect(set.has(1)).toBe(true);
  expect(set.has(1, 2)).toBe(true);
  set.add(2, 3);
  expect(set.has(2, 2)).toBe(false);
  expect(set.has(2, 3)).toBe(true);
  expect(set.has(2, 3, 4)).toBe(true);
});

test('delete', () => {
  const set = new NSet();
  expect(set.size).toBe(0);
  set.add(1);
  expect(set.size).toBe(1);
  expect(toArray(set)).toEqual([ [ 1 ] ]);
  set.add(2);
  expect(set.size).toBe(2);
  expect(toArray(set)).toEqual([ [ 1 ], [ 2 ] ]);
  expect(set.delete(3)).toBe(false);
  expect(set.size).toBe(2);
  expect(toArray(set)).toEqual([ [ 1 ], [ 2 ] ]);
  expect(set.delete([1])).toBe(true);
  expect(set.size).toBe(1);
  expect(toArray(set)).toEqual([ [ 2 ] ]);
  set.add(1, 2, 3);
  expect(set.delete(1, 2, 3, 4)).toBe(false);
  expect(set.size).toBe(2);
  expect(set.delete([1, 2])).toBe(false);
  expect(set.size).toBe(2);
  expect(set.delete(1, 2, 3)).toBe(true);
  expect(set.size).toBe(1);
  set.add(2, 3, 4, 5);
  set.add(2, 3);
  set.add(2, 3, 4);
  expect(set.delete(2, 4)).toBe(false);
  expect(set.delete(2)).toBe(true);
  expect(set.size).toBe(3);
  expect(set.delete(2, 3, 4, 5)).toBe(true);
  expect(toArray(set)).toEqual([ [ 2, 3, 4 ], [2, 3] ]);
});

test('foreach', () => {
  const set = new NSet();
  set.add(1);
  set.add(2, 3, 6);
  set.add(2, 3);
  set.add(1, 2);
  set.add(1, 2);
  set.add(2);
  const arr = [];
  set.forEach(it => arr.push(it));
  expect(arr).toEqual([ [ 1 ], [ 1, 2 ], [ 2, 3, 6 ], [ 2, 3 ], [ 2 ] ]);
});

test('for-of', () => {
  const set = new NSet();
  set.add(1);
  set.add(2, 3, 6);
  set.add(2, 3);
  set.add(1, 2);
  set.add(1, 2);
  set.add(2);
  const arr = [];
  for (const it of set) {
    arr.push(it);
  }
  expect(arr).toEqual([ [ 1 ], [ 1, 2 ], [ 2, 3, 6 ], [ 2, 3 ], [ 2 ] ]);
});

test('clear', () => {
  const set = new NSet();
  set.add(1);
  set.add(2, 3, 6);
  set.add(2, 3);
  set.add(1, 2);
  set.add(1, 2);
  set.add(2);
  expect(set.size).toBe(5);
  set.clear();
  expect(set.size).toBe(0);
  expect(toArray(set)).toEqual([]);
  set.add(2);
  expect(set.size).toBe(1);
  expect(toArray(set)).toEqual([ [2] ]);
});


test('inspect', () => {
  const set = new NSet();
  expect(set.inspect()).toBe('NSet {  }');
  set.add(1);
  expect(set.inspect()).toBe('NSet { (1) }');
  set.add(2, 3, 6);
  set.add(2, 3);
  set.add(1, 2);
  set.add(1, 2);
  set.add(2);
  expect(set.inspect()).toBe('NSet { (1), (1, 2), (2, 3, 6), (2, 3), (2) }');
});