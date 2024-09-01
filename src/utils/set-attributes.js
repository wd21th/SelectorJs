/**
 * Description
 * @param {any} attrs
 * @param {any} attrsObj
 * @returns {any}
 */
function setAttributes (attrs, attrsObj) {
  for (let i = 0; i < attrs.match(/([a-zA-Z\d-_]+)(?==)/g).length; i++) {
    let attributeName = attrs.match(/([a-zA-Z\d-_]+)(?==)/g)[i],
      attributeValue = attrs.match(/".+?"/g)[i];

    attrsObj[attributeName] = attributeValue;
  }
}

module.exports = setAttributes;