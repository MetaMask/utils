import type { Infer } from 'superstruct';
import { boolean, number, optional, string } from 'superstruct';
import { expectAssignable, expectNotAssignable } from 'tsd';

import { exactOptional, object } from '.';

const exactOptionalObject = object({
  a: number(),
  b: optional(string()),
  c: exactOptional(boolean()),
});

type ExactOptionalObject = Infer<typeof exactOptionalObject>;

expectAssignable<ExactOptionalObject>({ a: 0 });
expectAssignable<ExactOptionalObject>({ a: 0, b: 'test' });
expectAssignable<ExactOptionalObject>({ a: 0, b: 'test', c: true });
expectAssignable<ExactOptionalObject>({ a: 0, b: undefined });
expectNotAssignable<ExactOptionalObject>({ a: 0, b: 'test', c: 0 });
expectNotAssignable<ExactOptionalObject>({ a: 0, b: 'test', c: undefined });
