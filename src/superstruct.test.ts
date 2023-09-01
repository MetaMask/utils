import { is, literal, max, number, string, union } from 'superstruct';

import { exactOptional, object } from '.';

describe('superstruct', () => {
  describe('exactOptional', () => {
    const simpleStruct = object({
      foo: exactOptional(string()),
    });

    it.each([
      { struct: simpleStruct, obj: {}, expected: true },
      { struct: simpleStruct, obj: { foo: undefined }, expected: false },
      { struct: simpleStruct, obj: { foo: 'hi' }, expected: true },
      { struct: simpleStruct, obj: { bar: 'hi' }, expected: false },
      { struct: simpleStruct, obj: { foo: 1 }, expected: false },
    ])(
      'returns $expected for is($obj, <struct>)',
      ({ struct, obj, expected }) => {
        expect(is(obj, struct)).toBe(expected);
      },
    );

    const nestedStruct = object({
      foo: object({
        bar: exactOptional(string()),
      }),
    });

    it.each([
      { struct: nestedStruct, obj: { foo: {} }, expected: true },
      { struct: nestedStruct, obj: { foo: { bar: 'hi' } }, expected: true },
      {
        struct: nestedStruct,
        obj: { foo: { bar: undefined } },
        expected: false,
      },
    ])(
      'returns $expected for is($obj, <struct>)',
      ({ struct, obj, expected }) => {
        expect(is(obj, struct)).toBe(expected);
      },
    );

    const structWithUndef = object({
      foo: exactOptional(union([string(), literal(undefined)])),
    });

    it.each([
      { struct: structWithUndef, obj: {}, expected: true },
      { struct: structWithUndef, obj: { foo: undefined }, expected: true },
      { struct: structWithUndef, obj: { foo: 'hi' }, expected: true },
      { struct: structWithUndef, obj: { bar: 'hi' }, expected: false },
      { struct: structWithUndef, obj: { foo: 1 }, expected: false },
    ])(
      'returns $expected for is($obj, <struct>)',
      ({ struct, obj, expected }) => {
        expect(is(obj, struct)).toBe(expected);
      },
    );

    it('should support refinements', () => {
      const struct = object({
        foo: exactOptional(max(number(), 0)),
      });

      expect(is({ foo: 0 }, struct)).toBe(true);
      expect(is({ foo: -1 }, struct)).toBe(true);
      expect(is({ foo: 1 }, struct)).toBe(false);
    });
  });
});
