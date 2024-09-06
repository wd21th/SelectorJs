const vscode = require('vscode');
const ncp = require('copy-paste');
const { getSelection, querySelector, buttonCorrect, nesting } = require('../utils');
const { emptySpace, contentBetweenAngleBrackets, newLine } = require('./../regex');

/**
 * Description
 * @returns {any}
 */
function querySelectorCommand () {
  let htmlObjs = [];
  let declarations = [];
  getSelection().childNodes.forEach(item => {
    nesting(item, htmlObjs, 0, null);
  });

  htmlObjs.forEach(item => {
    if (Object.keys(item.attrs).length != 0) {
      if (item.tagName == 'button') {
        buttonCorrect(item, declarations);
      } else {
        querySelector(item, declarations);
      }
    } else {
      if (item.tagName == 'button') {
        let varable = `btn = document.querySelector('${item.tagName}')`;
        declarations.push(varable);
      } else {
        let varable = `${item.tagName} = document.querySelector('${item.tagName}')`;
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

module.exports = querySelectorCommand;