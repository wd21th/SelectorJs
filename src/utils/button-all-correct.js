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
    let btnId = item.attrs['id'].replace(allDoubleQuotes, emptySpace);

    let varable = `btn${varableName}s = document.querySelectorAll('${item.tagName}#${btnId}')`;
    arr.push(varable);
  } else if (keys.includes('type')) {
    let varableName = checkIdVarName(item.attrs['type']);
    let btnType = item.attrs['type'];

    let varable = `btn${varableName}s = document.querySelectorAll('${item.tagName}[type="${btnType}"]')`;
    arr.push(varable);
  } else if (keys.includes('value')) {
    let varableName = checkIdVarName(item.attrs['value']);
    let btnValue = item.attrs['value'];

    let varable = `btn${varableName}s = document.querySelectorAll('${item.tagName}[value="${btnValue}"]')`;
    arr.push(varable);
  } else if (keys.includes('name')) {
    let varableName = checkIdVarName(item.attrs['name']);
    let btnName = item.attrs['name'];

    let varable = `btn${varableName}s = document.querySelectorAll('${item.tagName}[name="${btnName}"]')`;
    arr.push(varable);
  } else {
    let varable = `btns = document.getElementsByTagName('${item.tagName}')`;
    arr.push(varable);
  }

  return arr;
}

module.exports = buttonAllCorrect;