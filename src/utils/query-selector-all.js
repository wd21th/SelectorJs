const { htmlElement } = require('../classes');
const { emptySpace, allDoubleQuotes } = require('../regex');
const checkClassVarName = require('./check-class-var-name');
const checkIdVarName = require('./check-id-var-name');

/**
 * Generate variables with querySelectorAll method
 * @param {htmlElement} item
 * @returns {Array<string>}
 */
function querySelectorAll(item) {
  const arr = [];

  let keys = Object.keys(item.attrs);
  if (keys.includes('id')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let id = item.attrs['id'].replace(allDoubleQuotes, emptySpace);
    let varable = `${varableName}s = document.querySelectorAll('#${id}')`;
    arr.push(varable);
  } else if (keys.includes('class')) {
    let varableName = checkClassVarName(item.attrs['class']);
    let classV = item.attrs['class'].replace(allDoubleQuotes, emptySpace);
    let varable = `${varableName}s = document.getElementsByClassName('${classV}')`;
    arr.push(varable);
  } else if (keys.includes('name')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let name = item.attrs['name'].replace(allDoubleQuotes, emptySpace);
    let varable = `${varableName}s = document.getElementsByName('${name}')`;
    arr.push(varable);
  } else {
    let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`;
    arr.push(varable);
  }

  return arr;
}

module.exports = querySelectorAll;
