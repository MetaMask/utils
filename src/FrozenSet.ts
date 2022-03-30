export class FrozenSet<Type> implements ReadonlySet<Type> {
  #_set: Set<Type>;

  public entries: ReadonlySet<Type>['entries'];

  public forEach: ReadonlySet<Type>['forEach'];

  public has: ReadonlySet<Type>['has'];

  public keys: ReadonlySet<Type>['keys'];

  public values: ReadonlySet<Type>['values'];

  public get size() {
    return this.#_set.size;
  }

  public get [Symbol.iterator]() {
    return this.#_set[Symbol.iterator];
  }

  constructor(values?: readonly Type[] | null) {
    this.#_set = new Set<Type>(values);

    this.entries = this.#_set.entries.bind(this.#_set);
    this.forEach = this.#_set.forEach.bind(this.#_set);
    this.has = this.#_set.has.bind(this.#_set);
    this.keys = this.#_set.keys.bind(this.#_set);
    this.values = this.#_set.values.bind(this.#_set);

    Object.freeze(this);
  }

  public toString(): string {
    return `FrozenSet {${
      this.size > 0
        ? ` ${[...this.values()].map((member) => String(member)).join(', ')} `
        : ''
    }}`;
  }
}

const foo = new FrozenSet(['a', 'b', 'c']);
console.log(foo);
console.log(foo.toString());
console.log(new FrozenSet().toString());
console.log(new FrozenSet(['a']).toString());
console.log(new FrozenSet(['a', 'b']).toString());
console.log(new Set());
