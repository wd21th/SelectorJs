const { emptySpace, contentBetweenAngleBrackets, newLine } = require('./../regex');

/**
 * Description
 * @returns {any}
 */
function querySelectorAllCommand () {
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
        item.tabSize = `/${tabs}/`;
      }
    });

    for (let i = 0; i < declarations.length; i++) {
      declarations[i] = htmlObjs[i].tabSize + declarations[i];
    }

    let finalString;
    if (declarations.length == 1) {
      finalString = `const ${declarations.join(',\n')};`;
    } else {
      finalString = `const ${newLine}${declarations.join(',\n')};`;
    }
    ncp.copy(finalString, function () {
      vscode.window.showInformationMessage('OK');
    });
  }
}

module.exports = querySelectorAllCommand;