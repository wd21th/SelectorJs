/**
 * Description
 * @param {any} idValue
 * @returns {any}
 */
function checkIdVarName (idValue) {
  let varableName = idValue.replace(/"/g, '');

  if (varableName.match(/^\d+/m)) {
    const lengthOfDigits = varableName.match(/^\d+/m)[0].length;
    varableName = varableName.substring(lengthOfDigits);
  }

  if (varableName.match(/-/g)) {
    varableName = varableName.split('-');
    for (let j = 1; j < varableName.length; j++) {
      varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
    }
    varableName = varableName.join('');
  }
  return varableName;
}

module.exports = checkIdVarName;