const vscode = require('vscode');
const ncp = require('copy-paste');
const { emptySpace, contentBetweenAngleBrackets, newLine } = require('./../regex');
const { getSelection, nesting, buttonAllCorrect, querySelectorAll } = require('../utils');

/**
 * Generates querySelectorAll commands with variables
 * @returns {void}
 */
function querySelectorAllCommand () {
  let declarations = [];
  let htmlObjs = getSelection().childNodes.map(item => {
    return nesting(item);
  }).flat(Infinity);

  htmlObjs.forEach(item => {
    if (Object.keys(item.attrs).length != 0) {
      if (item.tagName == 'button') {
        buttonAllCorrect(item, declarations);
      } else {
        querySelectorAll(item, declarations);
      }
    } else {
      if (item.tagName == 'button') {
        let varable = `btns = document.getElementsByTagName('${item.tagName}')`;
        declarations.push(varable);
      } else {
        let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`;
        declarations.push(varable);
      }
    }
  });

  const tab = '**';
  htmlObjs.forEach(item => {
    let tabs = emptySpace;
    for (let i = 0; i < item.nestingLevel; i++) {
      tabs += tab;
    }
    if (tabs != emptySpace) {
      item.tabSize = `/${tabs}/`;
    }
  });

  for (let i = 0; i < declarations.length; i++) {
    declarations[i] = htmlObjs[i].tabSize + declarations[i];
  }

  let finalString;
  if (declarations.length == 1) {
    finalString = `const ${declarations.join(',\n')};`;
  } else {
    finalString = `const ${newLine}${declarations.join(',\n')};`;
  }
  ncp.copy(finalString, function () {
    vscode.window.showInformationMessage('OK');
  });
}

module.exports = querySelectorAllCommand;