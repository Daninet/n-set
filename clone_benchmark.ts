import NSet from './lib/NSet';

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

const set = new NSet(setItems);
// warmup
const s1 = new NSet();
set.forEach(value => s1.add(value));
const s2 = set.clone();


for (let i = 0; i < 5; i++) {
  console.time('clone forEach');
  const clonedWithForEach = new NSet();
  set.forEach(value => clonedWithForEach.add(value));
  console.log(clonedWithForEach.size);
  console.timeEnd('clone forEach');
  console.time('clone func');
  const clonedWithFunc = set.clone();
  console.log(clonedWithFunc.size);
  console.timeEnd('clone func');
}