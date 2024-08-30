module.exports = function querySelectorCommand () {
  let htmlObjs = [];
  let declarations = [];
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;
    let html = document.getText(selection);
    html = html.match(/<.+?>/g).join('');
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
      let tabs = '';
      for (let i = 0; i < item.nestingLevel; i++) {
        tabs += tab;
      }
      if (tabs != '') {
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
}