/* eslint-disable @typescript-eslint/naming-convention */
import {
  type Infer,
  type Context,
  Struct,
  object as stObject,
} from 'superstruct';
import type {
  ObjectSchema,
  OmitBy,
  Optionalize,
  PickBy,
  Simplify,
} from 'superstruct/dist/utils';

import { hasProperty } from './misc';

declare const ExactOptionalSymbol: unique symbol;

export type ExactOptionalTag = typeof ExactOptionalSymbol;

/**
 * Exclude a type from the properties of a type.
 */
export type ExcludeType<T, V> = {
  [K in keyof T]: Exclude<T[K], V>;
};

/**
 * Make the properties of a type optional iff `exactOptionalPropertyTypes` is
 * enabled, otherwise it's a no-op.
 */
export type ExactPartial<T> = undefined extends ({ a?: boolean } & {
  a?: boolean | undefined;
})['a']
  ? T // Exact optional is disabled.
  : { [P in keyof T]?: T[P] }; // Exact optional is enabled.

/**
 * Make optional all properties tagged as optional.
 */
export type ExactOptionalize<S extends object> = OmitBy<S, ExactOptionalTag> &
  ExactPartial<ExcludeType<PickBy<S, ExactOptionalTag>, ExactOptionalTag>>;

/**
 * Infer a type from an object struct schema.
 */
export type ObjectType<S extends ObjectSchema> = Simplify<
  ExactOptionalize<Optionalize<{ [K in keyof S]: Infer<S[K]> }>>
>;

/**
 * Change the return type of a superstruct object struct to support exact
 * optional properties.
 *
 * @param schema - The object schema.
 * @returns A struct representing an object with a known set of properties.
 */
export function object<S extends ObjectSchema>(
  schema: S,
): Struct<ObjectType<S>> {
  return stObject(schema) as any;
}

/**
 * Check the last field of a path is present.
 *
 * @param ctx - The context to check.
 * @returns Whether the last field of a path is present.
 */
function hasOptional(ctx: Context): boolean {
  const field = ctx.path[ctx.path.length - 1];
  return hasProperty(ctx.branch[ctx.branch.length - 2], field);
}

/**
 * Augment a struct to allow _exact_ optional values if the
 * `exactOptionalPropertyTypes` option is set, otherwise it is a no-op.
 *
 * @param struct - The struct to augment.
 * @returns The augmented struct.
 */
export function exactOptional<T, S>(
  struct: Struct<T, S>,
): Struct<T | ExactOptionalTag, S> {
  return new Struct({
    ...struct,

    validator: (value, ctx) =>
      !hasOptional(ctx) || struct.validator(value, ctx),

    refiner: (value, ctx) =>
      !hasOptional(ctx) || struct.refiner(value as T, ctx),
  });
}
