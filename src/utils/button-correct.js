const { htmlElement } = require('../classes');
const { allDoubleQuotes, anyFirstSymbol, emptySpace } = require('../regex');
const checkIdVarName = require('./check-id-var-name');

/**
 * Consist varable name from button attribute, uses querySelector method
 * @param {htmlElement} item
 * @returns {string[]}
 */
function buttonCorrect(item) {
  let arr = [];
  let keys = Object.keys(item.attrs);
  if (keys.includes('id')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let buttonId = item.attrs['id'].replace(allDoubleQuotes, emptySpace);

    let varable = `button${varableName.replace(anyFirstSymbol, (match) => match.toUpperCase())} = document.querySelector('${item.tagName}#${buttonId}')`;
    arr.push(varable);
  } else if (keys.includes('type')) {
    let varableName = checkIdVarName(item.attrs['type']);
    let buttonType = item.attrs['type'];

    let varable = `button${varableName.replace(anyFirstSymbol, (match) => match.toUpperCase())} = document.querySelector('${item.tagName}[type=${buttonType}]')`;
    arr.push(varable);
  } else if (keys.includes('value')) {
    let varableName = checkIdVarName(item.attrs['value']);
    let buttonValue = item.attrs['value'];

    let varable = `button${varableName.replace(anyFirstSymbol, (match) => match.toUpperCase())} = document.querySelector('${item.tagName}[value=${buttonValue}]')`;
    arr.push(varable);
  } else if (keys.includes('name')) {
    let varableName = checkIdVarName(item.attrs['name']);
    let buttonName = item.attrs['name'];

    let varable = `button${varableName.replace(anyFirstSymbol, (match) => match.toUpperCase())} = document.querySelector('${item.tagName}[name=${buttonName}]')`;
    arr.push(varable);
  } else {
    let varable = `button = document.querySelector('${item.tagName}')`;
    arr.push(varable);
  }

  return arr;
}

module.exports = buttonCorrect;
