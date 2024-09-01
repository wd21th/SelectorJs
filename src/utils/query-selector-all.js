/**
 * Description
 * @param {any} item
 * @param {any} arr
 * @returns {any}
 */
function qsa (item, arr) {
  let keys = Object.keys(item.attrs);
  if (keys.includes('id')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let id = item.attrs['id'].replace(/\"/g, '');
    let varable = `${varableName}s = document.querySelectorAll('#${id}')`;
    arr.push(varable);
  } else if (keys.includes('class')) {
    let varableName = checkClassVarName(item.attrs['class']);
    let classV = item.attrs['class'].replace(/\"/g, '');
    let varable = `${varableName}s = document.getElementsByClassName('${classV}')`;
    arr.push(varable);
  } else if (keys.includes('name')) {
    let varableName = checkIdVarName(item.attrs['id']);
    let name = item.attrs['name'].replace(/\"/g, '');
    let varable = `${varableName}s = document.getElementsByName('${name}')`;
    arr.push(varable);
  } else {
    let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`;
    arr.push(varable);
  }
}

module.exports = qsa;