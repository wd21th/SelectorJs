/**
 * Description
 * @param {any} classValue
 * @returns {any}
 */
function checkClassVarName (classValue) {
  classValue = classValue.replace(/"/g, '');

  if (classValue.match(/\s/g)) {
    let classes = classValue.split(' ');
    classes.filter(element => element != '');
    classValue = classes[0];
  }

  let varableName = classValue;
  if (varableName.match(/^\d+/m)) {
    const lengthOfDigits = varableName.match(/^\d+/m)[0].length;
    varableName = varableName.substring(lengthOfDigits);
  }

  if (varableName.match(/-/g)) {
    varableName = varableName.split('-');

    varableName.filter(element => element != '');

    for (let j = 1; j < varableName.length; j++) {
      varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1);
    }
    varableName = varableName.join('');
  }

  return varableName;
}

module.exports = checkClassVarName;