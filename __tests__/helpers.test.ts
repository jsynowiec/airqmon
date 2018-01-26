import { withLeadingZero, isEmptyObject, formatDateTo24Time } from '../src/helpers';

describe('helper functions', () => {
  describe('withLeadingZero', () => {
    it('returns a string prefixed with 0 for values from 0 to 9', () => {
      expect(withLeadingZero(0)).toBe('00');
      expect(withLeadingZero(5)).toBe('05');
      expect(withLeadingZero(9)).toBe('09');
    });
    it('returns a string representation of given value for values >9', () => {
      expect(withLeadingZero(10)).toBe('10');
      expect(withLeadingZero(33)).toBe('33');
    })
  });

  describe('formatDateTo24Time', () => {
    it('returns date in HH:MM format', () => {
      const date = new Date();
      date.setHours(9);
      date.setMinutes(31);

      expect(formatDateTo24Time(date)).toBe('09:31');
    })
  });

  describe('isEmptyObject', () => {
    it('returns true if give object is empty', () => {
      expect(isEmptyObject({})).toBe(true);
    });
    it('returns false if give object has keys', () => {
      expect(isEmptyObject({ someKey: 'someValue' })).toBe(false);
    });
    it('returns false if passed values\' constructor is not Object', () => {
      expect(isEmptyObject(new Array())).toBe(false);
      expect(isEmptyObject(new Date())).toBe(false);
      expect(isEmptyObject(new String())).toBe(false);
    });
  });
});
