import { analyze } from './analyzer.js';
import { ExpressionError } from './tokenizer.js';
import { showResults, showAlert, clearAll } from './ui.js';

const form = document.getElementById('calc-form');
const input = document.getElementById('expression');

function calculate() {
  try {
    showResults(analyze(input.value));
  } catch (error) {
    if (!(error instanceof ExpressionError)) throw error;
    showAlert(error.message);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  calculate();
});

document.getElementById('clear-btn').addEventListener('click', clearAll);

document.getElementById('examples').addEventListener('click', ({ target }) => {
  if (!target.dataset.expression) return;
  input.value = target.dataset.expression;
  calculate();
});
