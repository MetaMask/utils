/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { Infer } from '@metamask/superstruct';
import { boolean, number, optional, string } from '@metamask/superstruct';
import { expectTypeOf } from 'vitest';

import type { Json } from '.';
import { exactOptional, object } from '.';

// Valid Json:

expectTypeOf(null).toMatchTypeOf<Json>();

expectTypeOf(false).toMatchTypeOf<Json>();

expectTypeOf('').toMatchTypeOf<Json>();

expectTypeOf(0).toMatchTypeOf<Json>();

expectTypeOf([]).toMatchTypeOf<Json>();

expectTypeOf({}).toMatchTypeOf<Json>();

expectTypeOf([0]).toMatchTypeOf<Json>();

expectTypeOf({ a: 0 }).toMatchTypeOf<Json>();

expectTypeOf({ deeply: [{ nested: 1 }, 'mixed', 'types', 0] }).toMatchTypeOf<Json>();

expectTypeOf([
  'array',
  { nested: { mixed: true, types: null } },
  0,
]).toMatchTypeOf<Json>();

type JsonCompatibleType = {
  c: number;
};
const jsonCompatibleType: JsonCompatibleType = { c: 0 };
expectTypeOf(jsonCompatibleType).toMatchTypeOf<Json>();

// Invalid Json:

expectTypeOf(undefined).not.toMatchTypeOf<Json>();

expectTypeOf(new Date()).not.toMatchTypeOf<Json>();

expectTypeOf(() => 0).not.toMatchTypeOf<Json>();

expectTypeOf(new Set()).not.toMatchTypeOf<Json>();

expectTypeOf(new Map()).not.toMatchTypeOf<Json>();

expectTypeOf(Symbol('test')).not.toMatchTypeOf<Json>();

expectTypeOf({ a: new Date() }).not.toMatchTypeOf<Json>();

expectTypeOf(5 as number | undefined).not.toMatchTypeOf<Json>();

interface InterfaceWithOptionalProperty {
  a?: number;
}
const interfaceWithOptionalProperty: InterfaceWithOptionalProperty = { a: 0 };
expectTypeOf(interfaceWithOptionalProperty).not.toMatchTypeOf<Json>();

interface InterfaceWithDate {
  a: Date;
}
const interfaceWithDate: InterfaceWithDate = { a: new Date() };
expectTypeOf(interfaceWithDate).not.toMatchTypeOf<Json>();

interface InterfaceWithOptionalDate {
  a?: Date;
}
const interfaceWithOptionalDate: InterfaceWithOptionalDate = { a: new Date() };
expectTypeOf(interfaceWithOptionalDate).not.toMatchTypeOf<Json>();

interface InterfaceWithUndefinedTypeUnion {
  a: number | undefined;
}
const interfaceWithUndefinedTypeUnion: InterfaceWithUndefinedTypeUnion = {
  a: 0,
};
expectTypeOf(interfaceWithUndefinedTypeUnion).not.toMatchTypeOf<Json>();

interface InterfaceWithFunction {
  a: () => number;
}
const interfaceWithFunction: InterfaceWithFunction = { a: () => 0 };
expectTypeOf(interfaceWithFunction).not.toMatchTypeOf<Json>();

type TypeWithDate = {
  a: Date;
};
const typeWithDate: TypeWithDate = { a: new Date() };
expectTypeOf(typeWithDate).not.toMatchTypeOf<Json>();

type TypeWithOptionalDate = {
  a?: Date;
};
const typeWithOptionalDate: TypeWithOptionalDate = { a: new Date() };
expectTypeOf(typeWithOptionalDate).not.toMatchTypeOf<Json>();

type TypeWithUndefinedTypeUnion = {
  a: number | undefined;
};
const typeWithUndefinedTypeUnion: TypeWithUndefinedTypeUnion = {
  a: 0,
};
expectTypeOf(typeWithUndefinedTypeUnion).not.toMatchTypeOf<Json>();

type TypeWithFunction = {
  a: () => number;
};
const typeWithFunction: TypeWithFunction = { a: () => 0 };
expectTypeOf(typeWithFunction).not.toMatchTypeOf<Json>();

type TypeWithOptionalProperty = {
  a?: number | undefined;
};
const typeWithOptionalProperty: TypeWithOptionalProperty = { a: undefined };
expectTypeOf(typeWithOptionalProperty).not.toMatchTypeOf<Json>();

// Edge cases:

// The Json type doesn't protect against the `any` type.
expectTypeOf(null as any).toMatchTypeOf<Json>();

// The Json type gets confused by interfaces. This interface is valid Json,
// but it's incompatible with the Json type.
interface A {
  a: number;
}
const a: A = { a: 0 };
expectTypeOf(a).not.toMatchTypeOf<Json>();

// The Json type gets confused by classes. This class instance is valid Json,
// but it's incompatible with the Json type.
class Foo {
  a!: number;
}
const foo = new Foo();
expectTypeOf(foo).not.toMatchTypeOf<Json>();

// Object using `exactOptional`:

const exactOptionalObject = object({
  a: number(),
  b: optional(string()),
  c: exactOptional(boolean()),
});

type ExactOptionalObject = Infer<typeof exactOptionalObject>;

expectTypeOf({ a: 0 }).toMatchTypeOf<ExactOptionalObject>();
expectTypeOf({ a: 0, b: 'test' }).toMatchTypeOf<ExactOptionalObject>();
expectTypeOf({ a: 0, b: 'test', c: true }).toMatchTypeOf<ExactOptionalObject>();
expectTypeOf({ a: 0, b: 'test', c: 0 }).not.toMatchTypeOf<ExactOptionalObject>();
expectTypeOf({
  a: 0,
  b: 'test',
  c: undefined,
}).not.toMatchTypeOf<ExactOptionalObject>();
