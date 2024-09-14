const vscode = require('vscode');
const ncp = require('copy-paste');
const { emptySpace, contentBetweenAngleBrackets, newLine } = require('./../regex');
const { nesting, querySelector } = require('../utils');

/**
 * Generates querySelector commands with variables and event
 * @returns {void}
 */
async function querySelectorWithEventCommand () {
  let htmlObjs = [];
  let declarations = [];
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    let result = await vscode.window.showQuickPick(
      [
        'altKey',
        'abort',
        'animationstart',
        'animationend',
        'animationiteration',
        'animationName',
        'afterprint',
        'bubbles',
        'beforeprint',
        'beforeunload',
        'button',
        'buttons',
        'blur',
        'cancelable',
        'currentTarget',
        'copy',
        'cut',
        'ctrlKey',
        'click',
        'change',
        'charCode',
        'clientX',
        'clientY',
        'canplay',
        'canplaythrough',
        'contextmenu',
        'defaultPrevented',
        'drag',
        'dragend',
        'dragenter',
        'dragleave',
        'dragover',
        'dragstart',
        'drop',
        'detail',
        'dblclick',
        'deltaX',
        'deltaY',
        'deltaZ',
        'deltaMode',
        'durationchange',
        'eventPhase',
        'error',
        'emptied',
        'ended',
        'elapsedTime',
        'hashchange',
        'pageshow',
        'pagehide',
        'paste',
        'pause',
        'play',
        'playing',
        'progress',
        'propertyName',
        'popstate',
        'persisted',
        'mouseover',
        'mouseleave',
        'mouseout',
        'mouseenter',
        'metaKey',
        'key',
        'keyCode',
        'keyup',
        'keydown',
        'keypress',
        'load',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'location',
        'message',
        'unload',
        'open',
        'online',
        'offline',
        'oldURL',
        'resize',
        'reset',
        'relatedTarget',
        'ratechange',
        'storage',
        'show',
        'scroll',
        'search',
        'select',
        'submit',
        'screenX',
        'screenY',
        'shiftKey',
        'seeked',
        'seeking',
        'stalled',
        'suspend',
        'timeupdate',
        'transitionend',
        'toggle',
        'target',
        'timeStamp',
        'type',
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel',
        'volumechange',
        'view',
        'focus',
        'focusin',
        'focusout',
        'input',
        'invalid',
        'isTrusted',
        'newURL',
        'which',
        'wheel',
        'waiting',
      ],
      {},
    );

    let html = document.getText(selection);
    html = html.match(contentBetweenAngleBrackets).join(emptySpace);
    let root = HTMLParser.parse(html);

    root.childNodes.forEach(item => {
      nesting(item);
    });

    htmlObjs.forEach(item => {
      declarations = querySelector(item);
    });

    for (let i = 0; i < declarations.length; i++) {
      let declare = declarations[i].match(/([a-zA-Z\d-_]+)(?=\s=)/g)[0];

      declarations[i] = `const ${declarations[i]}
function ${result}On${declare[0].toUpperCase() + declare.substring(1)}(event) {
	console.log(event.type);
}
${declare}.addEventListener("${result}", ${result}On${declare[0].toUpperCase() + declare.substring(1)})
// =====================================================\n`;
    }

    ncp.copy(declarations.join(newLine), function () {
      vscode.window.showInformationMessage('OK');
    });
  }
}

module.exports = querySelectorWithEventCommand;