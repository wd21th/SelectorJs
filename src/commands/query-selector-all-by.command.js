const vscode = require('vscode');
const ncp = require('copy-paste');
const {
  emptySpace,
  contentBetweenAngleBrackets,
  newLine,
  hyphen,
  multipleDigitsInBeginningOfEachRow,
  space,
  allDoubleQuotes,
} = require('./../regex');
const { getSelection, buildHtmlTree } = require('../utils');

/**
 * Generates querySelectorAll commands with variables by user's pick
 * @returns {void}
 */
async function querySelectorAllByCommand() {
  let declarations = [];
  let htmlObjs = getSelection()
    .childNodes.map(item => {
      return buildHtmlTree(item);
    })
    .flat(Infinity);

  let result = await vscode.window.showQuickPick(['class', 'name', 'tagName']);

  htmlObjs.forEach(item => {
    if (result == 'class') {
      if (item.attrs[result]) {
        let classValue = item.attrs[result].replace(allDoubleQuotes, emptySpace);

        if (classValue.includes(space)) {
          let classes = classValue.split(space);
          classes.filter(element => element !== emptySpace);
          classValue = classes[0];
        }

        let varableName = classValue;
        if (multipleDigitsInBeginningOfEachRow.test(varableName)) {
          const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
          varableName = varableName.substring(lengthOfDigits);
        }

        if (varableName.includes(hyphen)) {
          varableName = varableName.split(hyphen);

          for (let j = 1; j < varableName.length; j++) {
            varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
          }
          varableName = varableName.join(emptySpace);
        }

        let varable = `${varableName}s = document.getElementsByClassName('${classValue}')`;
        declarations.push(varable);
      }
    } else if (result == 'name') {
      if (item.attrs[result]) {
        let varableName = item.attrs[result].replace(allDoubleQuotes, emptySpace);
        if (multipleDigitsInBeginningOfEachRow.test(varableName)) {
          const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
          varableName = varableName.substring(lengthOfDigits);
        }
        if (varableName.includes(hyphen)) {
          varableName = varableName.split(hyphen);
          for (let j = 1; j < varableName.length; j++) {
            varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
          }
          varableName = varableName.join(emptySpace);
        }
        let varable = `${varableName}s = document.getElementsByName('${item.attrs[result].replace(allDoubleQuotes, emptySpace)}')`;
        declarations.push(varable);
      }
    } else if (result == 'tagName') {
      let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`;
      declarations.push(varable);
    }
  });

  const tab = '\t';
  htmlObjs.forEach(item => {
    let tabs = emptySpace;
    for (let i = 0; i < item.nestingLevel; i++) {
      tabs += tab;
    }
    if (tabs !== emptySpace) {
      item.tabSize = tabs;
    }
  });

  for (let i = 1; i < declarations.length; i++) {
    declarations[i] = htmlObjs[i].tabSize + declarations[i];
  }

  let finalString =
    'const ' + declarations.length === 1 ? `${declarations.join(',\n')};` : `${newLine}${declarations.join(',\n')};`;

  ncp.copy(finalString, function () {
    vscode.window.showInformationMessage('OK');
  });
}

module.exports = querySelectorAllByCommand;
