import {
  assertIsSemVerRange,
  assertIsSemVerVersion,
  isValidSemVerRange,
  isValidSemVerVersion,
} from './versions';

describe('assertIsSemVerVersion', () => {
  it('shows descriptive errors', () => {
    expect(() => assertIsSemVerVersion('>1.2')).toThrow(
      'Expected SemVer version, got',
    );
  });
});

describe('assertIsSemVerRange', () => {
  it('shows descriptive errors', () => {
    expect(() => assertIsSemVerRange('.')).toThrow(
      'Expected SemVer range, got',
    );
  });
});

describe('isValidSemVerVersion', () => {
  it.each([
    'asd',
    '()()',
    '..',
    '.',
    '.1',
    null,
    undefined,
    2,
    true,
    {},
    Error,
  ])('rejects invalid version', (version) => {
    expect(isValidSemVerVersion(version)).toBe(false);
  });

  it('supports normal version ranges', () => {
    expect(isValidSemVerVersion('1.5.0')).toBe(true);
  });

  it('supports pre-release versions', () => {
    expect(isValidSemVerVersion('1.0.0-beta.1')).toBe(true);
  });
});

describe('isValidSemVerRange', () => {
  it('supports *', () => {
    expect(isValidSemVerRange('*')).toBe(true);
  });

  it('supports normal version ranges', () => {
    expect(isValidSemVerRange('^1.2.3')).toBe(true);
    expect(isValidSemVerRange('1.5.0')).toBe(true);
  });

  it('supports pre-release versions', () => {
    expect(isValidSemVerRange('1.0.0-beta.1')).toBe(true);
    expect(isValidSemVerRange('^1.0.0-beta.1')).toBe(true);
  });

  it('rejects non strings', () => {
    expect(isValidSemVerRange(null)).toBe(false);
    expect(isValidSemVerRange(undefined)).toBe(false);
    expect(isValidSemVerRange(2)).toBe(false);
    expect(isValidSemVerRange(true)).toBe(false);
    expect(isValidSemVerRange({})).toBe(false);
  });

  it.each(['asd', '()()(', '..', '.', '1.'])(
    'rejects invalid ranges',
    (range) => {
      expect(isValidSemVerRange(range)).toBe(false);
    },
  );
});
