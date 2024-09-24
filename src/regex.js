const contentBetweenAngleBrackets = /<.+?>/g,
  allDoubleQuotes = /"/g,
  multipleDigitsInBeginningOfEachRow = /^\d+/m,
  emptySpace = '',
  space = ' ',
  hyphen = '-',
  comma = ',',
  semicolon = ';',
  newLine = '\n';

module.exports = {
  contentBetweenAngleBrackets,
  allDoubleQuotes,
  multipleDigitsInBeginningOfEachRow,
  emptySpace,
  space,
  hyphen,
  comma,
  semicolon,
  newLine,
};
