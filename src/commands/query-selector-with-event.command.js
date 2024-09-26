const vscode = require('vscode');
const ncp = require('copy-paste');
const { emptySpace, contentBetweenAngleBrackets, newLine, semicolon } = require('./../regex');
const { buildHtmlTree, querySelector, getSelection } = require('../utils');

/**
 * Generates querySelector commands with variables and event
 * @returns {void}
 */
async function querySelectorWithEventCommand() {
  let declarations = [];
  let result = await vscode.window.showQuickPick(
    events,
    {},
  );

  let htmlObjs = getSelection()
    .childNodes.map(item => {
      return buildHtmlTree(item);
    })
    .flat(Infinity);

  htmlObjs.forEach(item => {
    declarations = querySelector(item);
  });

  for (let i = 0; i < declarations.length; i++) {
    let declare = declarations[i].match(/([a-zA-Z\d-_]+)(?=\s=)/g)[0];

    declarations[i] = `const ${declarations[i]}${semicolon}
function ${result}On${declare[0].toUpperCase() + declare.substring(1)}(event) {
console.log(event.type);
}
${declare}.addEventListener("${result}", ${result}On${declare[0].toUpperCase() + declare.substring(1)})${semicolon}
// =====================================================\n`;
  }

  ncp.copy(declarations.join(newLine), function () {
    vscode.window.showInformationMessage('OK');
  });
}

module.exports = querySelectorWithEventCommand;
