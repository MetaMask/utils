import { TZDate } from '@date-fns/tz';

import { assert } from './assert';

enum ParseDateState {
  Year = 1,
  Month = 2,
  CalendarDate = 3,
  Hour = 4,
  Minute = 5,
  Second = 6,
  Timezone = 7,
  TimezoneHour = 8,
  TimezoneMinute = 9,
  End = 0,
}
const END = Symbol('END');

const RE_YEAR = /[0-9]{4}/u;
const RE_MONTH = /(?:0[1-9])|(?:1[0-2])/u;
const RE_DATE = /(?:[1-9])|(?:[1-2][0-9])|(?:3[0-1])/u;
const RE_HOUR = /(?:[0-1][0-9])|(?:2[0-3])/u;
const RE_MINUTE_SECOND = /[0-5][0-9]/u;
const RE_Z_HOUR = /(?:0[0-9])|(?:1[0-2])/u;

export const InvalidIso8601Date = new Error('Invalid ISO-8601 date');

/**
 * Parses ISO-8601 date time string.
 *
 * @throws {InvalidIso8601Date} Is the input value is not correct.
 * @param value - An ISO-8601 formatted string.
 * @returns A date if value is in local-time, a TZDate if timezone data provided.
 */
export function parseIso8601DateTime(value: string): Date | TZDate {
  let at = 0;
  let hasSeparators: boolean | null = null;
  let state: ParseDateState = ParseDateState.Year;

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
    assert(at + count <= value.length, 'Invalid ISO-8601 parser state');
    at += count;
  };
  const consumeSeparator = (sep: '-' | ':') => {
    const next = peek();
    assert(next !== END, 'Invalid ISO-8601 parser state');
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

  let year: undefined | string;
  let month: undefined | string;
  let date: undefined | string;
  let hours: undefined | string;
  let minutes: undefined | string;
  let seconds: undefined | string;
  let timezone: null | string = null; // null, "Z", "+", "-"
  let offsetHours: undefined | string;
  let offsetMinutes: undefined | string;

  while (state !== ParseDateState.End) {
    switch (state) {
      case ParseDateState.Year:
        year = '';
        for (let i = 0; i < 4; i++) {
          year += consume();
        }
        if (!RE_YEAR.test(year)) {
          throw InvalidIso8601Date;
        }
        if (peek() === END) {
          state = ParseDateState.End;
        } else {
          consumeSeparator('-');
          state = ParseDateState.Month;
        }
        break;
      case ParseDateState.Month:
        month = consume() + consume();
        if (!RE_MONTH.test(month)) {
          throw InvalidIso8601Date;
        }

        // YYYYMM is not a valid ISO-8601
        // it requires a separator: YYYY-MM
        if (hasSeparators === false && (peek() === END || peek() === 'T')) {
          throw InvalidIso8601Date;
        } else if (peek() === END) {
          state = ParseDateState.End;
        } else if (peek() === 'T') {
          state = ParseDateState.Hour;
        } else {
          consumeSeparator('-');
          state = ParseDateState.CalendarDate;
        }
        break;
      case ParseDateState.CalendarDate:
        date = consume() + consume();
        if (!RE_DATE.test(date)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.End;
        } else {
          state = ParseDateState.Hour;
        }
        break;
      case ParseDateState.Hour:
        if (consume() !== 'T') {
          throw InvalidIso8601Date;
        }

        hours = consume() + consume();
        if (!RE_HOUR.test(hours)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.End;
        } else if (['Z', '-', '+'].includes(peek() as string)) {
          state = ParseDateState.Timezone;
        } else {
          consumeSeparator(':');
          state = ParseDateState.Minute;
        }
        break;
      case ParseDateState.Minute:
        minutes = consume() + consume();
        if (!RE_MINUTE_SECOND.test(minutes)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.End;
        } else if (['Z', '-', '+'].includes(peek() as string)) {
          state = ParseDateState.Timezone;
        } else {
          consumeSeparator(':');
          state = ParseDateState.Second;
        }
        break;
      case ParseDateState.Second:
        seconds = consume() + consume();
        if (!RE_MINUTE_SECOND.test(seconds)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.End;
        } else {
          state = ParseDateState.Timezone;
        }
        break;
      case ParseDateState.Timezone:
        timezone = consume();

        if (timezone === 'Z') {
          if (peek() !== END) {
            throw InvalidIso8601Date;
          }
          state = ParseDateState.End;
        } else if (['-', '+'].includes(timezone)) {
          state = ParseDateState.TimezoneHour;
        } else {
          throw InvalidIso8601Date;
        }
        break;
      case ParseDateState.TimezoneHour:
        offsetHours = consume() + consume();
        if (!RE_Z_HOUR.test(offsetHours)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.End;
        } else {
          consumeSeparator(':');
          state = ParseDateState.TimezoneMinute;
        }
        break;
      case ParseDateState.TimezoneMinute:
        offsetMinutes = consume() + consume();
        if (!RE_MINUTE_SECOND.test(offsetMinutes)) {
          throw InvalidIso8601Date;
        }

        if (peek() === END) {
          state = ParseDateState.End;
        } else {
          // Garbage at the end
          throw InvalidIso8601Date;
        }
        break;
      /* istanbul ignore next */
      default:
        assert(false, 'Invalid ISO-8601 parser state');
    }
  }

  assert(year !== undefined, 'Invalid ISO-8601 parser state');
  month = month ?? '01';
  date = date ?? '01';
  hours = hours ?? '00';
  minutes = minutes ?? '00';
  seconds = seconds ?? '00';
  offsetHours = offsetHours ?? '00';
  offsetMinutes = offsetMinutes ?? '00';

  if (timezone !== null) {
    if (timezone === 'Z') {
      timezone = '+';
    }
    return new TZDate(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(date, 10),
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10),
      `${timezone}${offsetHours}:${offsetMinutes}`,
    );
  }
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(date, 10),
    parseInt(hours, 10),
    parseInt(minutes, 10),
    parseInt(seconds, 10),
  );
}
