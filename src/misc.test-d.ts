import { expectTypeOf } from 'vitest';

import type { PublicInterface, RuntimeObject } from './misc';
import { isObject, hasProperty, getKnownPropertyNames } from './misc';

//=============================================================================
// PublicInterface
//=============================================================================

class ClassWithPrivateProperties {
  #foo: string;

  bar: string;

  constructor({ foo, bar }: { foo: string; bar: string }) {
    this.#foo = foo;
    this.bar = bar;
  }
}

// Private properties not required
expectTypeOf({ bar: 'bar' }).toMatchTypeOf<
  PublicInterface<ClassWithPrivateProperties>
>();
// Public properties still required
expectTypeOf({}).not.toMatchTypeOf<
  PublicInterface<ClassWithPrivateProperties>
>();

//=============================================================================
// isObject
//=============================================================================

// eslint-disable-next-line @typescript-eslint/ban-types
const unknownValue = {} as unknown;

expectTypeOf(unknownValue).not.toMatchTypeOf<RuntimeObject>();

if (isObject(unknownValue)) {
  expectTypeOf(unknownValue).toMatchTypeOf<RuntimeObject>();
}

// Does not interfere with satisfaction of static type
const constObjectType = { foo: 'foo' } as const;
if (hasProperty(constObjectType, 'foo')) {
  expectTypeOf(constObjectType).toMatchTypeOf<{ foo: 'foo' }>();
}

//=============================================================================
// hasProperty
//=============================================================================

// eslint-disable-next-line @typescript-eslint/ban-types
const unknownObject = {} as Object;

// Establish that `Object` is not accepted when a specific property is needed.
expectTypeOf(unknownObject).not.toMatchTypeOf<Record<'foo', unknown>>();

// Establish that `RuntimeObject` is not accepted when a specific property is needed.
if (isObject(unknownObject)) {
  expectTypeOf(unknownObject).not.toMatchTypeOf<Record<'foo', unknown>>();
}

// An object is accepted after `hasProperty` is used to prove that it has the required property.
if (isObject(unknownObject) && hasProperty(unknownObject, 'foo')) {
  expectTypeOf(unknownObject).toMatchTypeOf<Record<'foo', unknown>>();
}

// An object is accepted after `hasProperty` is used to prove that it has all required properties.
if (
  isObject(unknownObject) &&
  hasProperty(unknownObject, 'foo') &&
  hasProperty(unknownObject, 'bar')
) {
  expectTypeOf(unknownObject).toMatchTypeOf<Record<'foo' | 'bar', unknown>>();
}

// An object is not accepted after `hasProperty` has only been used to establish that some required properties exist.
if (isObject(unknownObject) && hasProperty(unknownObject, 'foo')) {
  expectTypeOf(unknownObject).not.toMatchTypeOf<
    Record<'foo' | 'bar', unknown>
  >();
}

// Does not interfere with satisfaction of non-overlapping types
const overlappingTypesExample = { foo: 'foo', baz: 'baz' };
if (hasProperty(overlappingTypesExample, 'foo')) {
  expectTypeOf(overlappingTypesExample).toMatchTypeOf<
    Record<'baz', unknown>
  >();
}

const exampleErrorWithCode = new Error('test');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
exampleErrorWithCode.code = 999;

// Establish that trying to check for a custom property on an error results in failure
expectTypeOf(exampleErrorWithCode).not.toMatchTypeOf<{ code: any }>();

// Using custom Error property is allowed after checking with `hasProperty`
if (hasProperty(exampleErrorWithCode, 'code')) {
  expectTypeOf(exampleErrorWithCode.code).toEqualTypeOf<unknown>();
}

// `hasProperty` is compatible with interfaces
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface HasPropertyInterfaceExample {
  a: number;
}
const hasPropertyInterfaceExample: HasPropertyInterfaceExample = { a: 0 };
hasProperty(hasPropertyInterfaceExample, 'a');

// `hasProperty` is compatible with classes
class HasPropertyClassExample {
  a!: number;
}
const hasPropertyClassExample = new HasPropertyClassExample();
hasProperty(hasPropertyClassExample, 'a');

type HasPropertyTypeExample = {
  a?: number;
};

// It keeps the original type when defined.
const hasPropertyTypeExample: HasPropertyTypeExample = {};
if (hasProperty(hasPropertyTypeExample, 'a')) {
  expectTypeOf(hasPropertyTypeExample.a).toEqualTypeOf<number | undefined>();
}

//=============================================================================
// getKnownPropertyNames
//=============================================================================

enum GetKnownPropertyNamesEnumExample {
  Foo = 'bar',
  Baz = 'qux',
}

expectTypeOf(
  getKnownPropertyNames(GetKnownPropertyNamesEnumExample),
).toEqualTypeOf<('Foo' | 'Baz')[]>();

//=============================================================================
// RuntimeObject
//=============================================================================

// Valid runtime objects:

expectTypeOf({}).toMatchTypeOf<RuntimeObject>();

expectTypeOf({ foo: 'foo' }).toMatchTypeOf<RuntimeObject>();

// eslint-disable-next-line @typescript-eslint/naming-convention
expectTypeOf({ 0: 'foo' }).toMatchTypeOf<RuntimeObject>();

expectTypeOf({ [Symbol('foo')]: 'foo' }).toMatchTypeOf<RuntimeObject>();

// Invalid runtime objects:

expectTypeOf(null).not.toMatchTypeOf<RuntimeObject>();

expectTypeOf(undefined).not.toMatchTypeOf<RuntimeObject>();

expectTypeOf('foo').not.toMatchTypeOf<RuntimeObject>();

expectTypeOf(0).not.toMatchTypeOf<RuntimeObject>();

expectTypeOf([]).not.toMatchTypeOf<RuntimeObject>();

expectTypeOf(new Date()).not.toMatchTypeOf<RuntimeObject>();

expectTypeOf(() => 0).not.toMatchTypeOf<RuntimeObject>();

expectTypeOf(new Set()).not.toMatchTypeOf<RuntimeObject>();

expectTypeOf(new Map()).not.toMatchTypeOf<RuntimeObject>();

expectTypeOf(Symbol('test')).not.toMatchTypeOf<RuntimeObject>();

// The RuntimeObject type gets confused by interfaces. This interface is a valid object,
// but it's incompatible with the RuntimeObject type.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface RuntimeObjectInterfaceExample {
  a: number;
}
const runtimeObjectInterfaceExample: RuntimeObjectInterfaceExample = { a: 0 };
expectTypeOf(runtimeObjectInterfaceExample).not.toMatchTypeOf<RuntimeObject>();

class RuntimeObjectClassExample {
  a!: number;
}
const runtimeObjectClassExample = new RuntimeObjectClassExample();
expectTypeOf(runtimeObjectClassExample).not.toMatchTypeOf<RuntimeObject>();
