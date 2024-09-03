const contentBetweenAngleBrackets = /<.+?>/g,
  allDoubleQuotes = /"/g,
  multipleDigitsInBeginningOfEachRow = /^\d+/m,
  emptySpace = '',
  space = ' ',
  hyphen = '-',
  comma = ',',
  newLine = '\n';

module.exports = {
  contentBetweenAngleBrackets,
  allDoubleQuotes,
  multipleDigitsInBeginningOfEachRow,
  emptySpace,
  space,
  hyphen,
  newLine,
}