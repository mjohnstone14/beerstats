import { calculateRGBA, getRGBAArrayForSRM } from '../helpers/InterpolateColors';

describe('InterpolateColors', () => {
  it('returns correctly mapped colors for valid SRM values', () => {
    expect(calculateRGBA(1)).toBe('rgba(255, 199, 80, 0.8)');
    expect(calculateRGBA(40)).toBe('rgba(113, 56, 0, 0.8)');
    expect(calculateRGBA(15)).toBe('rgba(227, 114, 0, 0.8)');
  });

  it('handles boundary SRM values', () => {
    // SRM 0 should return the first colour
    expect(calculateRGBA(0)).toBe('rgba(255, 204, 102, 0.8)');
    // SRM 40 should return the last colour
    expect(calculateRGBA(40)).toBe('rgba(113, 56, 0, 0.8)');
  });

  it('generates an array of colors', () => {
    const arr = getRGBAArrayForSRM(5);
    expect(arr).toHaveLength(5);
    expect(arr[0]).toBe('rgba(255, 204, 102, 0.8)');
  });

  it('handles array sizes greater than 40', () => {
    const arr = getRGBAArrayForSRM(42);
    expect(arr).toHaveLength(42);
    expect(arr[40]).toBe('rgba(122, 61, 0, 0.8)');
  });
});
