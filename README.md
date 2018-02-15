n-set
=======

[![Build Status](https://travis-ci.org/Daninet/n-set.svg?branch=master)](https://travis-ci.org/Daninet/n-set)
[![Coverage Status](https://coveralls.io/repos/github/Daninet/n-set/badge.svg?branch=master)](https://coveralls.io/github/Daninet/n-set?branch=master)
[![license](https://img.shields.io/github/license/Daninet/n-set.svg)](https://github.com/Daninet/n-set/blob/master/LICENSE)

Allows to put arrays into sets. Works similarly like ES6 Sets.

Install
=======
```
npm i n-set
```

Example
=======
```javascript
const NSet = require('n-set');
const set = new NSet();
set.add(1);
set.add(2);
set.add(2);
console.log(set); // NSet { (1), (2) }
set.add(1, 2, 3);
set.add(1, 5);
set.add([1, 5]); // you can pass it as an array too
console.log(set); // NSet { (1), (1, 2, 3), (1, 5), (2) }
set.delete(1, 2, 3);
console.log(set); // NSet { (1), (1, 5), (2) }
console.log(set.has(1, 2, 3)); // false
console.log(set.has(1, 5)); // true
```
How it works?
=======
It uses ES6 Maps for storing each level of depth and an ES6 Set for the last one.

By example for storing (1, 2, 3) and (1, 2, 4), it will use internally this data structure:
```
Map( 1 => 
  Map ( 2 => 
    Set ( 3, 4 )
  )
)
```

Methods
=======
set.add(tuple)
-------
Appends the specified tuple of values to the end of Set. The values can be passed as an array or as parameters: `set.add(1, 2, 3)` has the same behaviour as `set.add([1, 2, 3])`. 

Note: Adding `undefined` value is not supported.

Returns the Set object.

set.clear()
-------
Removes all elements from a Set object.

set.delete(tuple)
-------
Removes the specified tuple from a Set object. The values can be passed as an array or as parameters: `set.delete(1, 2, 3)` has the same behaviour as `set.delete([1, 2, 3])`.
Returns `true` if an element in the Set object has been removed successfully; otherwise `false`.

set.entries()
-------
Returns a new `Iterator` object that contains an array of `[tuple, tuple]` for each element in the Set object.

set.forEach(func)
-------
Executes the provided function once for each value in the Set object.

set.has(tuple)
-------
Returns a boolean indicating whether an element with the specified tuple exists in a Set object or not.

set.size
-------
Returns the number of elements in the Set object.

set.values()
-------
Returns a new `Iterator` object that contains the values for each element in the Set object.

Performance
=======

Each test consists of three operations:
- .add() 250 000 tuples
- .has() on the 250 000 tuples 
- .delete() on the 250 000 tuples

1-depth has ~250 000 tuples of length 1. [v1] - Native ES6 Sets and Maps supports only these.

2-depth has ~250 000 tuples of length 2. [v1, v2]

3-depth has ~250 000 tuples of length 3. [v1, v2, v3]

4-depth has ~250 000 tuples of length 4. [v1, v2, v3, v4]

The source of this benchmark can be found in file `benchmark.js`.

```
Running it with Node.js v8.9.4 on Intel i7-7700K CPU.

After 5 runs:
------------
Map 1-depth  - Min: 23.359 ms, Max: 27.608 ms, Mean: 25.142 ms, Median: 23.847 ms
Set 1-depth  - Min: 22.383 ms, Max: 27.031 ms, Mean: 24.195 ms, Median: 24.385 ms
NSet 1-depth - Min: 41.212 ms, Max: 172.270 ms, Mean: 70.170 ms, Median: 41.787 ms
NSet 2-depth - Min: 97.894 ms, Max: 110.139 ms, Mean: 102.154 ms, Median: 110.139 ms
NSet 3-depth - Min: 206.468 ms, Max: 349.996 ms, Mean: 237.171 ms, Median: 208.478 ms
NSet 4-depth - Min: 972.355 ms, Max: 1079.711 ms, Mean: 1052.376 ms, Median: 1072.435 ms
```

License
=======
MIT
