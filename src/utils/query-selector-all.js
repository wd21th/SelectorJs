const { htmlElement } = require('../classes');
const { emptySpace, allDoubleQuotes } = require('../regex');
const checkClassVarName = require('./check-class-var-name');
const checkIdVarName = require('./check-id-var-name');

/**
 * Generate variables with querySelectorAll method
 * @param {htmlElement} item
 * @returns {string}
 */
function querySelectorAll(item) {
  let keys = Object.keys(item.attrs);

  if (keys.includes('class')) {
    let varableName = checkClassVarName(item.attrs['class']);
    let classV = item.attrs['class'].replace(allDoubleQuotes, emptySpace);
    let varable = `${varableName}s = document.getElementsByClassName('${classV}')`;
    return varable;
  } else if (keys.includes('name')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let name = item.attrs['name'].replace(allDoubleQuotes, emptySpace);
    let varable = `${varableName}s = document.getElementsByName('${name}')`;
    return varable;
  }
  
  let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`;
  return varable;
}

module.exports = querySelectorAll;
