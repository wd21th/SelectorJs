const { htmlElement } = require('../classes');
const { emptySpace, allDoubleQuotes } = require('../regex');
const checkClassVarName = require('./check-class-var-name');
const checkIdVarName = require('./check-id-var-name');

/**
 * Generate variables with querySelector method
 * @param {htmlElement} item
 * @returns {string}
 */
function querySelector(item) {
  let keys = Object.keys(item.attrs);

  if (keys.includes('id')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let id = item.attrs['id'].replace(allDoubleQuotes, emptySpace);
    let varable = `${varableName} = document.getElementById('${id}')`;
    return varable;
  } else if (keys.includes('class')) {
    let varableName = checkClassVarName(item.attrs['class']);
    let classV = item.attrs['class'].replace(allDoubleQuotes, emptySpace);
    let varable = `${varableName} = document.querySelector('.${classV}')`;
    return varable;
  }

  let varable = `${item.tagName} = document.querySelector('${item.tagName}')`;
  return varable;
}

module.exports = querySelector;
