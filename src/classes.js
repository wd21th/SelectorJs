/**
 * Description
 * @param {any} tagName
 * @param {any} attrsObj
 * @returns {any}
 */
class parentElement {
  constructor(tagName, attrsObj) {
    this.tagName = tagName;
    this.attrs = attrsObj;
  }
}

/**
 * Description
 * @param {any} tagName
 * @param {any} tabSize
 * @param {any} attrsObj
 * @param {any} nestingLevel
 * @param {any} parentEl
 * @returns {any}
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