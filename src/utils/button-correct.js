const { htmlElement } = require('../classes');
const { allDoubleQuotes, anyFirstSymbol, emptySpace } = require('../regex');
const checkIdVarName = require('./check-id-var-name');
const upCase = require('./up-case');

/**
 * Consist varable name from button attribute, uses querySelector method
 * @param {htmlElement} item
 * @returns {string}
 */
function buttonCorrect(item) {
  let keys = Object.keys(item.attrs);

  if (keys.includes('id')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let buttonId = item.attrs['id'].replace(allDoubleQuotes, emptySpace);

    let varable = `button${varableName.replace(anyFirstSymbol, upCase)} = document.querySelector('${item.tagName}#${buttonId}')`;
    return varable;
  } else if (keys.includes('type')) {
    let varableName = checkIdVarName(item.attrs['type']);
    let buttonType = item.attrs['type'];

    let varable = `button${varableName.replace(anyFirstSymbol, upCase)} = document.querySelector('${item.tagName}[type=${buttonType}]')`;
    return varable;
  } else if (keys.includes('value')) {
    let varableName = checkIdVarName(item.attrs['value']);
    let buttonValue = item.attrs['value'];

    let varable = `button${varableName.replace(anyFirstSymbol, upCase)} = document.querySelector('${item.tagName}[value=${buttonValue}]')`;
    return varable;
  } else if (keys.includes('name')) {
    let varableName = checkIdVarName(item.attrs['name']);
    let buttonName = item.attrs['name'];

    let varable = `button${varableName.replace(anyFirstSymbol, upCase)} = document.querySelector('${item.tagName}[name=${buttonName}]')`;
    return varable;
  }

  let varable = `button = document.querySelector('${item.tagName}')`;
  return varable;
}

module.exports = buttonCorrect;
