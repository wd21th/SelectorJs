const vscode = require('vscode');
let htmlParser = require('node-html-parser');

module.exports = function getSelection () {
  const editor = vscode.window.activeTextEditor,
    document = editor.document,
    selection = editor.selection;
  let html = document.getText(selection);
  html = html.match(/<.+?>/g).join('');
  let root = htmlParser.parse(html);

  return root;
}