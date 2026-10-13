export function generateQuadruples(tree) {
  const quadruples = [];
  let tempCount = 0;

  const emit = (op, arg1, arg2, result) => {
    quadruples.push({ op, arg1, arg2, result });
    return result;
  };
  const newTemp = () => `t${++tempCount}`;

  function visit(node) {
    switch (node.type) {
      case 'num': return node.value;
      case 'id': return node.name;
      case 'unary': {
        const operand = visit(node.operand);
        return emit(node.op, operand, null, newTemp());
      }
      case 'binary': {
        const left = visit(node.left);
        const right = visit(node.right);
        return emit(node.op, left, right, newTemp());
      }
      case 'assign': {
        const value = visit(node.value);
        return emit('=', value, null, node.target);
      }
    }
  }

  const output = visit(tree);
  return { quadruples, output };
}
export function toTriples(quadruples) {
  const rowOfTemp = new Map();
  const ref = (arg) => (rowOfTemp.has(arg) ? `(${rowOfTemp.get(arg)})` : arg);

  return quadruples.map(({ op, arg1, arg2, result }, i) => {
    if (op === '=') return { op, arg1: result, arg2: ref(arg1) };
    rowOfTemp.set(result, i + 1);
    return { op, arg1: ref(arg1), arg2: arg2 === null ? null : ref(arg2) };
  });
}
