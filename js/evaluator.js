import { ExpressionError } from './tokenizer.js';

const checkZero = (b) => {
  if (b === 0) throw new ExpressionError('No se puede dividir entre cero');
  return b;
};

const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / checkZero(b),
  '%': (a, b) => a % checkZero(b),
  '^': (a, b) => a ** b,
  uminus: (a) => -a,
  '=': (a) => a,
};

const isLiteral = (arg) => /^\d/.test(arg);

export function evaluate(quadruples, output) {
  const values = new Map();
  const read = (arg) => (isLiteral(arg) ? Number(arg) : values.get(arg));

  const steps = quadruples.map(({ op, arg1, arg2, result }) => {
    const operands = [arg1, arg2].filter((arg) => arg !== null).map(read);
    if (operands.includes(undefined)) return null;

    const value = OPERATIONS[op](...operands);
    if (!Number.isFinite(value)) throw new ExpressionError('El resultado no es un número real');
    values.set(result, value);
    return value;
  });

  return { steps, result: read(output) ?? null };
}
