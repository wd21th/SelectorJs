const vscode = require('vscode');
const ncp = require('copy-paste');
let HTMLParser = require('node-html-parser');
const { querySelectorCommand } = require('./src/commands');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.ce', () => {}),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qsby', () => {}),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qsaby', () => {}),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qswd', () => {}),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qs', querySelectorCommand),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qsa', () => {}),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qswe', () => {}),
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
