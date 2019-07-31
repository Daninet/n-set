import NSet from '../lib/NSet';

test('add', () => {
  const set = new NSet();
  expect(set.size).toBe(0);
  
  const obj1 = { x: 5 };
  set.add(obj1);
  expect(set.size).toBe(1);
  expect(set.has(obj1)).toBe(true);
  expect(set.toJSON()).toEqual([ [ obj1 ] ]);

  set.add(obj1);
  expect(set.size).toBe(1);
  expect(set.has(obj1)).toBe(true);
  expect(set.toJSON()).toEqual([ [ obj1 ] ]);

  const obj2 = { y: 6 };
  expect(set.has(obj2)).toBe(false);
  set.add(obj2);
  expect(set.size).toBe(2);
  expect(set.has(obj2)).toBe(true);
  expect(set.toJSON()).toEqual([ [ obj1 ], [ obj2 ] ]);

  const obj3 = { y: 6, x: 10 };
  set.add(obj3);
  expect(set.size).toBe(3);
  expect(set.has(obj3)).toBe(true);
  expect(set.toJSON()).toEqual([ [ obj1 ], [ obj2 ], [ obj3 ] ]);

  set.add(obj1, obj2, obj3);
  expect(set.size).toBe(4);
  expect(set.has(obj1, obj2, obj3)).toBe(true);
  expect(set.has(obj1, obj2)).toBe(false);
  expect(set.toJSON()).toEqual([ [ obj1 ], [ obj1, obj2, obj3 ], [ obj2 ], [ obj3 ] ]);

  set.add(1, 2, 3);
  expect(set.size).toBe(5);
  expect(set.has(1, 2, 3)).toBe(true);
  expect(set.has(1)).toBe(false);
  expect(set.toJSON()).toEqual([ [ obj1 ], [ obj1, obj2, obj3 ], [ obj2 ], [ obj3 ], [1, 2, 3] ]);

  const obj4 = {};
  set.add(obj4);
  set.add(obj4);
  expect(set.size).toBe(6);
  expect(set.has(obj4)).toBe(true);
  expect(set.toJSON()).toEqual([ [ obj1 ], [ obj1, obj2, obj3 ], [ obj2 ], [ obj3 ], [1, 2, 3], [ obj4 ] ]);
});

test('clone', () => {
  const set = new NSet();
  const obj1 = { x: 5 };
  const obj2 = { y: 6 };
  const obj3 = { y: 6, x: 10 };
  set.add(obj1);
  set.add(obj2);
  set.add(obj3);
  set.add(obj1, obj2, obj3);

  const set2 = set.clone();
  expect(set2.toJSON()).toEqual([ [ obj1 ], [ obj1, obj2, obj3 ], [ obj2 ], [ obj3 ] ]);
});

test('delete', () => {
  const set = new NSet();
  const obj1 = { x: 5 };
  const obj2 = { y: 6 };
  const obj3 = { y: 6, x: 10 };
  set.add(obj1);
  set.add(obj2);
  set.add(obj3);
  set.add(obj1, obj2, obj3);

  expect(set.delete({})).toBe(false);
  expect(set.delete({ x: 5 })).toBe(false);
  expect(set.size).toBe(4);
  expect(set.delete(obj3)).toBe(true);
  expect(set.size).toBe(3);
  expect(set.delete(obj1, obj2)).toBe(false);
  expect(set.delete(obj1, obj2, obj3)).toBe(true);
  expect(set.size).toBe(2);
  expect(set.toJSON()).toEqual([ [ obj1 ], [ obj2 ] ]);
});

