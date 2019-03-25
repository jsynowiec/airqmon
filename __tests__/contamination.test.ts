import { getContaminationThresholdIndex, Contaminants } from '../src/contamination';

const getContaminationThresholdIndexForPM10 = (value: number) => {
  return getContaminationThresholdIndex(Contaminants.PM10, value);
};

describe('test getContaminationThresholdIndex helper', () => {
  describe('for PM10 thresholds', () => {
    it('returns index == 0 for values <0, 20>', () => {
      expect(getContaminationThresholdIndexForPM10(0)).toBe(0);
      expect(getContaminationThresholdIndexForPM10(19)).toBe(0);
    });

    it('returns index == 1 for values (20, 60>', () => {
      expect(getContaminationThresholdIndexForPM10(21)).toBe(1);
      expect(getContaminationThresholdIndexForPM10(60)).toBe(1);
    });

    it('returns index == 2 for values (60, 100>', () => {
      expect(getContaminationThresholdIndexForPM10(61)).toBe(2);
      expect(getContaminationThresholdIndexForPM10(100)).toBe(2);
    });

    it('returns index == 3 for values (100, 140>', () => {
      expect(getContaminationThresholdIndexForPM10(101)).toBe(3);
      expect(getContaminationThresholdIndexForPM10(140)).toBe(3);
    });

    it('returns index == 4 for values (140, 200>', () => {
      expect(getContaminationThresholdIndexForPM10(141)).toBe(4);
      expect(getContaminationThresholdIndexForPM10(200)).toBe(4);
    });

    it('returns index == 5 for values >200', () => {
      expect(getContaminationThresholdIndexForPM10(201)).toBe(5);
      expect(getContaminationThresholdIndexForPM10(250)).toBe(5);
      expect(getContaminationThresholdIndexForPM10(500)).toBe(5);
    });
  });
});
