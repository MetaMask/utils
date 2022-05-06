import { FrozenMap, FrozenSet } from './collections';

// describe('FrozenMap', () => {
//   it.todo('does the thing');
// })

// describe('FrozenSet', () => {
//   it.todo('does the thing');
// })

console.log(Object.isFrozen(FrozenSet));
console.log(Object.isFrozen(FrozenSet.prototype));

const foo = new FrozenSet(['a', 'b', 'c']);
console.log(foo);
console.log(foo.toString());
console.log(new FrozenSet().toString());
console.log(new FrozenSet(['a']).toString());
console.log(new FrozenSet(['a', 'b']).toString());
console.log(new Set());
console.log(new Set(['a', 'b', 'c']));

console.log();
console.log();

const bar = new FrozenMap([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
console.log(bar);
console.log(bar.toString());
console.log(new FrozenMap().toString());
console.log(new FrozenMap([['a', 1]]).toString());
console.log(
  new FrozenMap([
    ['a', 1],
    ['b', 2],
  ]).entries(),
);
console.log(new Map());
console.log(new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]));
