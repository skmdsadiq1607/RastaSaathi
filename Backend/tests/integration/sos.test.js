jest.mock('../../src/middleware/auth.middleware', () => ({
  requireAuth: (req, _res, next) => {
    req.user = { id: '665000000000000000000001', role: 'victim' };
    next();
  },
  authorize: () => (_req, _res, next) => next(),
  extractToken: () => 'test-token'
}));

jest.mock('../../src/queues', () => ({
  getQueue: () => null,
  allQueues: () => [],
  getQueueStatus: async () => ({}),
  retryFailed: async () => ({ retried: 0 })
}));

jest.mock('../../src/modules/sos/sos.service', () => ({
  triggerSos: jest.fn(async (payload) => ({
    sos: { _id: '665000000000000000000010', user: payload.userId, status: 'WORKFLOW_STARTED' },
    incident: {
      _id: '665000000000000000000011',
      victim: payload.userId,
      injuryType: payload.injuryType,
      vehicleType: payload.vehicleType,
      status: 'SOS_TRIGGERED'
    }
  })),
  cancelSos: jest.fn(),
  history: jest.fn(async () => ({ items: [], total: 0, page: 1, pages: 0 }))
}));

const request = require('supertest');
const app = require('../../src/app');
const sosService = require('../../src/modules/sos/sos.service');

describe('SOS HTTP integration', () => {
  test('validates and forwards SOS trigger to service layer', async () => {
    const response = await request(app)
      .post('/api/sos/trigger')
      .send({ lat: 17.385, lng: 78.4867, injuryType: 'head injury', vehicleType: 'two-wheeler' });

    expect(response.status).toBe(201);
    expect(response.body.data.incident.status).toBe('SOS_TRIGGERED');
    expect(sosService.triggerSos).toHaveBeenCalledWith(
      expect.objectContaining({ lat: 17.385, lng: 78.4867, userId: '665000000000000000000001' })
    );
  });
});
