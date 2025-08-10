const verificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

describe('Email Utils Tests', () => {
  describe('verificationCode', () => {
    test('should generate a 6-digit verification code', () => {
      const code = verificationCode();
      
      expect(code).toBeDefined();
      expect(typeof code).toBe('number');
      expect(code.toString()).toHaveLength(6);
      expect(code).toBeGreaterThanOrEqual(100000);
      expect(code).toBeLessThanOrEqual(999999);
    });

    test('should generate different codes on multiple calls', () => {
      const code1 = verificationCode();
      const code2 = verificationCode();
      const code3 = verificationCode();
      
      const codes = [code1, code2, code3];
      const uniqueCodes = [...new Set(codes)];
      
      expect(uniqueCodes.length).toBeGreaterThan(1);
    });

    test('should only generate numeric codes', () => {
      for (let i = 0; i < 10; i++) {
        const code = verificationCode();
        expect(Number.isInteger(code)).toBe(true);
        expect(code.toString()).toMatch(/^\d{6}$/);
      }
    });
  });
});
