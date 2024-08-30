module.exports = function querySelectorWithDetailsCommand () {
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
      const keys = Object.keys(item.attrs);
      if (keys.includes('id')) {
        let varableName = checkIdVarName(item.attrs['id']);
        if (item.parentEl) {
          let tagNameOfParent = item.parentEl.tagName;

          if (Object.keys(item.parentEl.attrs).length != 0) {
            let attrsOfParent = item.parentEl.attrs;
            let keysOfParent = Object.keys(attrsOfParent);
            if (keysOfParent.includes('id')) {
              let parentIdAttrsV = attrsOfParent['id'].replace(/"/g, '');
              let childIdAttrsV = item.attrs['id'].replace(/"/g, '');

              let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}#${childIdAttrsV}')`;
              declarations.push(varable);
            } else if (keysOfParent.includes('class')) {
              let parentclassAttrsV = attrsOfParent['class'].replace(/"/g, '');

              if (parentclassAttrsV.match(/\s/g)) {
                let classes = parentclassAttrsV.split(' ');

                classes.filter(element => element != '');

                parentclassAttrsV = classes[0];
              }

              let childIdAttrsV = item.attrs['id'].replace(/"/g, '');

              let varable = `${varableName} = document.querySelector('${tagNameOfParent}.${parentclassAttrsV} ${item.tagName}#${childIdAttrsV}')`;
              declarations.push(varable);
            }
          } else {
            let childIdAttrsV = item.attrs['id'].replace(/"/g, '');
            let varable = `${varableName} = document.querySelector('${tagNameOfParent} ${item.tagName}#${childIdAttrsV}')`;
            declarations.push(varable);
          }
        } else {
          let varable = `${varableName} = document.querySelector('${item.tagName}#${item.attrs['id'].replace(
            /"/g,
            '',
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
              let parentIdAttrsV = attrsOfParent['id'].replace(/"/g, '');
              let childClassAttrsV = item.attrs['class'].replace(/"/g, '');

              let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}.${childClassAttrsV}')`;
              declarations.push(varable);
            } else if (keysOfParent.includes('class')) {
              let parentclassAttrsV = attrsOfParent['class'].replace(/"/g, '');

              if (parentclassAttrsV.match(/\s/g)) {
                let classes = parentclassAttrsV.split(' ');

                classes.filter(element => element != '');

                parentclassAttrsV = classes[0];
              }

              let childClassAttrsV = item.attrs['class'].replace(/"/g, '');

              let varable = `${varableName} = document.querySelector('${tagNameOfParent}.${parentclassAttrsV} ${item.tagName}.${childClassAttrsV}')`;
              declarations.push(varable);
            }
          } else {
            let varable = `${varableName} = document.querySelector('${tagNameOfParent} ${item.tagName}.${item.attrs[
              'class'
            ].replace(/"/g, '')}')`;
            declarations.push(varable);
          }
        } else {
          let varable = `${varableName} = document.querySelector('${item.tagName}.${item.attrs['class'].replace(
            /"/g,
            '',
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
              let parentIdAttrsV = attrsOfParent['id'].replace(/"/g, '');

              let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}')`;
              declarations.push(varable);
            } else if (keysOfParent.includes('class')) {
              let parentclassAttrsV = attrsOfParent['class'].replace(/"/g, '');

              if (parentclassAttrsV.match(/\s/g)) {
                let classes = parentclassAttrsV.split(' ');

                classes.filter(element => element != '');

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