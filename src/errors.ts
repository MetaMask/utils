import { ErrorWithCause } from 'pony-cause';

import { isObject } from './misc';

/**
 * Type guard for determining whether the given value is an instance of Error.
 * For errors generated via `fs.promises`, `error instanceof Error` won't work,
 * so we have to come up with another way of testing.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isError(error: unknown): error is Error {
  return (
    error instanceof Error ||
    (isObject(error) && error.constructor.name === 'Error')
  );
}

/**
 * Type guard for determining whether the given value is an error object with a
 * `code` property such as the type of error that Node throws for filesystem
 * operations, etc.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
export function isErrorWithCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

/**
 * Type guard for determining whether the given value is an error object with a
 * `message` property, such as an instance of Error.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

/**
 * Type guard for determining whether the given value is an error object with a
 * `stack` property, such as an instance of Error.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
export function isErrorWithStack(error: unknown): error is { stack: string } {
  return typeof error === 'object' && error !== null && 'stack' in error;
}

/**
 * Builds a new error object, linking it to the original error via the `cause`
 * property if it is an Error.
 *
 * This function is useful to reframe error messages in general, but is
 * _critical_ when interacting with any of Node's filesystem functions as
 * provided via `fs.promises`, because these do not produce stack traces in the
 * case of an I/O error (see <https://github.com/nodejs/node/issues/30944>).
 *
 * @param originalError - The error to be wrapped (something throwable).
 * @param message - The desired message of the new error.
 * @returns A new error object.
 */
export function wrapError<Throwable>(
  originalError: Throwable,
  message: string,
): Error & { code?: string } {
  if (isError(originalError)) {
    // @ts-expect-error This is okay
    const error: Error & { code: string } =
      'cause' in Error.prototype
        ? // This is getting tested using different Node versions
          // istanbul ignore next
          new Error(message, {
            cause: originalError,
          })
        : new ErrorWithCause(message, { cause: originalError });

    if (isErrorWithCode(originalError)) {
      error.code = originalError.code;
    }

    return error;
  }

  return new Error(`${message}: ${String(originalError)}`);
}
