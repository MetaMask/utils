import { expectAssignable, expectNotAssignable } from 'tsd';

import type { SemVerRange, SemVerVersion } from '.';
import { assertIsSemVerRange, assertIsSemVerVersion } from '.';

// A value produced via a type's own assertion function is assignable to
// itself:

const unsafeVersion = '1.0.0';
assertIsSemVerVersion(unsafeVersion);
expectAssignable<SemVerVersion>(unsafeVersion);

const unsafeRange = '^1.0.0';
assertIsSemVerRange(unsafeRange);
expectAssignable<SemVerRange>(unsafeRange);

// SemVerVersion and SemVerRange are distinct opaque types, and are not
// mutually assignable, even though both are strings at runtime:

expectNotAssignable<SemVerRange>(unsafeVersion);
expectNotAssignable<SemVerVersion>(unsafeRange);

// A plain string is not assignable to either opaque type without going
// through the type's own validation/assertion function:

expectNotAssignable<SemVerVersion>('1.0.0');
expectNotAssignable<SemVerRange>('^1.0.0');
