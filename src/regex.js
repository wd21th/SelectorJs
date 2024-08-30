const contentBetweenAngleBrackets = /<.+?>/g,
  allDoubleQuotes = /"/g,
  multipleDigitsInBeginningOfEachRow = /^\d+/m,
  emptySpace = '',
  space = ' ',
  hyphen = '-',
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