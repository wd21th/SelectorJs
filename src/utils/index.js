const nesting = require('./build-html-tree'),
  buttonCorrect = require('./button-correct'),
  buttonAllCorrect = require('./button-all-correct'),
  checkIdVarName = require('./check-id-var-name'),
  checkClassVarName = require('./check-class-var-name'),
  setAttributes = require('./set-attributes'),
  getSelection = require('./get-selection'),
  querySelector = require('./query-selector'),
  querySelectorAll = require('./query-selector-all');

module.exports = {
  nesting,
  buttonCorrect,
  buttonAllCorrect,
  checkIdVarName,
  checkClassVarName,
  getSelection,
  setAttributes,
  querySelector,
  querySelectorAll,
}