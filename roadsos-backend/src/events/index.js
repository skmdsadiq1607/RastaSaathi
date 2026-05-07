const EventEmitter = require('events');

const eventBus = new EventEmitter();
eventBus.setMaxListeners(100);

eventBus.register = function register() {
  require('./sos.events')(eventBus);
  require('./incident.events')(eventBus);
  require('./hospital.events')(eventBus);
};

module.exports = eventBus;
