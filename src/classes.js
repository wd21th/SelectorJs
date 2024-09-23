/**
 * Represents a parent HTML element in the tree structure.
 * 
 * This class is used to store the basic details of a parent HTML element, 
 * including its tag name and attributes. It's useful for keeping track 
 * of hierarchical relationships between HTML elements during tree traversal.
 * 
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
 * Represents an HTML element with detailed information about its structure.
 * 
 * This class is used to store various properties of an HTML element, including 
 * its tag name, attributes, nesting level (depth in the DOM tree), and parent element.
 * It's used to build a hierarchical representation of an HTML document.
 * 
 * @param {string} tagName
 * @param {string} tabSize
 * @param { { [key: string]: any } } attrsObj
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