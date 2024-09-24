const vscode = require('vscode');
const ncp = require('copy-paste');
let HTMLParser = require('node-html-parser');
const {
  querySelectorCommand,
  querySelectorAllCommand,
  querySelectorByCommand,
  querySelectorAllByCommand,
  createElementCommand,
  querySelectorWithEventCommand,
  querySelectorWithDetailsCommand,
} = require('./src/commands');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('selector-js.create-element', createElementCommand));

  context.subscriptions.push(vscode.commands.registerCommand('selector-js.query-selector-by', querySelectorByCommand));

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.query-selector-all-by', querySelectorAllByCommand),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.query-selector-with-details', querySelectorWithDetailsCommand),
  );

  context.subscriptions.push(vscode.commands.registerCommand('selector-js.query-selector', querySelectorCommand));

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.query-selector-all', querySelectorAllCommand),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.query-selector-with-event', querySelectorWithEventCommand),
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
