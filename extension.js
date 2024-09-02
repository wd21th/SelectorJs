const vscode = require('vscode');
const ncp = require('copy-paste');
let HTMLParser = require('node-html-parser');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  class parentElement {
    constructor(tagName, attrsObj) {
      this.tagName = tagName;
      this.attrs = attrsObj;
    }
  }

  class htmlElement {
    constructor(tagName, tabSize, attrsObj, nestingLevel, parentEl) {
      this.tagName = tagName;
      this.tabSize = tabSize;
      this.attrs = attrsObj;
      this.nestingLevel = nestingLevel;
      this.parentEl = parentEl;
    }
  }

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
    vscode.commands.registerCommand('selector-js.qs', () => {}),
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
