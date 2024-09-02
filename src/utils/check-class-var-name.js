/**
 * Description
 * @param {any} classValue
 * @returns {any}
 */
function checkClassVarName (classValue) {
  classValue = classValue.replace(allDoubleQuotes, emptySpace);

  if (classValue.match(/\s/g)) {
    let classes = classValue.split(' ');
    classes.filter(element => element != emptySpace);
    classValue = classes[0];
  }

  let varableName = classValue;
  if (varableName.match(multipleDigitsInBeginningOfEachRow)) {
    const lengthOfDigits = varableName.match(multipleDigitsInBeginningOfEachRow)[0].length;
    varableName = varableName.substring(lengthOfDigits);
  }

  if (varableName.match(/-/g)) {
    varableName = varableName.split(hyphen);

    varableName.filter(element => element != emptySpace);

    for (let j = 1; j < varableName.length; j++) {
      varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
    }
    varableName = varableName.join(emptySpace);
  }

  return varableName;
}

module.exports = checkClassVarName;