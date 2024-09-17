const { htmlElement, parentElement } = require("../classes");
const { emptySpace } = require("../regex");
const setAttributes = require("./set-attributes");
let htmlParser = require('node-html-parser');

/**
 * Description
 * @param {htmlParser.HTMLElement} htmlEl
 * @param {Array<htmlElement>} arr
 * @param {number} nestingLevel
 * @param {parentElement} parent
 * @returns {Array<any>}
 */
function nesting (htmlEl, arr = [], nestingLevel = 0, parent = null) {
  let tagName = htmlEl.rawTagName,
    attrs = htmlEl.rawAttrs, attrsObj = {}, tabs = emptySpace;

  if (attrs != emptySpace) {
    setAttributes(attrs, attrsObj);
  }

  if (htmlEl.childNodes.length == 0) {
    let tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel, parent);
    arr.push(tag);
    return [...arr];
  } else {
    let tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel, parent);
    arr.push(tag);
    let parentEl = new parentElement(tagName, attrsObj);
    nestingLevel++;
    
    const map = htmlEl.childNodes.map((el, i) => {
      return nesting(htmlEl.childNodes[i], [...arr], nestingLevel, parentEl);
    })
    
    return map;
  }
}

module.exports = nesting;