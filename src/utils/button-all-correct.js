const { htmlElement } = require("../classes");
const { allDoubleQuotes, emptySpace } = require("../regex");
const checkIdVarName = require("./check-id-var-name");

/**
 * Description
 * @param {htmlElement} item
 * @returns {string[]}
 */
function buttonAllCorrect (item) {
  const arr = [];
  let keys = Object.keys(item.attrs);
  if (keys.includes('id')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let buttonId = item.attrs['id'].replace(allDoubleQuotes, emptySpace);

    let varable = `button${varableName}s = document.querySelectorAll('${item.tagName}#${buttonId}')`;
    arr.push(varable);
  } else if (keys.includes('type')) {
    let varableName = checkIdVarName(item.attrs['type']);
    let buttonType = item.attrs['type'];

    let varable = `button${varableName}s = document.querySelectorAll('${item.tagName}[type="${buttonType}"]')`;
    arr.push(varable);
  } else if (keys.includes('value')) {
    let varableName = checkIdVarName(item.attrs['value']);
    let buttonValue = item.attrs['value'];

    let varable = `button${varableName}s = document.querySelectorAll('${item.tagName}[value="${buttonValue}"]')`;
    arr.push(varable);
  } else if (keys.includes('name')) {
    let varableName = checkIdVarName(item.attrs['name']);
    let buttonName = item.attrs['name'];

    let varable = `button${varableName}s = document.querySelectorAll('${item.tagName}[name="${buttonName}"]')`;
    arr.push(varable);
  } else {
    let varable = `buttons = document.getElementsByTagName('${item.tagName}')`;
    arr.push(varable);
  }

  return arr;
}

module.exports = buttonAllCorrect;