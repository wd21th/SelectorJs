const vscode = require('vscode');
const ncp = require('copy-paste');
const { getSelection, querySelector, buttonCorrect, buildHtmlTree } = require('../utils');
const { emptySpace, contentBetweenAngleBrackets, newLine } = require('./../regex');

/**
 * Generates querySelector commands with variables
 * @returns {void}
 */
function querySelectorCommand() {
  let htmlObjs = getSelection()
    .childNodes.map(item => {
      return buildHtmlTree(item);
    })
    .flat(Infinity);
  let declarations = [];

  htmlObjs.forEach(item => {
    if (Object.keys(item.attrs).length !== 0) {
      if (item.tagName == 'button') {
        declarations = buttonCorrect(item);
      } else {
        declarations = querySelector(item);
      }
    } else {
      if (item.tagName == 'button') {
        let varable = `button = document.querySelector('${item.tagName}')`;
        declarations.push(varable);
      } else {
        let varable = `${item.tagName} = document.querySelector('${item.tagName}')`;
        declarations.push(varable);
      }
    }
  });

  const tab = '\t';
  htmlObjs.forEach(item => {
    let tabs = emptySpace;
    for (let i = 0; i < item.nestingLevel; i++) {
      tabs += tab;
    }
    if (tabs !== emptySpace) {
      item.tabSize = `/${tabs}/`;
    }
  });

  for (let i = 0; i < declarations.length; i++) {
    declarations[i] = htmlObjs[i].tabSize + declarations[i];
  }

  let finalString =
    declarations.length === 1 ? `const ${declarations.join(',\n')};` : `const ${newLine}${declarations.join(',\n')};`;

  ncp.copy(finalString, function () {
    vscode.window.showInformationMessage('OK');
  });
}

module.exports = querySelectorCommand;
