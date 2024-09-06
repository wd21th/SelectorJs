const { htmlElement } = require("../classes");
const { emptySpace } = require("../regex");
const setAttributes = require("./set-attributes");

/**
 * Description
 * @param {any} htmlEl
 * @param {any} arr
 * @param {any} nestingLevel
 * @param {any} parent
 * @returns {any}
 */
function nesting (htmlEl, arr, nestingLevel, parent) {
  if (htmlEl.childNodes == 0) {
    let tagName = htmlEl.rawTagName,
      attrs = htmlEl.rawAttrs, attrsObj = {}, tabs = emptySpace;
    if (attrs != emptySpace) {
      setAttributes(attrs, attrsObj);
    }
    if (parent) {
      let tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel, parent);

      arr.push(tag);
    } else {
      let tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel);

      arr.push(tag);
    }
  } else {
    let tagName = htmlEl.rawTagName,
      attrs = htmlEl.rawAttrs, attrsObj = {}, tabs = emptySpace;
    if (attrs != emptySpace) {
      setAttributes(attrs, attrsObj);
    }

    if (parent) {
      let tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel, parent);

      arr.push(tag);

      let parentEl = new parentElement(tagName, attrsObj);
      nestingLevel++;
      for (let i = 0; i < htmlEl.childNodes.length; i++) {
        nesting(htmlEl.childNodes[i], arr, nestingLevel, parentEl);
      }
    } else {
      let tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel, parent);
      arr.push(tag);
      let parentEl = new parentElement(tagName, attrsObj);
      nestingLevel++;
      for (let i = 0; i < htmlEl.childNodes.length; i++) {
        nesting(htmlEl.childNodes[i], arr, nestingLevel, parentEl);
      }
    }
  }
}

module.exports = nesting;