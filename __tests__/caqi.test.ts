import { getCAQIMeta } from '../src/common/caqi';

describe('test getCAQIMeta helper', () => {
  it('returns caqi == 0 for values <0, 25>', () => {
    expect(getCAQIMeta(0).index).toBe(0);
    expect(getCAQIMeta(12).index).toBe(0);
    expect(getCAQIMeta(25).index).toBe(0);
  });

  it('returns caqi == 1 for values (25, 50>', () => {
    expect(getCAQIMeta(26).index).toBe(1);
    expect(getCAQIMeta(28).index).toBe(1);
    expect(getCAQIMeta(50).index).toBe(1);
  });

  it('returns caqi == 2 for values (50, 75>', () => {
    expect(getCAQIMeta(51).index).toBe(2);
    expect(getCAQIMeta(63).index).toBe(2);
    expect(getCAQIMeta(75).index).toBe(2);
  });

  it('returns caqi == 3 for values (75, 100>', () => {
    expect(getCAQIMeta(76).index).toBe(3);
    expect(getCAQIMeta(88).index).toBe(3);
    expect(getCAQIMeta(100).index).toBe(3);
  });

  it('returns caqi == 4 for values >100', () => {
    expect(getCAQIMeta(101).index).toBe(4);
    expect(getCAQIMeta(150).index).toBe(4);
    expect(getCAQIMeta(500).index).toBe(4);
  });
});
