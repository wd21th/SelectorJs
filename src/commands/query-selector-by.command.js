const vscode = require('vscode');
const ncp = require('copy-paste');
const {
  allDoubleQuotes,
  emptySpace,
  contentBetweenAngleBrackets,
  newLine,
  hyphen,
  multipleDigitsInBeginningOfEachRow,
  space,
} = require('./../regex');
const { getSelection, buildHtmlTree } = require('../utils');

/**
 * Generates querySelector commands with variables by user's pick
 * @returns {void}
 */
async function querySelectorByCommand() {
  let declarations = [];
  let htmlObjs = getSelection()
    .childNodes.map(item => {
      return buildHtmlTree(item);
    })
    .flat(Infinity);

  const selectors = ['id', 'class', 'tagName'];
  let result = await vscode.window.showQuickPick(selectors);

  htmlObjs.forEach(item => {
    if (result == 'id') {
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
        let varable = `${varableName} = document.getElementById('${item.attrs[result].replace(allDoubleQuotes, emptySpace)}')`;
        declarations.push(varable);
      }
    } else if (result == 'class') {
      if (item.attrs[result]) {
        let classValue = item.attrs[result].replace(allDoubleQuotes, emptySpace);

        if (classValue.includes(space)) {
          let classes = classValue.split(space);
          classes.filter(element => element != emptySpace);
          classValue = classes[0];
        }

        let varableName = classValue;
        if (multipleDigitsInBeginningOfEachRow.test(varableName)) {
          const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
          varableName = varableName.substring(lengthOfDigits);
        }

        if (varableName.includes(hyphen)) {
          varableName = varableName.split(hyphen);

          varableName.filter(element => element != emptySpace);

          for (let j = 1; j < varableName.length; j++) {
            varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
          }
          varableName = varableName.join(emptySpace);
        }

        let varable = `${varableName} = document.querySelector('.${classValue}')`;
        declarations.push(varable);
      }
    } else if (result == 'tagName') {
      let varable = `${item.tagName} = document.querySelector('${item.tagName}')`;
      declarations.push(varable);
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

  for (let i = 1; i < declarations.length; i++) {
    declarations[i] = htmlObjs[i].tabSize + declarations[i];
  }
let finalString = declarations.length === 1 ? `const ${declarations.join(',\n')};` : `const ${newLine}${declarations.join(',\n')};`;

  ncp.copy(finalString, function () {
    vscode.window.showInformationMessage('OK');
  });
}

module.exports = querySelectorByCommand;
