export class ExpressionError extends Error {
  constructor(message, position = null) {
    super(message);
    this.name = 'ExpressionError';
    this.position = position;
  }
}

const TOKEN_PATTERN = /\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|(.))/gy;
const SYMBOLS = '+-*/%^()=';
const RESERVED_NAME = /^t\d+$/i; // reservado para variables temporales

export function tokenize(source) {
  const tokens = [];
  TOKEN_PATTERN.lastIndex = 0;

  let match;
  while (TOKEN_PATTERN.lastIndex < source.length && (match = TOKEN_PATTERN.exec(source))) {
    const [text, number, name, symbol] = match;
    const position = TOKEN_PATTERN.lastIndex - text.trimStart().length;

    if (number) {
      tokens.push({ type: 'num', value: number, position });
    } else if (name) {
      if (RESERVED_NAME.test(name)) {
        throw new ExpressionError(`"${name}" está reservado para temporales; usa otro nombre`, position);
      }
      tokens.push({ type: 'id', value: name, position });
    } else if (SYMBOLS.includes(symbol)) {
      tokens.push({ type: 'op', value: symbol, position });
    } else {
      throw new ExpressionError(`Carácter no válido "${symbol}"`, position);
    }
  }
  return tokens;
}
