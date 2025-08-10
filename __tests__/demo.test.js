describe('Demo Test Suite', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('Basic math operations', () => {
    expect(2 + 2).toBe(4);
    expect(3 * 3).toBe(9);
  });

  test('String operations', () => {
    expect('hello world'.toUpperCase()).toBe('HELLO WORLD');
    expect('test'.length).toBe(4);
  });

  test('Array operations', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1);
  });
});
