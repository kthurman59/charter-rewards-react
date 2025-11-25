import { calculatePoints } from "./calculatePoints";

describe("calculatePoints", () => {
  test("returns 0 for amounts at or below 50", () => {
    expect(calculatePoints(0)).toBe(0);
    expect(calculatePoints(49)).toBe(0);
    expect(calculatePoints(50)).toBe(0);
  });

  test("returns 1 point per dollar between 51 and 100 inclusive", () => {
    expect(calculatePoints(51)).toBe(1);
    expect(calculatePoints(60)).toBe(10);
    expect(calculatePoints(100)).toBe(50);
  });

  test("returns correct points above 100 using the combined rule", () => {
    // example from the prompt: 120 dollars gives 90 points
    expect(calculatePoints(120)).toBe(90);

    // check just above the boundary
    expect(calculatePoints(101)).toBe(52);
  });

  test("floors decimal amounts before calculating", () => {
    // 120.99 should behave like 120
    expect(calculatePoints(120.99)).toBe(90);

    // 50.9 should behave like 50 (still 0 points)
    expect(calculatePoints(50.9)).toBe(0);
  });
});

