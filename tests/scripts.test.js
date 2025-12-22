test("script sandbox", async () => {
  const sum = (a, b) => a + b;
  expect(sum(1, 2)).toBe(3);

  expect(true).toBe(true);
});
