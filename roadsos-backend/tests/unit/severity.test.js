const { calculateSeverityScore } = require('../../src/utils/severityScorer');

describe('severity scorer', () => {
  test('scores critical crashes high', () => {
    const result = calculateSeverityScore({ speed: 100, impactForce: 7, vehicleType: 'two-wheeler', injuryDescription: 'severe bleeding head injury', consciousnessLevel: 'unconscious', age: 70 });
    expect(result.level).toBe('CRITICAL');
    expect(result.score).toBeGreaterThanOrEqual(86);
  });

  test('scores minor injuries low', () => {
    const result = calculateSeverityScore({ speed: 5, impactForce: 0.4, vehicleType: 'car', injuryDescription: 'minor bruise', consciousnessLevel: 'alert', age: 30 });
    expect(result.level).toBe('LOW');
  });
});
