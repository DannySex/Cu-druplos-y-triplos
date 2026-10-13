import { tokenize } from './tokenizer.js';
import { parse } from './parser.js';
import { generateQuadruples, toTriples } from './generator.js';
import { evaluate } from './evaluator.js';

export function analyze(source) {
  const tree = parse(tokenize(source.trim()));
  const { quadruples, output } = generateQuadruples(tree);
  const { steps, result } = evaluate(quadruples, output);
  return { quadruples, triples: toTriples(quadruples), steps, result, output };
}
