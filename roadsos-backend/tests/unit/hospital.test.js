const { scoreHospital } = require('../../src/modules/hospital/hospital.service');
const { toPoint } = require('../../src/utils/geoUtils');

describe('hospital selection scoring', () => {
  test('rewards trauma capability, ICU availability, blood bank, and specialty match', async () => {
    const hospital = {
      name: 'Trauma One',
      location: toPoint(17.4, 78.45),
      specialties: ['trauma', 'neurosurgery'],
      icuBeds: 10,
      traumaCenter: true,
      bloodBankAvailable: true
    };
    const result = await scoreHospital(hospital, { icuBeds: 12 }, {
      lat: 17.4,
      lng: 78.45,
      severityLevel: 'CRITICAL',
      injuryType: 'head injury'
    });
    expect(result.score).toBeGreaterThan(85);
    expect(result.components.traumaCenterMatch).toBe(100);
    expect(result.components.specialtyMatch).toBe(100);
  });
});
