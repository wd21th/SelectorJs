const vscode = require('vscode');
const { emptySpace, contentBetweenAngleBrackets, newLine, allDoubleQuotes, space } = require('./../regex');
const { nesting, getSelection } = require('../utils');

/**
 * Description
 * @returns {any}
 */
function createElementCommand () {
  let htmlObjs = [];
  getSelection().childNodes.forEach(item => {
    nesting(item);
  });

  let createElement = [];
  htmlObjs.forEach(item => {
    createElement.push(`const ${item.tagName} = document.createElement('${item.tagName}')`);
    for (const key in item.attrs) {
      if (key == 'class') {
        if (item.attrs[key].includes(space)) {
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
          let fstClass = item.parentEl.attrs['class'].replace(allDoubleQuotes, emptySpace).split(' ')[0];
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

module.exports = createElementCommand;