const vscode = require('vscode');
const ncp = require('copy-paste');
const { emptySpace, contentBetweenAngleBrackets, newLine, space, allDoubleQuotes } = require('./../regex');
const { getSelection, buildHtmlTree, checkIdVarName, checkClassVarName } = require('../utils');

/**
 * Generates detailed querySelector commands with variables
 * @returns {void}
 */
function querySelectorWithDetailsCommand () {
  let declarations = [];
  let htmlObjs = getSelection()
    .childNodes.map(item => {
      return buildHtmlTree(item);
    })
    .flat(Infinity);

  htmlObjs.forEach(item => {
    const keys = Object.keys(item.attrs);
    if (keys.includes('id')) {
      let varableName = checkIdVarName(item.attrs['id']);
      if (item.parentEl) {
        let tagNameOfParent = item.parentEl.tagName;

        if (Object.keys(item.parentEl.attrs).length !== 0) {
          let attrsOfParent = item.parentEl.attrs;
          let keysOfParent = Object.keys(attrsOfParent);
          if (keysOfParent.includes('id')) {
            let parentIdAttrsV = attrsOfParent['id'].replace(allDoubleQuotes, emptySpace);
            let childIdAttrsV = item.attrs['id'].replace(allDoubleQuotes, emptySpace);

            let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}#${childIdAttrsV}')`;
            declarations.push(varable);
          } else if (keysOfParent.includes('class')) {
            let parentclassAttrsV = attrsOfParent['class'].replace(allDoubleQuotes, emptySpace);

            if (parentclassAttrsV.includes(space)) {
              let classes = parentclassAttrsV.split(space);

              classes.filter(element => element !== emptySpace);

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

        if (Object.keys(item.parentEl.attrs).length !== 0) {
          let attrsOfParent = item.parentEl.attrs;
          let keysOfParent = Object.keys(attrsOfParent);

          if (keysOfParent.includes('id')) {
            let parentIdAttrsV = attrsOfParent['id'].replace(allDoubleQuotes, emptySpace);
            let childClassAttrsV = item.attrs['class'].replace(allDoubleQuotes, emptySpace);

            let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}.${childClassAttrsV}')`;
            declarations.push(varable);
          } else if (keysOfParent.includes('class')) {
            let parentclassAttrsV = attrsOfParent['class'].replace(allDoubleQuotes, emptySpace);

            if (parentclassAttrsV.includes(space)) {
              let classes = parentclassAttrsV.split(space);

              classes.filter(element => element !== emptySpace);

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
        if (Object.keys(item.parentEl.attrs).length !== 0) {
          let attrsOfParent = item.parentEl.attrs;

          let keysOfParent = Object.keys(attrsOfParent);

          if (keysOfParent.includes('id')) {
            let parentIdAttrsV = attrsOfParent['id'].replace(allDoubleQuotes, emptySpace);

            let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}')`;
            declarations.push(varable);
          } else if (keysOfParent.includes('class')) {
            let parentclassAttrsV = attrsOfParent['class'].replace(allDoubleQuotes, emptySpace);

            if (parentclassAttrsV.includes(space)) {
              let classes = parentclassAttrsV.split(space);

              classes.filter(element => element !== emptySpace);

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

  const tab = '\t';
  htmlObjs.forEach(item => {
    let tabs = emptySpace;
    for (let i = 0; i < item.nestingLevel; i++) {
      tabs += tab;
    }
    if (tabs !== emptySpace) {
      item.tabSize = tabs;
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

module.exports = querySelectorWithDetailsCommand;
