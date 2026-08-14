import { describe, it, expect } from 'vitest';
import { formatDate } from './dateFormatter';

describe('formatDate', () => {
  describe('valid date strings', () => {
    it('should format a date with day 1 (st suffix)', () => {
      const result = formatDate('2016-08-01');
      expect(result).toBe('1st Aug, 2016');
    });

    it('should format a date with day 2 (nd suffix)', () => {
      const result = formatDate('2016-08-02');
      expect(result).toBe('2nd Aug, 2016');
    });

    it('should format a date with day 3 (rd suffix)', () => {
      const result = formatDate('2016-08-03');
      expect(result).toBe('3rd Aug, 2016');
    });

    it('should format a date with day 4-20 (th suffix)', () => {
      const result = formatDate('2016-08-04');
      expect(result).toBe('4th Aug, 2016');
    });

    it('should format a date with day 21 (st suffix)', () => {
      const result = formatDate('2016-08-21');
      expect(result).toBe('21st Aug, 2016');
    });

    it('should format a date with day 22 (nd suffix)', () => {
      const result = formatDate('2016-08-22');
      expect(result).toBe('22nd Aug, 2016');
    });

    it('should format a date with day 23 (rd suffix)', () => {
      const result = formatDate('2016-08-23');
      expect(result).toBe('23rd Aug, 2016');
    });

    it('should format a date with day 11 (th suffix - special case)', () => {
      const result = formatDate('2016-08-11');
      expect(result).toBe('11th Aug, 2016');
    });

    it('should format a date with day 12 (th suffix - special case)', () => {
      const result = formatDate('2016-08-12');
      expect(result).toBe('12th Aug, 2016');
    });

    it('should format a date with day 13 (th suffix - special case)', () => {
      const result = formatDate('2016-08-13');
      expect(result).toBe('13th Aug, 2016');
    });

    it('should format a date with different month', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBe('15th Jan, 2024');
    });

    it('should format a date with December month', () => {
      const result = formatDate('2023-12-25');
      expect(result).toBe('25th Dec, 2023');
    });

    it('should handle ISO timestamp with time', () => {
      const result = formatDate('2024-03-15T14:30:00Z');
      expect(result).toBe('15th Mar, 2024');
    });

    it('should format the current date', () => {
      const today = new Date();
      const result = formatDate(today.toISOString());
      // Just verify the format matches expected pattern
      const regex = /^\d{1,2}(?:st|nd|rd|th) [A-Z][a-z]{2}, \d{4}$/;
      expect(result).toMatch(regex);
    });
  });

  describe('invalid date strings', () => {
    it('should return "Invalid date" for empty string', () => {
      const result = formatDate('');
      expect(result).toBe('Invalid date');
    });

    it('should return "Invalid date" for invalid format', () => {
      const result = formatDate('not-a-date');
      expect(result).toBe('Invalid date');
    });

    it('should return "Invalid date" for null input (as string)', () => {
      // new Date(null) converts to "null" string which becomes epoch time
      // Testing with the string "invalid" instead
      const result = formatDate('invalid');
      expect(result).toBe('Invalid date');
    });

    it('should return "Invalid date" for undefined input', () => {
      const result = formatDate(undefined as unknown as string);
      expect(result).toBe('Invalid date');
    });
  });

  describe('edge cases', () => {
    it('should format leap day (Feb 29)', () => {
      const result = formatDate('2024-02-29');
      expect(result).toBe('29th Feb, 2024');
    });

    it('should handle year boundary', () => {
      const result = formatDate('2023-12-31');
      expect(result).toBe('31st Dec, 2023');
    });

    it('should format first day of year', () => {
      const result = formatDate('2024-01-01');
      expect(result).toBe('1st Jan, 2024');
    });
  });

  describe('day suffix logic', () => {
    it('should use st suffix for days ending in 1 (except 11)', () => {
      const testCases = [
        { day: 1, month: 0, expected: '1st' },
        { day: 31, month: 0, expected: '31st' },
      ];
      testCases.forEach(({ day, month, expected }) => {
        const date = new Date(2024, month, day);
        const result = formatDate(date.toISOString());
        expect(result).toContain(expected);
      });
    });

    it('should use nd suffix for days ending in 2 (except 12)', () => {
      const testCases = [
        { day: 2, month: 0, expected: '2nd' },
        { day: 22, month: 0, expected: '22nd' },
      ];
      testCases.forEach(({ day, month, expected }) => {
        const date = new Date(2024, month, day);
        const result = formatDate(date.toISOString());
        expect(result).toContain(expected);
      });
    });

    it('should use rd suffix for days ending in 3 (except 13)', () => {
      const testCases = [
        { day: 3, month: 0, expected: '3rd' },
        { day: 23, month: 0, expected: '23rd' },
      ];
      testCases.forEach(({ day, month, expected }) => {
        const date = new Date(2024, month, day);
        const result = formatDate(date.toISOString());
        expect(result).toContain(expected);
      });
    });

    it('should use th suffix for days 4-20 and 24-31', () => {
      const testCases = [
        { day: 4, month: 0, expected: '4th' },
        { day: 11, month: 0, expected: '11th' },
        { day: 24, month: 0, expected: '24th' },
        { day: 30, month: 0, expected: '30th' },
      ];
      testCases.forEach(({ day, month, expected }) => {
        const date = new Date(2024, month, day);
        const result = formatDate(date.toISOString());
        expect(result).toContain(expected);
      });
    });
  });
});
