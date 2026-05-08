const mapsService = require('../../src/services/maps.service');

describe('routing fallback', () => {
  test('returns ETA and distance without Google key', async () => {
    const route = await mapsService.getDirections({ lat: 17.385, lng: 78.4867 }, { lat: 17.415059, lng: 78.412301 }, 'CRITICAL');
    expect(route.etaSeconds).toBeGreaterThan(0);
    expect(route.distanceMeters).toBeGreaterThan(0);
  });
});
