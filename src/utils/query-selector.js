const { htmlElement } = require("../classes");
const { emptySpace } = require("../regex");

/**
 * Description
 * @param {htmlElement} item
 * @returns {Array<string>}
 */
function querySelector (item) {
  let keys = Object.keys(item.attrs), arr = [];
  if (keys.includes('id')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let id = item.attrs['id'].replace(/\"/g, emptySpace);
    let varable = `${varableName} = document.getElementById('${id}')`;
    arr.push(varable);
  } else if (keys.includes('class')) {
    let varableName = checkClassVarName(item.attrs['class']);
    let classV = item.attrs['class'].replace(/\"/g, emptySpace);
    let varable = `${varableName} = document.querySelector('.${classV}')`;
    arr.push(varable);
  } else {
    let varable = `${item.tagName} = document.querySelector('${item.tagName}')`;
    arr.push(varable);
  }

  return arr;
}

module.exports = querySelector;