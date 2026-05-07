const { calculateSeverityScore } = require('../../src/utils/severityScorer');

describe('workflow building blocks', () => {
  test('severity score returns required workflow level', () => {
    const result = calculateSeverityScore({ speed: 60, impactForce: 4, vehicleType: 'car', injuryDescription: 'fracture', consciousnessLevel: 'conscious', age: 35 });
    expect(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).toContain(result.level);
  });
});
