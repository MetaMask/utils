import { parseDateTime } from './iso8601-date';

describe('parseDateTime', () => {
  it.each([
    ['2020', new Date(2020, 0)],
    ['2021-02', new Date(2021, 1)],
    ['2022-10', new Date(2022, 9)],
    ['2023-11-02', new Date(2023, 10, 1)],
  ])('parses %s local-time correctly', (testIso, expectedDate) => {
    const result = parseDateTime(testIso);

    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toStrictEqual(expectedDate.toISOString());
  });
});
