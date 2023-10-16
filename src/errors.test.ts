import fs from 'fs';

import {
  getErrorMessage,
  isErrorWithCode,
  isErrorWithMessage,
  isErrorWithStack,
  wrapError,
} from './errors';

describe('isErrorWithCode', () => {
  it('returns true if given an object that includes a "code" property', () => {
    expect(
      isErrorWithCode({ code: 'some code', message: 'some message' }),
    ).toBe(true);
  });

  it('returns false if given null', () => {
    expect(isErrorWithCode(null)).toBe(false);
  });

  it('returns false if given undefined', () => {
    expect(isErrorWithCode(undefined)).toBe(false);
  });

  it('returns false if given something that is not typeof object', () => {
    expect(isErrorWithCode(12345)).toBe(false);
  });

  it('returns false if given an empty object', () => {
    expect(isErrorWithCode({})).toBe(false);
  });

  it('returns false if given a non-empty object that does not have a "code" property', () => {
    expect(isErrorWithCode({ message: 'some message' })).toBe(false);
  });
});

describe('isErrorWithMessage', () => {
  it('returns true if given an object that includes a "message" property', () => {
    expect(
      isErrorWithMessage({ code: 'some code', message: 'some message' }),
    ).toBe(true);
  });

  it('returns false if given null', () => {
    expect(isErrorWithMessage(null)).toBe(false);
  });

  it('returns false if given undefined', () => {
    expect(isErrorWithMessage(undefined)).toBe(false);
  });

  it('returns false if given something that is not typeof object', () => {
    expect(isErrorWithMessage(12345)).toBe(false);
  });

  it('returns false if given an empty object', () => {
    expect(isErrorWithMessage({})).toBe(false);
  });

  it('returns false if given a non-empty object that does not have a "message" property', () => {
    expect(isErrorWithMessage({ code: 'some code' })).toBe(false);
  });
});

describe('isErrorWithStack', () => {
  it('returns true if given an object that includes a "stack" property', () => {
    expect(isErrorWithStack({ code: 'some code', stack: 'some stack' })).toBe(
      true,
    );
  });

  it('returns false if given null', () => {
    expect(isErrorWithStack(null)).toBe(false);
  });

  it('returns false if given undefined', () => {
    expect(isErrorWithStack(undefined)).toBe(false);
  });

  it('returns false if given something that is not typeof object', () => {
    expect(isErrorWithStack(12345)).toBe(false);
  });

  it('returns false if given an empty object', () => {
    expect(isErrorWithStack({})).toBe(false);
  });

  it('returns false if given a non-empty object that does not have a "stack" property', () => {
    expect(
      isErrorWithStack({ code: 'some code', message: 'some message' }),
    ).toBe(false);
  });
});

describe('wrapError', () => {
  describe('given an Error', () => {
    it('returns a new Error with the given message that links to the Error via "cause"', () => {
      const originalError = new Error('oops');
      const newError = wrapError(originalError, 'Some message');

      expect(newError.message).toBe('Some message');
      expect(newError.cause).toBe(originalError);
    });

    it('copies over any "code" property that exists on the given Error', () => {
      const originalError = new Error('oops');
      // @ts-expect-error The Error interface doesn't have a "code" property
      originalError.code = 'CODE';
      const newError = wrapError(originalError, 'Some message');

      expect(newError.code).toBe('CODE');
    });
  });

  describe('given an Error generated by fs.promises', () => {
    it('returns a new Error with the given message that links to the Error via "cause"', async () => {
      let originalError;
      try {
        await fs.promises.readFile('/tmp/nonexistent', 'utf8');
      } catch (error: any) {
        originalError = error;
      }
      const newError = wrapError(originalError, 'Some message');

      expect(newError.message).toBe('Some message');
      expect(newError.cause).toBe(originalError);
    });

    it('copies over any "code" property that exists on the given Error', async () => {
      let originalError;
      try {
        await fs.promises.readFile('/tmp/nonexistent', 'utf8');
      } catch (error: any) {
        originalError = error;
      }
      const newError = wrapError(originalError, 'Some message');

      expect(newError.code).toBe('ENOENT');
    });
  });

  describe('given a string', () => {
    it("treats it as a prefix for the new Error's message", () => {
      const newError = wrapError('Some original message', 'Some message');

      expect(newError.message).toBe('Some message: Some original message');
    });

    it('does not set a cause on the new Error', () => {
      const newError = wrapError('Some original message', 'Some message');

      expect(newError.cause).toBeUndefined();
    });
  });
});

describe('getErrorMessage', () => {
  it("returns the value of the 'message' property from the given object if it is present", () => {
    expect(getErrorMessage({ message: 'hello' })).toBe('hello');
  });

  it("returns the result of calling .toString() on the given object if it has no 'message' property", () => {
    expect(getErrorMessage({ foo: 'bar' })).toBe('[object Object]');
  });

  it('returns the result of calling .toString() on the given non-object', () => {
    expect(getErrorMessage(42)).toBe('42');
  });

  it('returns an empty string if given null', () => {
    expect(getErrorMessage(null)).toBe('');
  });

  it('returns an empty string if given undefined', () => {
    expect(getErrorMessage(undefined)).toBe('');
  });
});
