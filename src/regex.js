const contentBetweenAngleBrackets = /<.+?>/g,
  allDoubleQuotes = /"/g,
  anyFirstSymbol = /^./,
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
  anyFirstSymbol,
  emptySpace,
  space,
  hyphen,
  comma,
  semicolon,
  newLine,
};
