import NSet from './lib/NSet';

const N = 5;
const NS_PER_SEC = 1e9;

function randInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setItems = [];
for (let i = 0; i < 1e6; i++) {
  const it = [];
  const len = randInt(1, 4);
  for (let j = 0; j < len; j++) {
    it.push(randInt(0, 999));
  }
  setItems.push(it);
}

console.log(`Data distribution:\n------------`);
console.log(`= 1-depth - ${setItems.filter(it => it.length === 1).length}`);
console.log(`= 2-depth - ${setItems.filter(it => it.length === 2).length}`);
console.log(`= 3-depth - ${setItems.filter(it => it.length === 3).length}`);
console.log(`= 4-depth - ${setItems.filter(it => it.length === 4).length}\n\n`);

const tests = [];

const setItems1 = setItems.filter(it => it.length === 1);

tests.push(() => {
  const map = new Map();
  for (let i = 0; i < setItems1.length; i++) {
    map.set(setItems1[i][0], true);
  }
  for (let i = 0; i < setItems1.length; i++) {
    if (!map.has(setItems1[i][0])) {
      return false;
    }
  }
  for (let i = setItems1.length - 1; i >= 0; i--) {
    map.delete(setItems1[i][0]);
  }
  return {name: 'Map', value: map.size};
});

tests.push(() => {
  const set = new Set();
  for (let i = 0; i < setItems1.length; i++) {
    set.add(setItems1[i][0]);
  }
  for (let i = 0; i < setItems1.length; i++) {
    if (!set.has(setItems1[i][0])) {
      return false;
    }
  }
  for (let i = setItems1.length - 1; i >= 0; i--) {
    set.delete(setItems1[i][0]);
  }
  return {name: 'Set', value: set.size};
});

tests.push(() => {
  const set = new NSet();
  for (let i = 0; i < setItems1.length; i++) {
    set.add(setItems1[i]);
  }
  for (let i = 0; i < setItems1.length; i++) {
    if (!set.has(setItems1[i])) {
      return false;
    }
  }
  for (let i = setItems1.length - 1; i >= 0; i--) {
    set.delete(setItems1[i]);
  }
  return {name: 'NSet 1-depth', value: set.size};
});

const setItems2 = setItems.filter(it => it.length === 2);

tests.push(() => {
  const set = new NSet();

  for (let i = 0; i < setItems2.length; i++) {
    set.add(...setItems2[i]);
  }
  for (let i = 0; i < setItems2.length; i++) {
    if (!set.has(...setItems2[i])) {
      return false;
    }
  }
  for (let i = setItems2.length - 1; i >= 0; i--) {
    set.delete(...setItems2[i]);
  }
  return {name: 'NSet 2-depth', value: set.size};
});

const setItems3 = setItems.filter(it => it.length === 3);

tests.push(() => {
  const set = new NSet();

  for (let i = 0; i < setItems3.length; i++) {
    set.add(...setItems3[i]);
  }
  for (let i = 0; i < setItems3.length; i++) {
    if (!set.has(...setItems3[i])) {
      return false;
    }
  }
  for (let i = setItems3.length - 1; i >= 0; i--) {
    set.delete(...setItems3[i]);
  }
  return {name: 'NSet 3-depth', value: set.size};
});

tests.push(() => {
  const set = new NSet();

  for (let i = 0; i < setItems.length; i++) {
    set.add(...setItems[i]);
  }
  for (let i = 0; i < setItems.length; i++) {
    if (!set.has(...setItems[i])) {
      return false;
    }
  }
  for (let i = setItems.length - 1; i >= 0; i--) {
    set.delete(...setItems[i]);
  }
  return {name: 'NSet all-depth', value: set.size};
});

const results = [];

for (let n = 0; n < N; n++) {
  tests.forEach((test, key) => {
    if (!results[key]) {
      results[key] = {
        results: [],
        timings: []
      };
    }
    const startTime = process.hrtime();
    const res = tests[key](); // run test
    const duration = process.hrtime(startTime);
    results[key].results.push(res);
    results[key].timings.push((duration[0] * NS_PER_SEC + duration[1]) / 1000000);
  });
}

function formatTiming (ms) {
  return `${ms.toFixed(3)} ms`;
}

console.log(`After ${N} runs:\n------------`);
results.forEach(result => {
  result.timings.sort();
  const sum = result.timings.reduce((sum, x) => sum + x);
  const avg = sum / N;
  const middle = Math.floor(N / 2);
  const median = N % 2 === 0 ? (result.timings[middle] + result.timings[middle - 1]) / 2 : result.timings[middle];
  const min = Math.min(...result.timings);
  const max = Math.max(...result.timings);
  console.log(`${result.results[0].name.padEnd(20)} - Min: ${formatTiming(min)}, Max: ${formatTiming(max)}, Mean: ${formatTiming(avg)}, Median: ${formatTiming(median)}`);
});
