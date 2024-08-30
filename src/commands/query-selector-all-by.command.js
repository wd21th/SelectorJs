module.exports = function querySelectorAllByCommand () {
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

    let result = await vscode.window.showQuickPick(['id', 'class', 'name', 'tagName']);

    htmlObjs.forEach(item => {
      if (result == 'id') {
        if (item.attrs[result]) {
          let varableName = item.attrs[result].replace(/"/g, '');
          if (varableName.match(/^\d+/m)) {
            const lengthOfDigits = varableName.match(/^\d+/m)[0].length;
            varableName = varableName.substring(lengthOfDigits);
          }
          if (varableName.match(/-/g)) {
            varableName = varableName.split('-');
            for (let j = 1; j < varableName.length; j++) {
              varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
            }
            varableName = varableName.join('');
          }
          let varable = `${varableName}s = document.querySelectorAll('#${item.attrs[result].replace(/"/g, '')}')`;
          declarations.push(varable);
        }
      } else if (result == 'class') {
        if (item.attrs[result]) {
          let classValue = item.attrs[result].replace(/"/g, '');

          if (classValue.match(/\s/g)) {
            let classes = classValue.split(' ');
            classes.filter(element => element != '');
            classValue = classes[0];
          }

          let varableName = classValue;
          if (varableName.match(/^\d+/m)) {
            const lengthOfDigits = varableName.match(/^\d+/m)[0].length;
            varableName = varableName.substring(lengthOfDigits);
          }

          if (varableName.match(/-/g)) {
            varableName = varableName.split('-');

            varableName.filter(element => element != '');

            for (let j = 1; j < varableName.length; j++) {
              varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
            }
            varableName = varableName.join('');
          }

          let varable = `${varableName}s = document.getElementsByClassName('${classValue}')`;
          declarations.push(varable);
        }
      } else if (result == 'name') {
        if (item.attrs[result]) {
          let varableName = item.attrs[result].replace(/"/g, '');
          if (varableName.match(/^\d+/m)) {
            const lengthOfDigits = varableName.match(/^\d+/m)[0].length;
            varableName = varableName.substring(lengthOfDigits);
          }
          if (varableName.match(/-/g)) {
            varableName = varableName.split('-');
            for (let j = 1; j < varableName.length; j++) {
              varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
            }
            varableName = varableName.join('');
          }
          let varable = `${varableName}s = document.getElementsByName('${item.attrs[result].replace(/"/g, '')}')`;
          declarations.push(varable);
        }
      } else if (result == 'tagName') {
        let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`;
        declarations.push(varable);
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
}