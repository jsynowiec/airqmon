import {
  getAQIndexMetadata,
  getAQIndexMetadataForValue,
  DEFAULT_AQ_INDEX,
  AQIndex,
} from '../src/common/air-quality';

describe('test default AQ index', () => {
  it('should be eq CAQI', () => {
    expect(DEFAULT_AQ_INDEX).toEqual(AQIndex.CAQI);
  });
});

describe('test getAQIndexMetadataForValue helper', () => {
  it('returns CAQI == 0 for values <0, 25> and default AQ index', () => {
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 0).index).toBe(0);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 12).index).toBe(0);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 25).index).toBe(0);
  });

  it('returns CAQI == 1 for values (25, 50> and default AQ index', () => {
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 26).index).toBe(1);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 28).index).toBe(1);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 50).index).toBe(1);
  });

  it('returns CAQI == 2 for values (50, 75> and default AQ index', () => {
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 51).index).toBe(2);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 63).index).toBe(2);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 75).index).toBe(2);
  });

  it('returns CAQI == 3 for values (75, 100> and default AQ index', () => {
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 76).index).toBe(3);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 88).index).toBe(3);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 100).index).toBe(3);
  });

  it('returns CAQI == 4 for values >100 and default AQ index', () => {
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 101).index).toBe(4);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 150).index).toBe(4);
    expect(getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, 500).index).toBe(4);
  });
});
