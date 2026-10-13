import { ExpressionError } from './tokenizer.js';


export function parse(tokens) {
  if (!tokens.length) throw new ExpressionError('Escribe una expresión para calcular');

  let index = 0;
  const peek = () => tokens[index];
  const next = () => tokens[index++];
  const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value);

  function fail(message) {
    const token = peek();
    const where = token ? `cerca de "${token.value}"` : 'al final de la expresión';
    throw new ExpressionError(`${message} ${where}`, token?.position ?? null);
  }

  function expect(symbol) {
    if (!isOp(symbol)) fail(`Se esperaba "${symbol}"`);
    return next();
  }

  const binaryLevel = (operators, operand) => () => {
    let left = operand();
    while (isOp(...operators)) {
      const op = next().value;
      left = { type: 'binary', op, left, right: operand() };
    }
    return left;
  };

  function primary() {
    const token = peek();
    if (!token) fail('Falta un operando');
    if (token.type === 'num') { next(); return { type: 'num', value: token.value }; }
    if (token.type === 'id') { next(); return { type: 'id', name: token.value }; }
    if (isOp('(')) {
      next();
      const inner = additive();
      expect(')');
      return inner;
    }
    return fail('Operando no válido');
  }

  function power() {
    const base = primary();
    if (!isOp('^')) return base;
    next();
    return { type: 'binary', op: '^', left: base, right: unary() };
  }

  function unary() {
    if (isOp('-')) { next(); return { type: 'unary', op: 'uminus', operand: unary() }; }
    if (isOp('+')) { next(); return unary(); }
    return power();
  }

  const multiplicative = binaryLevel(['*', '/', '%'], unary);
  const additive = binaryLevel(['+', '-'], multiplicative);

  function assignment() {
    const isAssignment = peek().type === 'id' && tokens[index + 1]?.value === '=';
    if (!isAssignment) return additive();
    const target = next().value;
    next();
    return { type: 'assign', target, value: additive() };
  }

  const tree = assignment();
  if (index < tokens.length) fail('Símbolo inesperado');
  return tree;
}
