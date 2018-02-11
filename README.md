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
Methods
=======
set.add(tuple)
-------
Appends the specified tuple of values to the end of Set. The values can be passed as an array or as parameters: `set.add(1, 2, 3)` has the same behaviour as `set.add([1, 2, 3])`.
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

License
=======
MIT
