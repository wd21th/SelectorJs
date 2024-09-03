const createElementCommand = require('./create-element.command'),
  querySelector = require('./query-selector.command'),
  querySelectorBy = require('./query-selector-by.command'),
  querySelectorAll = require('./query-selector-all.command'),
  querySelectorAllBy = require('./query-selector-all-by.command'),
  querySelectorWithEvent = require('./query-selector-with-event.command'),
  querySelectorWithDetails = require('./query-selector-with-details.command');

module.exports = {
  createElementCommand,
  querySelector,
  querySelectorBy,
  querySelectorAll,
  querySelectorAllBy,
  querySelectorWithEvent,
  querySelectorWithDetails,
}