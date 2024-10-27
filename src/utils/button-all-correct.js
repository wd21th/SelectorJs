const { htmlElement } = require('../classes');
const { allDoubleQuotes, emptySpace } = require('../regex');
const checkIdVarName = require('./check-id-var-name');

/**
 * Consist varable name from button attribute, uses querySelectorAll method
 * @param {htmlElement} item
 * @returns {string}
 */
function buttonAllCorrect(item) {
  let keys = Object.keys(item.attrs);
  
  if (keys.includes('id')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let buttonId = item.attrs['id'].replace(allDoubleQuotes, emptySpace);

    let varable = `button${varableName}s = document.querySelector('${item.tagName}#${buttonId}')`;
    return varable;
  } else if (keys.includes('type')) {
    let varableName = checkIdVarName(item.attrs['type']);
    let buttonType = item.attrs['type'];

    let varable = `button${varableName}s = document.querySelectorAll('${item.tagName}[type="${buttonType}"]')`;
    return varable;
  } else if (keys.includes('value')) {
    let varableName = checkIdVarName(item.attrs['value']);
    let buttonValue = item.attrs['value'];

    let varable = `button${varableName}s = document.querySelectorAll('${item.tagName}[value="${buttonValue}"]')`;
    return varable;
  } else if (keys.includes('name')) {
    let varableName = checkIdVarName(item.attrs['name']);
    let buttonName = item.attrs['name'];

    let varable = `button${varableName}s = document.querySelectorAll('${item.tagName}[name="${buttonName}"]')`;
    return varable;
  } 
  
  let varable = `buttons = document.getElementsByTagName('${item.tagName}')`;
  return varable;
}

module.exports = buttonAllCorrect;
