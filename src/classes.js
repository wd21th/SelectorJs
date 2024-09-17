/**
 * Description
 * @param {string} tagName
 * @param {string} attrsObj
 */
class parentElement {
  constructor(tagName, attrsObj) {
    this.tagName = tagName;
    this.attrs = attrsObj;
  }
}

/**
 * Description
 * @param {string} tagName
 * @param {string} tabSize
 * @param {any} attrsObj
 * @param {number} nestingLevel
 * @param {string} parentEl
 */
class htmlElement {
  constructor(tagName, tabSize, attrsObj, nestingLevel, parentEl) {
    this.tagName = tagName;
    this.tabSize = tabSize;
    this.attrs = attrsObj;
    this.nestingLevel = nestingLevel;
    this.parentEl = parentEl;
  }
}

module.exports = {
  parentElement,
  htmlElement
}