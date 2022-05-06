import { FrozenMap, FrozenSet } from './collections';

describe('FrozenMap', () => {
  describe('immutability', () => {
    it('is frozen and cannot be mutated', () => {
      const frozenMap: any = new FrozenMap();
      expect(frozenMap.set).toBeUndefined();
      expect(frozenMap.clear).toBeUndefined();

      const expectedProperties = new Set([
        'entries',
        'forEach',
        'get',
        'has',
        'keys',
        'values',
      ]);
      const properties = Object.getOwnPropertyNames(frozenMap);
      expect(properties).toHaveLength(expectedProperties.size);
      properties.forEach((propertyName) =>
        expect(expectedProperties.has(propertyName)).toBe(true),
      );

      expect(frozenMap.valueOf() instanceof Map).toBe(false);

      expect(Object.isFrozen(frozenMap)).toBe(true);
      expect(Object.isFrozen(frozenMap.prototype)).toBe(true);

      expect(Object.isFrozen(FrozenMap)).toBe(true);
      expect(Object.isFrozen(FrozenMap.prototype)).toBe(true);
    });
  });

  describe('iteration', () => {
    it('can be used as an iterator', () => {
      const input = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ] as const;
      const map = new Map([...input]);
      const frozenMap = new FrozenMap([...input]);

      for (const [key, value] of frozenMap) {
        expect(map.get(key)).toStrictEqual(value);
      }
    });
  });

  describe('toString', () => {
    it('stringifies as expected', () => {
      expect(new FrozenMap().toString()).toMatchInlineSnapshot(
        `"FrozenMap(0) {}"`,
      );

      expect(new FrozenMap([['a', 1]]).toString()).toMatchInlineSnapshot(
        `"FrozenMap(1) { a => 1 }"`,
      );

      expect(
        new FrozenMap([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ]).toString(),
      ).toMatchInlineSnapshot(`"FrozenMap(3) { a => 1, b => 2, c => 3 }"`);
    });
  });
});

describe('FrozenSet', () => {
  describe('immutability', () => {
    it('is frozen and cannot be mutated', () => {
      const frozenSet: any = new FrozenSet();
      expect(frozenSet.set).toBeUndefined();
      expect(frozenSet.clear).toBeUndefined();

      const expectedProperties = new Set([
        'entries',
        'forEach',
        'has',
        'keys',
        'values',
      ]);
      const properties = Object.getOwnPropertyNames(frozenSet);
      expect(properties).toHaveLength(expectedProperties.size);
      properties.forEach((propertyName) =>
        expect(expectedProperties.has(propertyName)).toBe(true),
      );

      expect(frozenSet.valueOf() instanceof Set).toBe(false);

      expect(Object.isFrozen(frozenSet)).toBe(true);
      expect(Object.isFrozen(frozenSet.prototype)).toBe(true);

      expect(Object.isFrozen(FrozenSet)).toBe(true);
      expect(Object.isFrozen(FrozenSet.prototype)).toBe(true);
    });
  });

  describe('iteration', () => {
    it('can be used as an iterator', () => {
      const input = ['a', 'b', 'c'];
      const set = new Set([...input]);
      const frozenSet = new FrozenSet([...input]);

      for (const value of frozenSet) {
        expect(set.has(value)).toBe(true);
      }
    });
  });

  describe('toString', () => {
    it('stringifies as expected', () => {
      expect(new FrozenSet().toString()).toMatchInlineSnapshot(
        `"FrozenSet(0) {}"`,
      );

      expect(new FrozenSet(['a']).toString()).toMatchInlineSnapshot(
        `"FrozenSet(1) { a }"`,
      );

      expect(new FrozenSet(['a', 'b', 'c']).toString()).toMatchInlineSnapshot(
        `"FrozenSet(3) { a, b, c }"`,
      );
    });
  });
});
