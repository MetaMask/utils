/**
 * A {@link ReadonlyMap} that cannot be modified after instantiation.
 * The implementation uses an inner map hidden via a private field, and the
 * immutability guarantee relies on it being impossible to get a reference
 * to this map.
 */
class FrozenMap<Key, Value> implements ReadonlyMap<Key, Value> {
  readonly #map: Map<Key, Value>;

  public readonly entries: ReadonlyMap<Key, Value>['entries'];

  public readonly forEach: ReadonlyMap<Key, Value>['forEach'];

  public readonly get: ReadonlyMap<Key, Value>['get'];

  public readonly has: ReadonlyMap<Key, Value>['has'];

  public readonly keys: ReadonlyMap<Key, Value>['keys'];

  public readonly values: ReadonlyMap<Key, Value>['values'];

  public get size() {
    return this.#map.size;
  }

  public [Symbol.iterator]() {
    return this.#map[Symbol.iterator]();
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
 * The implementation uses an inner set hidden via a private field, and the
 * immutability guarantee relies on it being impossible to get a reference
 * to this set.
 */
class FrozenSet<Value> implements ReadonlySet<Value> {
  readonly #set: Set<Value>;

  public readonly entries: ReadonlySet<Value>['entries'];

  public readonly forEach: ReadonlySet<Value>['forEach'];

  public readonly has: ReadonlySet<Value>['has'];

  public readonly keys: ReadonlySet<Value>['keys'];

  public readonly values: ReadonlySet<Value>['values'];

  public get size() {
    return this.#set.size;
  }

  public [Symbol.iterator]() {
    return this.#set[Symbol.iterator]();
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

Object.freeze(FrozenSet);
Object.freeze(FrozenSet.prototype);

Object.freeze(FrozenMap);
Object.freeze(FrozenMap.prototype);

export { FrozenMap, FrozenSet };
