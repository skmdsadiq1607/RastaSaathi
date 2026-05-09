const express = require('express');
const controller = require('./hospital.controller');
const validator = require('./hospital.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();

router.post('/geocode-seed', controller.geocodeSeed); // POST: accepts [{name,address}], geocodes & saves
router.get('/seed', controller.seed);                 // GET: seeds the built-in list
router.get('/public', controller.list);
router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, validate(validator.id), controller.get);
router.post('/select', requireAuth, validate(validator.select), controller.select);

module.exports = router;
