const $ = (id) => document.getElementById(id);

const EMPTY = '—';
const OP_LABELS = { uminus: 'neg' };
const REFERENCE = /^(t\d+|\(\d+\))$/;

const formatNumber = (n) => String(Number(n.toFixed(10)));
const valueText = (value) => (value === null ? EMPTY : formatNumber(value));
const opLabel = (op) => OP_LABELS[op] ?? op;

function buildTable(headers, rows) {
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`;
  const body = table.createTBody();

  rows.forEach((row) => {
    const tr = body.insertRow();
    row.forEach((cell, column) => {
      const td = tr.insertCell();
      td.textContent = cell ?? EMPTY;
      if (REFERENCE.test(td.textContent)) td.classList.add('ref');
      if (column === row.length - 1) td.classList.add('value');
    });
  });
  return table;
}

export function showResults({ quadruples, triples, steps, result, output }) {
  const quadRows = quadruples.map((q, i) =>
    [i + 1, opLabel(q.op), q.arg1, q.arg2, q.result, valueText(steps[i])]);
  const tripleRows = triples.map((t, i) =>
    [i + 1, opLabel(t.op), t.arg1, t.arg2, valueText(steps[i])]);

  $('quadruples').replaceChildren(buildTable(['#', 'Operador', 'Arg 1', 'Arg 2', 'Resultado', 'Valor'], quadRows));
  $('triples').replaceChildren(buildTable(['#', 'Operador', 'Arg 1', 'Arg 2', 'Valor'], tripleRows));

  const isNumeric = result !== null;
  $('result').textContent = isNumeric ? formatNumber(result) : output;
  $('result-note').textContent = isNumeric
    ? ''
    : 'La expresión contiene variables sin valor, por eso solo se muestra el procedimiento.';
  if (!quadruples.length) {
    $('result-note').textContent = 'La expresión no contiene operaciones, así que no hay cuádruplos ni triplos.';
  }
  hideAlert();
  $('results').hidden = false;
}

export function showAlert(message) {
  $('alert').textContent = message;
  $('alert').hidden = false;
  $('results').hidden = true;
}

export function hideAlert() {
  $('alert').hidden = true;
}

export function clearAll() {
  $('expression').value = '';
  $('results').hidden = true;
  hideAlert();
  $('expression').focus();
}
