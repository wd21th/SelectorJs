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
    vscode.commands.registerCommand('selector-js.ce', function () {
      let htmlObjs = [];
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        let html = document.getText(selection);
        html = html.match(contentBetweenAngleBrackets).join(emptySpace);
        let root = HTMLParser.parse(html);
        root.childNodes.forEach(item => {
          nesting(item, htmlObjs, 0, null);
        });

        let createElement = [];
        htmlObjs.forEach(item => {
          createElement.push(`const ${item.tagName} = document.createElement('${item.tagName}')`);
          for (const key in item.attrs) {
            if (key == 'class') {
              if (item.attrs[key].match(/\s/g)) {
                let classes = item.attrs[key].replace(allDoubleQuotes, emptySpace).split(space);
                for (let i = 0; i < classes.length; i++) {
                  createElement.push(`${item.tagName}.classList.add("${classes[i]}")`);
                }
              } else {
                createElement.push(`${item.tagName}.classList.add("${item.attrs[key].replace(allDoubleQuotes, emptySpace)}")`);
              }
            } else {
              createElement.push(`${item.tagName}.setAttribute("${key}",${item.attrs[key]})`);
            }
          }

          if (item.parentEl) {
            let keys = Object.keys(item.parentEl.attrs);

            if (keys.includes('id')) {
              createElement.push(
                `document.querySelector('${item.parentEl.tagName}#${item.parentEl.attrs['id'].replace(
                  allDoubleQuotes,
                  emptySpace,
                )}').appendChild(${item.tagName})`,
              );
            } else if (keys.includes('class')) {
              if (item.parentEl.attrs['class'].match(/\s/g)) {
                let fstClass = item.parentEl.attrs['class'].replace(allDoubleQuotes, emptySpace).split(space)[0];
                createElement.push(
                  `document.querySelector('${item.parentEl.tagName}.${fstClass}').appendChild(${item.tagName})`,
                );
              } else {
                let fstClass = item.parentEl.attrs['class'].replace(allDoubleQuotes, emptySpace);
                createElement.push(
                  `document.querySelector('${item.parentEl.tagName}.${fstClass}').appendChild(${item.tagName})`,
                );
              }
            } else {
              createElement.push(`document.querySelector('${item.parentEl.tagName}').appendChild(${item.tagName})`);
            }
          } else {
            createElement.push(`document.body.appendChild(${item.tagName})`);
          }

          createElement.push('//=====================================================');
        });

        editor.edit(editBuilder => {
          editBuilder.replace(selection, createElement.join(newLine));
        });
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qsby', async function () {
      let htmlObjs = [];
      let declarations = [];
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        let html = document.getText(selection);
        html = html.match(contentBetweenAngleBrackets).join(emptySpace);
        let root = HTMLParser.parse(html);
        root.childNodes.forEach(item => {
          nesting(item, htmlObjs, 0, null);
        });

        let result = await vscode.window.showQuickPick(['id', 'class', 'tagName']);

        htmlObjs.forEach(item => {
          if (result == 'id') {
            if (item.attrs[result]) {
              let varableName = item.attrs[result].replace(allDoubleQuotes, emptySpace);
              if (varableName.match(multipleDigitsInBeginningOfEachRow)) {
                const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
                varableName = varableName.substring(lengthOfDigits);
              }
              if (varableName.match(/-/g)) {
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

              if (classValue.match(/\s/g)) {
                let classes = classValue.split(space);
                classes.filter(element => element != emptySpace);
                classValue = classes[0];
              }

              let varableName = classValue;
              if (varableName.match(multipleDigitsInBeginningOfEachRow)) {
                const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
                varableName = varableName.substring(lengthOfDigits);
              }

              if (varableName.match(/-/g)) {
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
            item.tabSize = '/' + tabs + '/';
          }
        });

        for (let i = 1; i < declarations.length; i++) {
          declarations[i] = htmlObjs[i].tabSize + declarations[i];
        }
        let finalString;
        if (declarations.length == 1) {
          finalString = 'const ' + declarations[0] + ';';
        } else {
          finalString = 'const \n' + declarations.join(',\n') + ';';
        }

        ncp.copy(finalString, function () {
          vscode.window.showInformationMessage('OK');
        });
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qsaby', async function () {
      let htmlObjs = [];
      let declarations = [];
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        let html = document.getText(selection);
        html = html.match(contentBetweenAngleBrackets).join(emptySpace);
        let root = HTMLParser.parse(html);
        root.childNodes.forEach(item => {
          nesting(item, htmlObjs, 0, null);
        });

        let result = await vscode.window.showQuickPick(['id', 'class', 'name', 'tagName']);

        htmlObjs.forEach(item => {
          if (result == 'id') {
            if (item.attrs[result]) {
              let varableName = item.attrs[result].replace(allDoubleQuotes, emptySpace);
              if (varableName.match(multipleDigitsInBeginningOfEachRow)) {
                const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
                varableName = varableName.substring(lengthOfDigits);
              }
              if (varableName.match(/-/g)) {
                varableName = varableName.split(hyphen);
                for (let j = 1; j < varableName.length; j++) {
                  varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
                }
                varableName = varableName.join(emptySpace);
              }
              let varable = `${varableName}s = document.querySelectorAll('#${item.attrs[result].replace(allDoubleQuotes, emptySpace)}')`;
              declarations.push(varable);
            }
          } else if (result == 'class') {
            if (item.attrs[result]) {
              let classValue = item.attrs[result].replace(allDoubleQuotes, emptySpace);

              if (classValue.match(/\s/g)) {
                let classes = classValue.split(space);
                classes.filter(element => element != emptySpace);
                classValue = classes[0];
              }

              let varableName = classValue;
              if (varableName.match(multipleDigitsInBeginningOfEachRow)) {
                const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
                varableName = varableName.substring(lengthOfDigits);
              }

              if (varableName.match(/-/g)) {
                varableName = varableName.split(hyphen);

                varableName.filter(element => element != emptySpace);

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
              if (varableName.match(multipleDigitsInBeginningOfEachRow)) {
                const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
                varableName = varableName.substring(lengthOfDigits);
              }
              if (varableName.match(/-/g)) {
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

        const tab = '**';
        htmlObjs.forEach(item => {
          let tabs = emptySpace;
          for (let i = 0; i < item.nestingLevel; i++) {
            tabs += tab;
          }
          if (tabs != emptySpace) {
            item.tabSize = '/' + tabs + '/';
          }
        });

        for (let i = 1; i < declarations.length; i++) {
          declarations[i] = htmlObjs[i].tabSize + declarations[i];
        }

        let finalString;
        if (declarations.length == 1) {
          finalString = 'const ' + declarations[0] + ';';
        } else {
          finalString = 'const \n' + declarations.join(',\n') + ';';
        }

        ncp.copy(finalString, function () {
          vscode.window.showInformationMessage('OK');
        });
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qswd', function () {
      let htmlObjs = [];
      let declarations = [];
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        let html = document.getText(selection);
        html = html.match(contentBetweenAngleBrackets).join(emptySpace);
        let root = HTMLParser.parse(html);
        root.childNodes.forEach(item => {
          nesting(item, htmlObjs, 0, null);
        });

        htmlObjs.forEach(item => {
          const keys = Object.keys(item.attrs);
          if (keys.includes('id')) {
            let varableName = checkIdVarName(item.attrs['id']);
            if (item.parentEl) {
              let tagNameOfParent = item.parentEl.tagName;

              if (Object.keys(item.parentEl.attrs).length != 0) {
                let attrsOfParent = item.parentEl.attrs;
                let keysOfParent = Object.keys(attrsOfParent);
                if (keysOfParent.includes('id')) {
                  let parentIdAttrsV = attrsOfParent['id'].replace(allDoubleQuotes, emptySpace);
                  let childIdAttrsV = item.attrs['id'].replace(allDoubleQuotes, emptySpace);

                  let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}#${childIdAttrsV}')`;
                  declarations.push(varable);
                } else if (keysOfParent.includes('class')) {
                  let parentclassAttrsV = attrsOfParent['class'].replace(allDoubleQuotes, emptySpace);

                  if (parentclassAttrsV.match(/\s/g)) {
                    let classes = parentclassAttrsV.split(space);

                    classes.filter(element => element != emptySpace);

                    parentclassAttrsV = classes[0];
                  }

                  let childIdAttrsV = item.attrs['id'].replace(allDoubleQuotes, emptySpace);

                  let varable = `${varableName} = document.querySelector('${tagNameOfParent}.${parentclassAttrsV} ${item.tagName}#${childIdAttrsV}')`;
                  declarations.push(varable);
                }
              } else {
                let childIdAttrsV = item.attrs['id'].replace(allDoubleQuotes, emptySpace);
                let varable = `${varableName} = document.querySelector('${tagNameOfParent} ${item.tagName}#${childIdAttrsV}')`;
                declarations.push(varable);
              }
            } else {
              let varable = `${varableName} = document.querySelector('${item.tagName}#${item.attrs['id'].replace(
                allDoubleQuotes,
                emptySpace,
              )}')`;
              declarations.push(varable);
            }

          } else if (keys.includes('class')) {
            let varableName = checkClassVarName(item.attrs['class']);

            if (item.parentEl) {
              let tagNameOfParent = item.parentEl.tagName;

              if (Object.keys(item.parentEl.attrs).length != 0) {
                let attrsOfParent = item.parentEl.attrs;
                let keysOfParent = Object.keys(attrsOfParent);

                if (keysOfParent.includes('id')) {
                  let parentIdAttrsV = attrsOfParent['id'].replace(allDoubleQuotes, emptySpace);
                  let childClassAttrsV = item.attrs['class'].replace(allDoubleQuotes, emptySpace);

                  let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}.${childClassAttrsV}')`;
                  declarations.push(varable);
                } else if (keysOfParent.includes('class')) {
                  let parentclassAttrsV = attrsOfParent['class'].replace(allDoubleQuotes, emptySpace);

                  if (parentclassAttrsV.match(/\s/g)) {
                    let classes = parentclassAttrsV.split(space);

                    classes.filter(element => element != emptySpace);

                    parentclassAttrsV = classes[0];
                  }

                  let childClassAttrsV = item.attrs['class'].replace(allDoubleQuotes, emptySpace);

                  let varable = `${varableName} = document.querySelector('${tagNameOfParent}.${parentclassAttrsV} ${item.tagName}.${childClassAttrsV}')`;
                  declarations.push(varable);
                }
              } else {
                let varable = `${varableName} = document.querySelector('${tagNameOfParent} ${item.tagName}.${item.attrs[
                  'class'
                ].replace(allDoubleQuotes, emptySpace)}')`;
                declarations.push(varable);
              }
            } else {
              let varable = `${varableName} = document.querySelector('${item.tagName}.${item.attrs['class'].replace(
                allDoubleQuotes,
                emptySpace,
              )}')`;
              declarations.push(varable);
            }
          } else {
            let varableName = item.tagName;

            if (item.parentEl) {
              let tagNameOfParent = item.parentEl.tagName;
              if (Object.keys(item.parentEl.attrs).length != 0) {
                let attrsOfParent = item.parentEl.attrs;

                let keysOfParent = Object.keys(attrsOfParent);

                if (keysOfParent.includes('id')) {
                  let parentIdAttrsV = attrsOfParent['id'].replace(allDoubleQuotes, emptySpace);

                  let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}')`;
                  declarations.push(varable);
                } else if (keysOfParent.includes('class')) {
                  let parentclassAttrsV = attrsOfParent['class'].replace(allDoubleQuotes, emptySpace);

                  if (parentclassAttrsV.match(/\s/g)) {
                    let classes = parentclassAttrsV.split(space);

                    classes.filter(element => element != emptySpace);

                    parentclassAttrsV = classes[0];
                  }

                  let varable = `${varableName} = document.querySelector('${tagNameOfParent}.${parentclassAttrsV} ${item.tagName}')`;
                  declarations.push(varable);
                }
              } else {
                let varable = `${varableName} = document.querySelector('${tagNameOfParent} ${item.tagName}')`;
                declarations.push(varable);
              }
            } else {
              let varable = `${varableName} = document.querySelector('${item.tagName}')`;
              declarations.push(varable);
            }
          }
        });

        const tab = '**';
        htmlObjs.forEach(item => {
          let tabs = emptySpace;
          for (let i = 0; i < item.nestingLevel; i++) {
            tabs += tab;
          }
          if (tabs != emptySpace) {
            item.tabSize = '/' + tabs + '/';
          }
        });

        for (let i = 0; i < declarations.length; i++) {
          declarations[i] = htmlObjs[i].tabSize + declarations[i];
        }

        let finalString;
        if (declarations.length == 1) {
          finalString = 'const ' + declarations.join(',\n') + ';';
        } else {
          finalString = 'const \n' + declarations.join(',\n') + ';';
        }
        ncp.copy(finalString, function () {
          vscode.window.showInformationMessage('OK');
        });
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qs', function () {
      let htmlObjs = [];
      let declarations = [];
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        let html = document.getText(selection);
        html = html.match(contentBetweenAngleBrackets).join(emptySpace);
        let root = HTMLParser.parse(html);
        root.childNodes.forEach(item => {
          nesting(item, htmlObjs, 0, null);
        });

        htmlObjs.forEach(item => {
          if (Object.keys(item.attrs).length != 0) {
            if (item.tagName == 'button') {
              buttonCorrect(item, declarations);
            } else {
              qs(item, declarations);
            }
          } else {
            if (item.tagName == 'button') {
              let varable = `btn = document.querySelector('${item.tagName}')`;
              declarations.push(varable);
            } else {
              let varable = `${item.tagName} = document.querySelector('${item.tagName}')`;
              declarations.push(varable);
            }
          }
        });

        const tab = '**';
        htmlObjs.forEach(item => {
          let tabs = emptySpace;
          for (let i = 0; i < item.nestingLevel; i++) {
            tabs += tab;
          }
          if (tabs != emptySpace) {
            item.tabSize = '/' + tabs + '/';
          }
        });

        for (let i = 0; i < declarations.length; i++) {
          declarations[i] = htmlObjs[i].tabSize + declarations[i];
        }

        let finalString;
        if (declarations.length == 1) {
          finalString = 'const ' + declarations.join(',\n') + ';';
        } else {
          finalString = 'const \n' + declarations.join(',\n') + ';';
        }
        ncp.copy(finalString, function () {
          vscode.window.showInformationMessage('OK');
        });
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qsa', function () {
      let htmlObjs = [];
      let declarations = [];
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        let html = document.getText(selection);
        html = html.match(contentBetweenAngleBrackets).join(emptySpace);
        let root = HTMLParser.parse(html);
        root.childNodes.forEach(item => {
          nesting(item, htmlObjs, 0, null);
        });

        htmlObjs.forEach(item => {
          if (Object.keys(item.attrs).length != 0) {
            if (item.tagName == 'button') {
              buttonAllCorrect(item, declarations);
            } else {
              qsa(item, declarations);
            }
          } else {
            if (item.tagName == 'button') {
              let varable = `btns = document.getElementsByTagName('${item.tagName}')`;
              declarations.push(varable);
            } else {
              let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`;
              declarations.push(varable);
            }
          }
        });

        const tab = '**';
        htmlObjs.forEach(item => {
          let tabs = emptySpace;
          for (let i = 0; i < item.nestingLevel; i++) {
            tabs += tab;
          }
          if (tabs != emptySpace) {
            item.tabSize = '/' + tabs + '/';
          }
        });

        for (let i = 0; i < declarations.length; i++) {
          declarations[i] = htmlObjs[i].tabSize + declarations[i];
        }

        let finalString;
        if (declarations.length == 1) {
          finalString = 'const ' + declarations.join(',\n') + ';';
        } else {
          finalString = 'const \n' + declarations.join(',\n') + ';';
        }
        ncp.copy(finalString, function () {
          vscode.window.showInformationMessage('OK');
        });
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('selector-js.qswe', async function () {
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
          nesting(item, htmlObjs, 0, null);
        });

        htmlObjs.forEach(item => {
          qs(item, declarations);
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
    }),
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
