import NSet from '../lib/NSet';

test('constructor', () => {
  let set = new NSet();
  expect(set.size).toBe(0);
  expect(set.toJSON().length).toBe(0);

  set.add([2, 3]);
  set.add(2);
  expect(set.size).toBe(2);
  expect(set.toJSON()).toStrictEqual([[2, 3], [2]]);

  set = new NSet(set);
  expect(set.size).toBe(2);
  expect(set.toJSON()).toStrictEqual([[2, 3], [2]]);

  set = new NSet(new Set([ 2, 2, 5, 6 ]));
  expect(set.size).toBe(3);
  expect(set.toJSON()).toStrictEqual([[2], [5], [6]]);

  set = new NSet([ 2, 2, 5, 6, 2, [2, 3], [2, 3] ]);
  expect(set.size).toBe(4);
  expect(set.toJSON()).toStrictEqual([ [2], [2, 3], [5], [6] ]);

  expect(() => new NSet({} as any)).toThrow();
});

test('add', () => {
  const set = new NSet();
  expect(set.size).toBe(0);
  set.add(1);
  expect(set.size).toBe(1);
  expect(set.toJSON()).toStrictEqual([ [ 1 ] ]);
  set.add(1);
  expect(set.size).toBe(1);
  set.add(2);
  expect(set.size).toBe(2);
  expect(set.toJSON()).toStrictEqual([ [ 1 ], [ 2 ] ]);
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
  expect(set.toJSON()).toStrictEqual([ [ 1 ], [ 1, 2 ], [ 1, 3 ], [ 2 ], [ 2, 3 ], [ 2, 3, 6 ] ]);
  set.add(2, 3);
  expect(set.size).toBe(6);
  set.add(2);
  expect(set.size).toBe(6);
  set.add(1, 2);
  expect(set.size).toBe(6);
  expect(set.toJSON()).toStrictEqual([ [ 1 ], [ 1, 2 ], [ 1, 3 ], [ 2 ], [ 2, 3 ], [ 2, 3, 6 ] ]);
});

test('add special', () => {
  const set = new NSet();
  set.add(1);
  set.add(1, 2);
  set.add([1, 3]);
  set.add([2, 3]);
  set.add(2, 3, 6);
  set.add(2);
  expect(set.toJSON()).toStrictEqual([ [ 1 ], [ 1, 2 ], [ 1, 3 ], [ 2, 3 ], [ 2, 3, 6 ], [ 2 ] ]);
  set.add(2, null);
  expect(set.size).toBe(7);
  expect(set.toJSON()).toStrictEqual([ [ 1 ], [ 1, 2 ], [ 1, 3 ], [ 2, 3 ], [ 2, 3, 6 ], [ 2 ], [ 2, null ] ]);
  set.add(2, null, null);
  set.add(2, null, null);
  set.add(2, null, null, 5);
  expect(set.size).toBe(9);
  set.add(null);
  expect(set.size).toBe(10);
  expect(set.toJSON()).toStrictEqual([ [ 1 ], [ 1, 2 ], [ 1, 3 ], [ 2, 3 ], [ 2, 3, 6 ], [ 2 ], [ 2, null ], [ 2, null, null ], [ 2, null, null, 5 ], [ null ] ]);
  expect(() => set.add()).toThrow();
  expect(() => set.add(2, undefined, 3)).toThrow();
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
  expect(() => set.has()).toThrow();
  expect(set.has(null)).toBe(false);
  set.add(2, 3, null);
  expect(set.has(null)).toBe(false);
  expect(set.has(2, 3, null)).toBe(true);
  expect(set.has(2, 3, null, 1)).toBe(false);
  expect(() => set.has(undefined)).toThrow();
  expect(() => set.has(2, 3, undefined)).toThrow();
  expect(() => set.has(2, 3, undefined, null)).toThrow();
  expect(() => set.has(undefined, 1)).toThrow();
});

test('delete', () => {
  const set = new NSet();
  expect(set.size).toBe(0);
  set.add(1);
  expect(set.size).toBe(1);
  expect(set.toJSON()).toStrictEqual([ [ 1 ] ]);
  set.add(2);
  expect(set.size).toBe(2);
  expect(set.toJSON()).toStrictEqual([ [ 1 ], [ 2 ] ]);
  expect(set.delete(3)).toBe(false);
  expect(set.size).toBe(2);
  expect(set.toJSON()).toStrictEqual([ [ 1 ], [ 2 ] ]);
  expect(set.delete([1])).toBe(true);
  expect(set.size).toBe(1);
  expect(set.toJSON()).toStrictEqual([ [ 2 ] ]);
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
  expect(set.toJSON()).toStrictEqual([ [ 2, 3, 4 ], [2, 3] ]);
  expect(() => set.delete()).toThrow();
  expect(() => set.delete(undefined)).toThrow();
  expect(() => set.delete(2, 3, undefined)).toThrow();
  expect(() => set.delete(2, 3, undefined, null)).toThrow();
  expect(() => set.delete(undefined, 1)).toThrow();
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
  expect(arr).toStrictEqual([ [ 1 ], [ 1, 2 ], [ 2, 3, 6 ], [ 2, 3 ], [ 2 ] ]);
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
  expect(arr).toStrictEqual([ [ 1 ], [ 1, 2 ], [ 2, 3, 6 ], [ 2, 3 ], [ 2 ] ]);
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
  expect(set.toJSON()).toStrictEqual([]);
  set.add(2);
  expect(set.size).toBe(1);
  expect(set.toJSON()).toStrictEqual([ [2] ]);
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

test('empty', () => {
  const set = new NSet<number>();
  expect(set.inspect()).toBe('NSet {  }');
  expect(set.size).toBe(0);
  expect(set.has(null)).toBe(false);
  expect(() => set.has(undefined)).toThrow();
  expect(set.has(1)).toBe(false);
  expect(() => set.has()).toThrow();
  expect(set.delete(null)).toBe(false);
  expect(() => set.delete(undefined)).toThrow();
  expect(set.delete(1)).toBe(false);
  expect(() => set.delete()).toThrow();
  expect(set.entries().next().done).toBe(true);
  expect(set.values().next().done).toBe(true);
  const fn = jest.fn();
  set.forEach(fn);
  expect(fn.mock.calls.length).toBe(0);
});

test('clone', () => {
  const set = new NSet();
  set.add(1);
  set.add(2, 3, 6);
  set.add(2, 3);
  set.add(1, 2);
  set.add(1, 2);
  set.add(2);
  const set2 = set.clone();
  expect(set.toJSON()).toStrictEqual(set2.toJSON());
  set.add(1);
  expect(set.toJSON()).toStrictEqual(set2.toJSON());
  set.add(2, 3);
  expect(set.toJSON()).toStrictEqual(set2.toJSON());
  set2.add(2, 3);
  expect(set.toJSON()).toStrictEqual(set2.toJSON());
  set.add(2, 3, 4);
  expect(set.toJSON()).not.toStrictEqual(set2.toJSON());
});