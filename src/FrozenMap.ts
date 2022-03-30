export class FrozenMap<Key, Value> implements ReadonlyMap<Key, Value> {
  #_map: Map<Key, Value>;

  public entries: ReadonlyMap<Key, Value>['entries'];

  public forEach: ReadonlyMap<Key, Value>['forEach'];

  public get: ReadonlyMap<Key, Value>['get'];

  public has: ReadonlyMap<Key, Value>['has'];

  public keys: ReadonlyMap<Key, Value>['keys'];

  public values: ReadonlyMap<Key, Value>['values'];

  public get size() {
    return this.#_map.size;
  }

  public get [Symbol.iterator]() {
    return this.#_map[Symbol.iterator];
  }

  constructor(entries?: readonly (readonly [Key, Value])[] | null) {
    this.#_map = new Map<Key, Value>(entries);

    this.entries = this.#_map.entries.bind(this.#_map);
    this.forEach = this.#_map.forEach.bind(this.#_map);
    this.get = this.#_map.get.bind(this.#_map);
    this.has = this.#_map.has.bind(this.#_map);
    this.keys = this.#_map.keys.bind(this.#_map);
    this.values = this.#_map.values.bind(this.#_map);

    Object.freeze(this);
  }

  public toString(): string {
    return `FrozenMap {${
      this.size > 0
        ? ` ${[...this.entries()]
            .map(([key, value]) => `${String(key)} => ${String(value)}`)
            .join(', ')} `
        : ''
    }}`;
  }
}

const foo = new FrozenMap([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
console.log(foo);
console.log(foo.toString());
console.log(new FrozenMap().toString());
console.log(new FrozenMap([['a', 1]]).toString());
console.log(
  new FrozenMap([
    ['a', 1],
    ['b', 2],
  ]).entries(),
);
console.log(new Map());
