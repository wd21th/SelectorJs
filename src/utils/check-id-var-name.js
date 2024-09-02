/**
 * Description
 * @param {any} idValue
 * @returns {any}
 */
function checkIdVarName (idValue) {
  let varableName = idValue.replace(allDoubleQuotes, emptySpace);

  if (varableName.match(multipleDigitsInBeginningOfEachRow)) {
    const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
    varableName = varableName.substring(lengthOfDigits);
  }

  if (varableName.match(/-/g)) {
    varableName = varableName.split(hyphen);
    for (let j = 1; j < varableName.length; j++) {
      varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
    }
    varableName = varableName.join(emptySpace);
  }
  return varableName;
}

module.exports = checkIdVarName;