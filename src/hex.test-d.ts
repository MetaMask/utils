import { expectTypeOf } from 'vitest';

import type { Hex } from '.';

// Valid hex strings:

expectTypeOf<'0x'>().toMatchTypeOf<Hex>();

expectTypeOf<'0x0'>().toMatchTypeOf<Hex>();

expectTypeOf<'0x😀'>().toMatchTypeOf<Hex>();

const embeddedString = 'test' as const;
expectTypeOf<`0x${typeof embeddedString}`>().toMatchTypeOf<Hex>();

// Not valid hex strings:

expectTypeOf<`0X${typeof embeddedString}`>().not.toMatchTypeOf<Hex>();

expectTypeOf<`1x${typeof embeddedString}`>().not.toMatchTypeOf<Hex>();

expectTypeOf<number>().not.toMatchTypeOf<Hex>();

expectTypeOf<'0'>().not.toMatchTypeOf<Hex>();

expectTypeOf<'🙃'>().not.toMatchTypeOf<Hex>();
