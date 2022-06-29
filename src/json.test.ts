import {
  assertIsJsonRpcFailure,
  assertIsJsonRpcNotification,
  assertIsJsonRpcRequest,
  assertIsJsonRpcSuccess,
  getJsonRpcIdValidator,
  getJsonSerializableInfo,
  isJsonRpcFailure,
  isJsonRpcNotification,
  isJsonRpcRequest,
  isJsonRpcSuccess,
  isValidJson,
  jsonrpc2,
  JsonRpcError,
} from '.';

const getError = () => {
  const error: any = new Error('bar');
  error.code = 2;
  return error as JsonRpcError;
};

describe('json', () => {
  // TODO: Make this test suite exhaustive.
  // The current implementation is guaranteed to be correct, but in the future
  // we may opt for a bespoke implementation that is more performant, but may
  // contain bugs.
  describe('isValidJson', () => {
    it('identifies valid JSON values', () => {
      [
        null,
        { a: 1 },
        ['a', 2, null],
        [{ a: null, b: 2, c: [{ foo: 'bar' }] }],
      ].forEach((validValue) => {
        expect(isValidJson(validValue)).toBe(true);
      });

      [
        undefined,
        Symbol('bar'),
        Promise.resolve(),
        () => 'foo',
        [{ a: undefined }],
      ].forEach((invalidValue) => {
        expect(isValidJson(invalidValue)).toBe(false);
      });
    });
  });

  describe('isJsonRpcNotification', () => {
    it('identifies a JSON-RPC notification', () => {
      expect(
        isJsonRpcNotification({
          jsonrpc: jsonrpc2,
          method: 'foo',
        }),
      ).toBe(true);
    });

    it('identifies a JSON-RPC request', () => {
      expect(
        isJsonRpcNotification({
          jsonrpc: jsonrpc2,
          id: 1,
          method: 'foo',
        }),
      ).toBe(false);
    });
  });

  describe('assertIsJsonRpcNotification', () => {
    it('identifies JSON-RPC notification objects', () => {
      [
        { jsonrpc: jsonrpc2, method: 'foo' },
        { jsonrpc: jsonrpc2, method: 'bar', params: ['baz'] },
      ].forEach((input) => {
        expect(() => assertIsJsonRpcNotification(input)).not.toThrow();
      });

      [
        { id: 1, jsonrpc: jsonrpc2, method: 'foo' },
        { id: 1, jsonrpc: jsonrpc2, method: 'bar', params: ['baz'] },
      ].forEach((input) => {
        expect(() => assertIsJsonRpcNotification(input)).toThrow(
          'Not a JSON-RPC notification.',
        );
      });
    });
  });

  describe('isJsonRpcRequest', () => {
    it('identifies a JSON-RPC notification', () => {
      expect(
        isJsonRpcRequest({
          id: 1,
          jsonrpc: jsonrpc2,
          method: 'foo',
        }),
      ).toBe(true);
    });

    it('identifies a JSON-RPC request', () => {
      expect(
        isJsonRpcRequest({
          jsonrpc: jsonrpc2,
          method: 'foo',
        }),
      ).toBe(false);
    });
  });

  describe('assertIsJsonRpcRequest', () => {
    it('identifies JSON-RPC notification objects', () => {
      [
        { id: 1, jsonrpc: jsonrpc2, method: 'foo' },
        { id: 1, jsonrpc: jsonrpc2, method: 'bar', params: ['baz'] },
      ].forEach((input) => {
        expect(() => assertIsJsonRpcRequest(input)).not.toThrow();
      });

      [
        { jsonrpc: jsonrpc2, method: 'foo' },
        { jsonrpc: jsonrpc2, method: 'bar', params: ['baz'] },
      ].forEach((input) => {
        expect(() => assertIsJsonRpcRequest(input)).toThrow(
          'Not a JSON-RPC request.',
        );
      });
    });
  });

  describe('isJsonRpcSuccess', () => {
    it('identifies a successful JSON-RPC response', () => {
      expect(
        isJsonRpcSuccess({
          jsonrpc: jsonrpc2,
          id: 1,
          result: 'foo',
        }),
      ).toBe(true);
    });

    it('identifies a failed JSON-RPC response', () => {
      expect(
        isJsonRpcSuccess({
          jsonrpc: jsonrpc2,
          id: 1,
          error: getError(),
        }),
      ).toBe(false);
    });
  });

  describe('assertIsJsonRpcSuccess', () => {
    it('identifies JSON-RPC response objects', () => {
      [
        { id: 1, jsonrpc: jsonrpc2, result: 'success' },
        { id: 1, jsonrpc: jsonrpc2, result: null },
      ].forEach((input) => {
        expect(() => assertIsJsonRpcSuccess(input)).not.toThrow();
      });

      [
        { id: 1, jsonrpc: jsonrpc2, error: getError() },
        { id: 1, jsonrpc: jsonrpc2, error: null as any },
      ].forEach((input) => {
        expect(() => assertIsJsonRpcSuccess(input)).toThrow(
          'Not a successful JSON-RPC response.',
        );
      });
    });
  });

  describe('isJsonRpcFailure', () => {
    it('identifies a failed JSON-RPC response', () => {
      expect(
        isJsonRpcFailure({
          jsonrpc: jsonrpc2,
          id: 1,
          error: getError(),
        }),
      ).toBe(true);
    });

    it('identifies a successful JSON-RPC response', () => {
      expect(
        isJsonRpcFailure({
          jsonrpc: jsonrpc2,
          id: 1,
          result: 'foo',
        }),
      ).toBe(false);
    });
  });

  describe('assertIsJsonRpcFailure', () => {
    it('identifies JSON-RPC response objects', () => {
      ([{ error: 'failure' }, { error: null }] as any[]).forEach((input) => {
        expect(() => assertIsJsonRpcFailure(input)).not.toThrow();
      });

      ([{ result: 'success' }, {}] as any[]).forEach((input) => {
        expect(() => assertIsJsonRpcFailure(input)).toThrow(
          'Not a failed JSON-RPC response.',
        );
      });
    });
  });

  describe('getJsonRpcIdValidator', () => {
    const getInputs = () => {
      return {
        // invariant with respect to options
        fractionString: { value: '1.2', expected: true },
        negativeInteger: { value: -1, expected: true },
        object: { value: {}, expected: false },
        positiveInteger: { value: 1, expected: true },
        string: { value: 'foo', expected: true },
        undefined: { value: undefined, expected: false },
        zero: { value: 0, expected: true },
        // variant with respect to options
        emptyString: { value: '', expected: true },
        fraction: { value: 1.2, expected: false },
        null: { value: null, expected: true },
      };
    };

    const validateAll = (
      validate: ReturnType<typeof getJsonRpcIdValidator>,
      inputs: ReturnType<typeof getInputs>,
    ) => {
      for (const input of Object.values(inputs)) {
        expect(validate(input.value)).toStrictEqual(input.expected);
      }
    };

    it('performs as expected with default options', () => {
      const inputs = getInputs();

      // The default options are:
      // permitEmptyString: true,
      // permitFractions: false,
      // permitNull: true,
      expect(() => validateAll(getJsonRpcIdValidator(), inputs)).not.toThrow();
    });

    it('performs as expected with "permitEmptyString: false"', () => {
      const inputs = getInputs();
      inputs.emptyString.expected = false;

      expect(() =>
        validateAll(
          getJsonRpcIdValidator({
            permitEmptyString: false,
          }),
          inputs,
        ),
      ).not.toThrow();
    });

    it('performs as expected with "permitFractions: true"', () => {
      const inputs = getInputs();
      inputs.fraction.expected = true;

      expect(() =>
        validateAll(
          getJsonRpcIdValidator({
            permitFractions: true,
          }),
          inputs,
        ),
      ).not.toThrow();
    });

    it('performs as expected with "permitNull: false"', () => {
      const inputs = getInputs();
      inputs.null.expected = false;

      expect(() =>
        validateAll(
          getJsonRpcIdValidator({
            permitNull: false,
          }),
          inputs,
        ),
      ).not.toThrow();
    });
  });

  describe('getJsonSerializableInfo', () => {
    it('should return true for serialization and 10 for a size', () => {
      const valueToSerialize = {
        a: 'bc',
      };

      expect(getJsonSerializableInfo(valueToSerialize)).toStrictEqual([
        true,
        10,
      ]);
    });

    it('should return true for serialization and 11 for a size', () => {
      const valueToSerialize = {
        a: 1234,
      };

      expect(getJsonSerializableInfo(valueToSerialize)).toStrictEqual([
        true,
        10,
      ]);
    });

    it('should return true for serialization and 16 for a size when mixed UTF8 and ASCII values are used', () => {
      const valueToSerialize = {
        a: 'bcšečf',
      };

      expect(getJsonSerializableInfo(valueToSerialize)).toStrictEqual([
        true,
        16,
      ]);
    });

    it('should return true for serialization and 2 for a size when only one key with undefined value is provided', () => {
      const valueToSerialize = {
        a: undefined,
      };

      expect(getJsonSerializableInfo(valueToSerialize)).toStrictEqual([
        true,
        2,
      ]);
    });

    it('should return true for serialization and 25 for a size when some of the values are undefined', () => {
      const valueToSerialize = {
        a: undefined,
        b: 'b',
        c: undefined,
        d: 'd',
        e: undefined,
        f: 'f',
      };

      expect(getJsonSerializableInfo(valueToSerialize)).toStrictEqual([
        true,
        25,
      ]);
    });

    it('should return true for serialization and 17 for a size with mixed null and undefined in an array', () => {
      const valueToSerialize = [
        null,
        undefined,
        null,
        undefined,
        undefined,
        undefined,
        null,
        null,
        null,
        undefined,
      ];

      expect(getJsonSerializableInfo(valueToSerialize)).toStrictEqual([
        true,
        51,
      ]);
    });

    it('should return true for serialization and 1022 for a size of a complex nested object', () => {
      const complexObject = {
        data: {
          account: {
            __typename: 'Account',
            registrations: [
              {
                __typename: 'Registration',
                domain: {
                  __typename: 'Domain',
                  isMigrated: true,
                  labelName: 'mycrypto',
                  labelhash:
                    '0x9a781ca0d227debc3ee76d547c960b0803a6c9f58c6d3b4722f12ede7e6ef7c9',
                  name: 'mycrypto.eth',
                  parent: { __typename: 'Domain', name: 'eth' },
                },
                expiryDate: '1754111315',
              },
            ],
          },
          moreComplexity: {
            // numbers: [
            //   -5e-11,
            //   5e-9,
            //   0.000000000001,
            //   -0.00000000009,
            //   100000.00000008,
            //   -100.88888,
            //   0.333,
            //   1000000000000,
            // ],
            moreNestedObjects: {
              nestedAgain: {
                nestedAgain: {
                  andAgain: {
                    andAgain: {
                      value: true,
                      again: {
                        value: false,
                      },
                    },
                  },
                },
              },
            },
            differentEncodings: {
              ascii:
                '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
              utf8: 'šđćčžЀЂЇЄЖФћΣΩδλ',
              mixed: 'ABCDEFGHIJ KLMNOPQRST UVWXYZšđćč žЀЂЇЄЖФћΣΩδλ',
            },
            specialObjectsTypesAndValues: {
              t: [true, true, true],
              f: [false, false, false],
              nulls: [null, null, null],
              undef: undefined,
              mixed: [
                null,
                undefined,
                null,
                undefined,
                null,
                true,
                null,
                false,
                null,
                undefined,
              ],
              inObject: {
                valueOne: null,
                valueTwo: undefined,
                t: true,
                f: false,
              },
            },
          },
        },
      };

      expect(getJsonSerializableInfo(complexObject)).toStrictEqual([true, 934]);
    });
  });
});
