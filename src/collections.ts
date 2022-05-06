/**
 * A {@link ReadonlyMap} that cannot be modified after instantiation.
 */
class FrozenMap<Key, Value> implements ReadonlyMap<Key, Value> {
  #map: Map<Key, Value>;

  public entries: ReadonlyMap<Key, Value>['entries'];

  public forEach: ReadonlyMap<Key, Value>['forEach'];

  public get: ReadonlyMap<Key, Value>['get'];

  public has: ReadonlyMap<Key, Value>['has'];

  public keys: ReadonlyMap<Key, Value>['keys'];

  public values: ReadonlyMap<Key, Value>['values'];

  public get size() {
    return this.#map.size;
  }

  public get [Symbol.iterator]() {
    return this.#map[Symbol.iterator];
  }

  constructor(entries?: readonly (readonly [Key, Value])[] | null) {
    this.#map = new Map<Key, Value>(entries);

    this.entries = this.#map.entries.bind(this.#map);
    this.forEach = this.#map.forEach.bind(this.#map);
    this.get = this.#map.get.bind(this.#map);
    this.has = this.#map.has.bind(this.#map);
    this.keys = this.#map.keys.bind(this.#map);
    this.values = this.#map.values.bind(this.#map);

    Object.freeze(this);
  }

  public toString(): string {
    return `FrozenMap(${this.size}) {${
      this.size > 0
        ? ` ${[...this.entries()]
            .map(([key, value]) => `${String(key)} => ${String(value)}`)
            .join(', ')} `
        : ''
    }}`;
  }
}

/**
 * A {@link ReadonlySet} that cannot be modified after instantiation.
 */
class FrozenSet<Value> implements ReadonlySet<Value> {
  #set: Set<Value>;

  public entries: ReadonlySet<Value>['entries'];

  public forEach: ReadonlySet<Value>['forEach'];

  public has: ReadonlySet<Value>['has'];

  public keys: ReadonlySet<Value>['keys'];

  public values: ReadonlySet<Value>['values'];

  public get size() {
    return this.#set.size;
  }

  public get [Symbol.iterator]() {
    return this.#set[Symbol.iterator];
  }

  constructor(values?: readonly Value[] | null) {
    this.#set = new Set<Value>(values);

    this.entries = this.#set.entries.bind(this.#set);
    this.forEach = this.#set.forEach.bind(this.#set);
    this.has = this.#set.has.bind(this.#set);
    this.keys = this.#set.keys.bind(this.#set);
    this.values = this.#set.values.bind(this.#set);

    Object.freeze(this);
  }

  public toString(): string {
    return `FrozenSet(${this.size}) {${
      this.size > 0
        ? ` ${[...this.values()].map((member) => String(member)).join(', ')} `
        : ''
    }}`;
  }
}

Object.freeze(FrozenSet)
Object.freeze(FrozenSet.prototype)

Object.freeze(FrozenMap)
Object.freeze(FrozenMap.prototype)


export {
  FrozenMap,
  FrozenSet,
}
