import { TZDate } from '@date-fns/tz';
import assert from 'assert';

import { InvalidIso8601Date, parseDateTime } from './iso8601-date';

describe('parseDateTime', () => {
  it.each([
    ['2020', new Date(2020, 0)],
    ['2021-02', new Date(2021, 1)],
    ['2022-10', new Date(2022, 9)],
    ['2023-11-02', new Date(2023, 10, 2)],
    ['2024-12T01', new Date(2024, 11, 1, 1)],
    ['2025-01T02:01', new Date(2025, 0, 1, 2, 1)],
    ['2026-02-02T03', new Date(2026, 1, 2, 3)],
    ['2027-03-03T04:02', new Date(2027, 2, 3, 4, 2)],
    ['2027-03-03T04:02:01', new Date(2027, 2, 3, 4, 2, 1)],
    ['20280404', new Date(2028, 3, 4)],
    ['20290505T05', new Date(2029, 4, 5, 5)],
    ['20300606T0603', new Date(2030, 5, 6, 6, 3)],
    ['20310707T070402', new Date(2031, 6, 7, 7, 4, 2)],
  ])('parses %s local-time correctly', (testIso, expectedDate) => {
    const result = parseDateTime(testIso);

    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toStrictEqual(expectedDate.toISOString());
  });

  it.each([
    ['2023-04-04T04Z', new TZDate(2023, 3, 4, 4, '+00:00')],
    ['2023-04-04T04-01', new TZDate(2023, 3, 4, 4, '-01:00')],
    ['2023-04-04T04+02', new TZDate(2023, 3, 4, 4, '+02:00')],
    ['2023-04-04T04-01:01', new TZDate(2023, 3, 4, 4, '-01:01')],
    ['2023-04-04T04+02:02', new TZDate(2023, 3, 4, 4, '+02:02')],

    ['2023-04-04T04:04Z', new TZDate(2023, 3, 4, 4, 4, '+00:00')],
    ['2023-04-04T04:04-01', new TZDate(2023, 3, 4, 4, 4, '-01:00')],
    ['2023-04-04T04:04+02', new TZDate(2023, 3, 4, 4, 4, '+02:00')],
    ['2023-04-04T04:04-01:01', new TZDate(2023, 3, 4, 4, 4, '-01:01')],
    ['2023-04-04T04:04+02:02', new TZDate(2023, 3, 4, 4, 4, '+02:02')],

    ['2023-04-04T04:04:04Z', new TZDate(2023, 3, 4, 4, 4, 4, '+00:00')],
    ['2023-04-04T04:04:04-01', new TZDate(2023, 3, 4, 4, 4, 4, '-01:00')],
    ['2023-04-04T04:04:04+02', new TZDate(2023, 3, 4, 4, 4, 4, '+02:00')],
    ['2023-04-04T04:04:04-01:01', new TZDate(2023, 3, 4, 4, 4, 4, '-01:01')],
    ['2023-04-04T04:04:04+02:02', new TZDate(2023, 3, 4, 4, 4, 4, '+02:02')],
  ])('parses %s with time-zone correctly', (testIso, expectedDate) => {
    const result = parseDateTime(testIso);

    assert(result instanceof TZDate);
    expect(result.timeZone).toStrictEqual(expectedDate.timeZone);
    expect(result.toISOString()).toStrictEqual(expectedDate.toISOString());
  });

  it.each([
    '',
    '0',
    '00',
    '000',
    '0000a',
    '2020-0',
    '2020-00',
    '2020-01a',
    '202001',
    '2020-01-00',
    '2020-01-01a',
    '2020-0101',
    '202001-01',
    '2020-01-01T',
    '2020-01-01T0000',
    '2020-01-01T00:00a',
    '2020-01-01T00:0000',
    '00:00',
    '2020:01',
    '2020-01:01',
    '2020-01-01T00:00A',
    '2020-01-01T00:00Za',
    '2020-01-01T00:00+a',
    '2020-01-01T00:00-a',
    '2020-01-01T00:00+0',
    '2020-01-01T00:00-0',
    '2020-01-01T00:00+00a',
    '2020-01-01T00:00+00:0',
    '2020-01-01T00:00-00:0',
    '2020-01-01T00:00+00:00a',
    '2020-01-01T00:00-00:00a',
    '2020-',
    '2020-01-01T24',
    '2020-01-01T23:60',
    '2020-01-01T23:59:60',
    '2020-01-01T23:59:59-13',
    '2020-01-01T23:59:59+13',
    '2020-01-01T23:59:59-11:60',
    '2020-01-01T23:59:59a',
  ])('throws on invalid datetiime "%s"', (testIso) => {
    expect(() => parseDateTime(testIso)).toThrow(InvalidIso8601Date);
  });
});
