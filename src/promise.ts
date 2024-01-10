/**
 * A deferred Promise.
 *
 * A deferred Promise is one that can be resolved or rejected independently of
 * the Promise construction.
 */
export type DeferredPromise = {
  /**
   * The Promise that has been deferred.
   */
  promise: Promise<void>;
  /**
   * A function that resolves the Promise.
   */
  resolve: () => void;
  /**
   * A function that rejects the Promise.
   */
  reject: (error: unknown) => void;
};

/**
 * Create a defered Promise.
 *
 * @param args - The arguments.
 * @param args.suppressUnhandledRejection - This option adds an empty error handler
 * to the Promise to suppress the UnhandledPromiseRejection error. This can be
 * useful if the deferred Promise is sometimes intentionally not used.
 * @returns A deferred Promise.
 */
export function createDeferredPromise({
  suppressUnhandledRejection = false,
}: {
  suppressUnhandledRejection?: boolean;
} = {}): DeferredPromise {
  let resolve: DeferredPromise['resolve'];
  let reject: DeferredPromise['reject'];
  const promise = new Promise<void>(
    (innerResolve: () => void, innerReject: () => void) => {
      resolve = innerResolve;
      reject = innerReject;
    },
  );

  if (suppressUnhandledRejection) {
    promise.catch((_error) => {
      // This handler is used to suppress the UnhandledPromiseRejection error
    });
  }

  // @ts-expect-error We know that these are assigned, but TypeScript doesn't
  return { promise, resolve, reject };
}
