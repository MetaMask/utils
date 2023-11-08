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
  describe('if the original error is an Error instance not generated by fs.promises', () => {
    it('returns a new Error with the given message', () => {
      const originalError = new Error('oops');

      const newError = wrapError(originalError, 'Some message');

      expect(newError.message).toBe('Some message');
    });

    it('links to the original error via "cause"', () => {
      const originalError = new Error('oops');

      const newError = wrapError(originalError, 'Some message');

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

  describe('if the original error was generated by fs.promises', () => {
    it('returns a new Error with the given message', async () => {
      let originalError;
      try {
        await fs.promises.readFile('/tmp/nonexistent', 'utf8');
      } catch (error: any) {
        originalError = error;
      }

      const newError = wrapError(originalError, 'Some message');

      expect(newError.message).toBe('Some message');
    });

    it("links to the original error via 'cause'", async () => {
      let originalError;
      try {
        await fs.promises.readFile('/tmp/nonexistent', 'utf8');
      } catch (error: any) {
        originalError = error;
      }

      const newError = wrapError(originalError, 'Some message');

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

  describe('if the original error has a length === 2', () => {
    it('returns an error with cause', () => {
      // Save original Error
      const OriginalError = global.Error;

      // Create a mock error with a cause
      class MockError extends Error {
        constructor(message: string, options: { cause?: Error } = {}) {
          super(message);
          this.cause = options.cause;
        }

        cause: Error | undefined;
      }
      // Set length to 2
      Object.defineProperty(MockError, 'length', { value: 2 });

      // Replace global Error with MockError
      global.Error = MockError as unknown as ErrorConstructor;

      // Define your original error and message
      const originalError = new Error('original error');
      const message = 'new error message';

      // Call your function
      const result = wrapError(originalError, message);

      // Assert that the error has the expected properties
      expect(result.message).toBe(message);
      expect(result.cause).toBe(originalError);

      // Restore the original Error constructor
      global.Error = OriginalError;
    });
  });

  describe('if the original error is an object but not an Error instance', () => {
    describe('if the message is a non-empty string', () => {
      it('combines a string version of the original error and message together in a new Error', () => {
        const originalError = { some: 'error' };

        const newError = wrapError(originalError, 'Some message');

        expect(newError.message).toBe('[object Object]: Some message');
      });

      it('does not set a cause on the new Error', async () => {
        const originalError = { some: 'error' };

        const newError = wrapError(originalError, 'Some message');

        expect(newError.cause).toBeUndefined();
      });

      it('does not set a code on the new Error', async () => {
        const originalError = { some: 'error' };

        const newError = wrapError(originalError, 'Some message');

        expect(newError.code).toBeUndefined();
      });
    });

    describe('if the message is an empty string', () => {
      it('places a string version of the original error in a new Error object without an additional message', () => {
        const originalError = { some: 'error' };

        const newError = wrapError(originalError, '');

        expect(newError.message).toBe('[object Object]');
      });

      it('does not set a cause on the new Error', async () => {
        const originalError = { some: 'error' };

        const newError = wrapError(originalError, '');

        expect(newError.cause).toBeUndefined();
      });

      it('does not set a code on the new Error', async () => {
        const originalError = { some: 'error' };

        const newError = wrapError(originalError, '');

        expect(newError.code).toBeUndefined();
      });
    });
  });

  describe('if the original error is a string', () => {
    describe('if the message is a non-empty string', () => {
      it('combines the original error and message together in a new Error', () => {
        const newError = wrapError('Some original message', 'Some message');

        expect(newError.message).toBe('Some original message: Some message');
      });

      it('does not set a cause on the new Error', () => {
        const newError = wrapError('Some original message', 'Some message');

        expect(newError.cause).toBeUndefined();
      });

      it('does not set a code on the new Error', () => {
        const newError = wrapError('Some original message', 'Some message');

        expect(newError.code).toBeUndefined();
      });
    });

    describe('if the message is an empty string', () => {
      it('places the original error in a new Error object without an additional message', () => {
        const newError = wrapError('Some original message', '');

        expect(newError.message).toBe('Some original message');
      });

      it('does not set a cause on the new Error', () => {
        const newError = wrapError('Some original message', '');

        expect(newError.cause).toBeUndefined();
      });

      it('does not set a code on the new Error', () => {
        const newError = wrapError('Some original message', '');

        expect(newError.code).toBeUndefined();
      });
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
