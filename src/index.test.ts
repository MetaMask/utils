import * as mainModule from '.';

describe('Main entry point', () => {
  it('has exports', () => {
    expect(Object.keys(mainModule)).not.toHaveLength(0);
  });
});
