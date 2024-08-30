module.exports = function createElementCommand () {
  let htmlObjs = [];
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

    let createElement = [];
    htmlObjs.forEach(item => {
      createElement.push(`const ${item.tagName} = document.createElement('${item.tagName}')`);
      for (const key in item.attrs) {
        if (key == 'class') {
          if (item.attrs[key].match(/\s/g)) {
            let classes = item.attrs[key].replace(/"/g, '').split(' ');
            for (let i = 0; i < classes.length; i++) {
              createElement.push(`${item.tagName}.classList.add("${classes[i]}")`);
            }
          } else {
            createElement.push(`${item.tagName}.classList.add("${item.attrs[key].replace(/"/g, '')}")`);
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
              /"/g,
              '',
            )}').appendChild(${item.tagName})`,
          );
        } else if (keys.includes('class')) {
          if (item.parentEl.attrs['class'].match(/\s/g)) {
            let fstClass = item.parentEl.attrs['class'].replace(/"/g, '').split(' ')[0];
            createElement.push(
              `document.querySelector('${item.parentEl.tagName}.${fstClass}').appendChild(${item.tagName})`,
            );
          } else {
            let fstClass = item.parentEl.attrs['class'].replace(/"/g, '');
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
      editBuilder.replace(selection, createElement.join('\n'));
    });
  }
}