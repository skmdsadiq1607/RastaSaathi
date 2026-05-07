const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const path = require('path');
const env = require('./config/env');
const loadExpress = require('./loaders/express');
const { requireAuth, authorize } = require('./middleware/auth.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const queues = require('./queues');
const { sendSuccess } = require('./utils/responseFormatter');

const app = express();
loadExpress(app);

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs', 'api', 'swagger.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function queueBasicAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Basic ') ? Buffer.from(header.slice(6), 'base64').toString('utf8') : '';
  const [user, pass] = token.split(':');
  if (user === env.bullBoardUser && pass === env.bullBoardPass) return next();
  res.set('WWW-Authenticate', 'Basic realm="RoadSoS queues"');
  return res.status(401).send('Queue authentication required');
}

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({ queues: queues.allQueues().map((queue) => new BullAdapter(queue)), serverAdapter });
app.use('/admin/queues', queueBasicAuth, serverAdapter.getRouter());

app.get('/health', (_req, res) => sendSuccess(res, { status: 'ok' }, 'RoadSoS backend healthy'));
app.get('/api/admin/queues/status', requireAuth, authorize('admin'), async (req, res, next) => { try { sendSuccess(res, await queues.getQueueStatus(), 'Queue status loaded'); } catch (error) { next(error); } });
app.post('/api/admin/queue/:name/retry', requireAuth, authorize('admin'), async (req, res, next) => { try { sendSuccess(res, await queues.retryFailed(req.params.name), 'Failed jobs retried'); } catch (error) { next(error); } });

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/sos', require('./modules/sos/sos.routes'));
app.use('/api/incidents', require('./modules/incident/incident.routes'));
app.use('/api/severity', require('./modules/severity/severity.routes'));
app.use('/api/hospital', require('./modules/hospital/hospital.routes'));
app.use('/api/routing', require('./modules/routing/routing.routes'));
app.use('/api/alerts', require('./modules/alerts/alerts.routes'));
app.use('/api/firstaid', require('./modules/firstaid/firstaid.routes'));
app.use('/api/workflow', require('./modules/workflow/workflow.routes'));
app.use('/api/fallback', require('./modules/fallback/fallback.routes'));
app.use('/api/language', require('./modules/language/language.routes'));
app.use('/api/transparency', require('./modules/transparency/transparency.routes'));
app.use('/api/resources', require('./modules/resources/resources.routes'));
app.use('/api/timeline', require('./modules/timeline/timeline.routes'));
app.use('/api/dashboard', require('./modules/dashboard/dashboard.routes'));
app.use('/api/insights', require('./modules/insights/insights.routes'));
app.use('/api/voice', require('./modules/voice/voice.routes'));
app.use('/api/summary', require('./modules/summary/summary.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
