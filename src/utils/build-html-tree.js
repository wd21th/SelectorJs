const { htmlElement, parentElement } = require('../classes');
const { emptySpace } = require('../regex');
const setAttributes = require('./set-attributes');
let htmlParser = require('node-html-parser');

/**
 * Recursively processes an HTML element and its children, building a nested representation of the elements.
 *
 * This function parses an HTML element and its attributes, recursively traverses its child nodes, and constructs
 * a nested array of custom `htmlElement` objects representing the structure of the HTML tree. Each element
 * includes details such as the tag name, attributes, nesting level, and parent element.
 * @param {htmlParser.HTMLElement} htmlEl
 * @param {Array<htmlElement>} arr
 * @param {number} nestingLevel
 * @param {parentElement} parent
 * @returns {Array<any>}
 */
function buildHtmlTree(htmlEl, arr = [], nestingLevel = 0, parent = null) {
  let tagName = htmlEl.rawTagName,
    attrs = htmlEl.rawAttrs,
    attrsObj = {},
    tabs = emptySpace;

  if (attrs != emptySpace) {
    attrsObj = setAttributes(attrs);
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
      return buildHtmlTree(htmlEl.childNodes[i], [...arr], nestingLevel, parentEl);
    });

    return map;
  }
}

module.exports = buildHtmlTree;
