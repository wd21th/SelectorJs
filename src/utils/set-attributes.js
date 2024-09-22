let htmlParser = require('node-html-parser');

/**
 * Gives object from rawAttributes
 * @param { htmlParser.HTMLElement.rawAttrs } attrs
 * @returns { { [key: string]: string } }
 */
function setAttributes (attrs) {
  return attrs.match(/([a-zA-Z\d-_]+)(?==)/g).reduce((acc, attributeName, index) => {
    acc[attributeName] = attrs.match(/".+?"/g)[index]
  }, {})
}

module.exports = setAttributes;