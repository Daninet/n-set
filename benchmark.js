const N = 10;
const NS_PER_SEC = 1e9;

const NSet = require('./')

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setItems = [];
for (let i = 0; i < 1e7; i++) {
  setItems.push(randInt(0, 999));
}

const toDelete = [];
for (let i = 0; i < 1e4; i++) {
  toDelete.push(randInt(0, 999));
}

const toSearch = [];
for (let i = 0; i < 1e4; i++) {
  toSearch.push(randInt(0, 999));
}

const tests = [];
tests.push(() => {
  const map = new Map();
  for (let i = 0; i < setItems.length; i++) {
    map.set(setItems[i], true);
  }
  return {name: 'Map set()', value: map.size};
});
tests.push(() => {
  const set = new Set();
  for (let i = 0; i < setItems.length; i++) {
    set.add(setItems[i]);
  }
  return {name: 'Set add()', value: set.size};
});
tests.push(() => {
  const set = new Set(setItems);
  return {name: 'Set constructor', value: set.size};
});
tests.push(() => {
  const set = new NSet();
  for (let i = 0; i < setItems.length; i++) {
    set.add(setItems[i]);
  }
  return {name: 'NSet add()', value: set.size};
});


const results = [];

for (let n = 0; n < N; n++) {
  tests.forEach((test, key) => {
    if (!results[key]) {
      results[key] = {
        results: [],
        timings: [],
      };
    }
    const startTime = process.hrtime();
    const res = tests[key](); // run test
    const duration = process.hrtime(startTime);
    results[key].results.push(res);
    results[key].timings.push((duration[0] * NS_PER_SEC + duration[1]) / 1000000);
  });
}

function formatTiming(ms) {
  return `${ms.toFixed(3)} ms`;
}

console.log(`After ${N} runs:\n------------`);
results.forEach(result => {
  result.timings.sort();
  const sum = result.timings.reduce((sum, x) => sum + x);
  const avg = sum / N;
  const middle = Math.floor(N / 2);
  const median = N % 2 === 0 ? (result.timings[middle] + result.timings[middle - 1]) / 2 : result.timings[middle];
  console.log(`${result.results[0].name} - Avg: ${formatTiming(avg)}, Median ${formatTiming(median)}`);
});