import { TZDate } from '@date-fns/tz';

import { assert } from './assert';

enum ParseDateState {
  YEAR = 1,
  MONTH = 2,
  DATE = 3,
  HOUR = 4,
  MINUTE = 5,
  SECOND = 6,
  Z = 7,
  ZHOUR = 8,
  ZMINUTE = 9,
  END = 0,
}
const END = Symbol('END');

const RE_YEAR = /[0-9]{4}/u;
const RE_MONTH = /(?:0[1-9])|(?:1[0-2])/u;
const RE_DATE = /(?:[1-9])|(?:[1-2][0-9])|(?:3[0-1])/u;
const RE_HOUR = /(?:[0-1][0-9])|(?:2[0-3])/u;
const RE_MINUTE_SECOND = /[0-5][0-9]/u;

export const InvalidIso8601Date = new Error('Invalid ISO-8601 date');

/**
 * Parses ISO-8601 date time string.
 *
 * @throws {InvalidIso8601Date} Is the input value is not correct.
 * @param value - An ISO-8601 formatted string.
 * @returns A date if value is in local-time, a TZDate if timezone data provided.
 */
export function parseDateTime(value: string): Date | TZDate {
  let at = 0;
  let hasSeparators: boolean | null = null;
  let state: ParseDateState = ParseDateState.YEAR;

  const consume = () => {
    if (at >= value.length) {
      throw InvalidIso8601Date;
    }
    const char = value[at] as string;
    at += 1;
    return char;
  };
  const peek = () => {
    if (at >= value.length) {
      return END;
    }
    return value[at] as string;
  };
  const skip = (count = 1) => {
    if (at + count >= value.length) {
      throw InvalidIso8601Date;
    }
    at += count;
  };
  const consumeSeparator = (sep: '-' | ':') => {
    const next = peek();
    if (next === END) {
      throw InvalidIso8601Date;
    }
    if (next === '-' || next === ':') {
      if (hasSeparators === false || next !== sep) {
        throw InvalidIso8601Date;
      }
      hasSeparators = true;
      skip();
    } else {
      if (hasSeparators === true) {
        throw InvalidIso8601Date;
      }
      hasSeparators = false;
    }
  };

  /* eslint-disable id-length */
  let Y; // year
  let M; // month
  let D; // date
  let H; // hours
  let m; // minutes
  let S; // seconds
  let Z = null; // null, "Z", "+", "-"
  let OH; // offset hours
  let Om; // offset minutes
  /* eslint-enable id-length */

  while (state !== ParseDateState.END) {
    switch (state) {
      case ParseDateState.YEAR:
        Y = '';
        for (let i = 0; i < 4; i++) {
          Y += consume();
        }
        if (!RE_YEAR.test(Y)) {
          throw InvalidIso8601Date;
        }
        if (peek() === END) {
          state = ParseDateState.END;
        } else {
          consumeSeparator('-');
          state = ParseDateState.MONTH;
        }
        break;
      case ParseDateState.MONTH:
        M = consume() + consume();
        if (!RE_MONTH.test(M)) {
          throw InvalidIso8601Date;
        }

        // YYYYMM is not a valid ISO-8601
        // it requires a separator: YYYY-MM
        if (hasSeparators === false && (peek() === END || peek() === 'T')) {
          throw InvalidIso8601Date;
        } else if (peek() === END) {
          state = ParseDateState.END;
        } else if (peek() === 'T') {
          state = ParseDateState.HOUR;
        } else {
          consumeSeparator('-');
          state = ParseDateState.DATE;
        }
        break;
      case ParseDateState.DATE:
        D = consume() + consume();
        if (!RE_DATE.test(D)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.END;
        } else {
          state = ParseDateState.HOUR;
        }
        break;
      case ParseDateState.HOUR:
        if (consume() !== 'T') {
          throw InvalidIso8601Date;
        }

        H = consume() + consume();
        if (!RE_HOUR.test(H)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.END;
        } else if (['Z', '-', '+'].includes(peek() as string)) {
          state = ParseDateState.Z;
        } else {
          consumeSeparator(':');
          state = ParseDateState.MINUTE;
        }
        break;
      case ParseDateState.MINUTE:
        m = consume() + consume();
        if (!RE_MINUTE_SECOND.test(m)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.END;
        } else if (['Z', '-', '+'].includes(peek() as string)) {
          state = ParseDateState.Z;
        } else {
          consumeSeparator(':');
          state = ParseDateState.SECOND;
        }
        break;
      case ParseDateState.SECOND:
        S = consume() + consume();
        if (!RE_MINUTE_SECOND.test(S)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.END;
        } else {
          state = ParseDateState.Z;
        }
        break;
      case ParseDateState.Z:
        Z = consume();

        if (Z === 'Z') {
          state = ParseDateState.END;
        } else if (['-', '+'].includes(Z)) {
          state = ParseDateState.ZHOUR;
        } else {
          throw InvalidIso8601Date;
        }
        break;
      case ParseDateState.ZHOUR:
        OH = consume() + consume();
        if (!RE_MINUTE_SECOND.test(OH)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.END;
        } else {
          consumeSeparator(':');
          state = ParseDateState.ZMINUTE;
        }
        break;
      case ParseDateState.ZMINUTE:
        Om = consume() + consume();
        if (!RE_MINUTE_SECOND.test(Om)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.END;
        } else {
          // Garbage at the end
          throw InvalidIso8601Date;
        }
        break;
      default:
        assert('Invalid ISO-8601 parser state');
    }
  }

  assert(Y !== undefined);
  M = M ?? '01';
  D = D ?? '01';
  H = H ?? '00';
  m = m ?? '00';
  S = S ?? '00';
  OH = OH ?? '00';
  Om = Om ?? '00';

  if (Z !== null) {
    if (Z === 'Z') {
      Z = '+';
    }
    return new TZDate(
      parseInt(Y, 10),
      parseInt(M, 10),
      parseInt(D, 10),
      parseInt(H, 10),
      parseInt(m, 10),
      parseInt(S, 10),
      `${Z}${OH}:${Om}`,
    );
  }
  return new Date(
    parseInt(Y, 10),
    parseInt(M, 10),
    parseInt(D, 10),
    parseInt(H, 10),
    parseInt(m, 10),
    parseInt(S, 10),
  );
}
