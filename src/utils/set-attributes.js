/**
 * Description
 * @param {any} attrs
 * @returns { { [key: string]: string } }
 */
function setAttributes (attrs) {
  return attrs.match(/([a-zA-Z\d-_]+)(?==)/g).reduce((acc, attributeName, index) => {
    acc[attributeName] = attrs.match(/".+?"/g)[index]
  }, {})
}

module.exports = setAttributes;