const vscode = require('vscode');
let htmlParser = require('node-html-parser');

/**
 * Get selection from editor and parse HTML
 * @returns {htmlParser.HTMLElement}
 */
function getSelection () {
  const editor = vscode.window.activeTextEditor,
    document = editor.document,
    selection = editor.selection;
  let html = document.getText(selection);
  html = html.match(contentBetweenAngleBrackets).join(emptySpace);
  let root = htmlParser.parse(html);

  return root;
}

module.exports = getSelection;