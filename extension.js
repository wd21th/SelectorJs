const vscode = require('vscode');
const ncp = require('copy-paste');
let HTMLParser = require('node-html-parser');
const { querySelectorCommand, querySelectorAllCommand, querySelectorByCommand } = require('./src/commands');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.ce', () => {}),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qsby', querySelectorByCommand),
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
    vscode.commands.registerCommand('selector-js.qsa', querySelectorAllCommand),
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
