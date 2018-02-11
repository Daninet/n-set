n-set
=======

[![Build Status](https://travis-ci.org/Daninet/n-set.svg?branch=master)](https://travis-ci.org/Daninet/n-set)
[![Coverage Status](https://coveralls.io/repos/github/Daninet/n-set/badge.svg?branch=master)](https://coveralls.io/github/Daninet/n-set?branch=master)
[![license](https://img.shields.io/github/license/Daninet/n-set.svg)](https://github.com/Daninet/n-set/blob/master/LICENSE)

Allows to put tuples into sets. Works similarly like ES6 Sets + it works with arrays.

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
console.log(set); // NSet { (1), (2) }
set.add(1, 2, 3);
set.add(1, 5);
console.log(set); // NSet { (1), (1, 2, 3), (1, 5), (2) }
set.delete(1, 2, 3);
console.log(set); // NSet { (1), (1, 5), (2) }
console.log(set.has(1, 2, 3)); // false
console.log(set.has(1, 5)); // true
```
Methods
=======


License
=======
MIT
