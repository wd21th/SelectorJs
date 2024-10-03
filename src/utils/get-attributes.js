let htmlParser = require('node-html-parser');

/**
 * Gives object from rawAttributes
 * @param { htmlParser.HTMLElement.rawAttrs } attrs
 * @returns { { [key: string]: string } }
 */
function getAttributes(attrs) {
  return attrs.match(/([a-zA-Z\d-_]+)(?==)/g).reduce((acc, attributeName, index) => {
    acc[attributeName] = attrs.match(/".+?"/g)[index];
    
    return acc;
  }, {});
}

module.exports = getAttributes;
