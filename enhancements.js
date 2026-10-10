// A standalone sample-data interaction; no account or backend is required.
(() => {
  const records = [
    { name: 'Morning coffee', category: 'Food', amount: 120 },
    { name: 'Weekly groceries', category: 'Food', amount: 850 },
    { name: 'Bus fare', category: 'Transport', amount: 45 },
    { name: 'Notebook', category: 'Supplies', amount: 95 },
    { name: 'Lunch', category: 'Food', amount: 180 },
  ];
  const search = document.querySelector('#demo-search');
  const category = document.querySelector('#demo-category');
  const currency = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });
  function render() {
    const query = search.value.trim().toLowerCase();
    const filtered = records.filter(
      (record) =>
        record.name.toLowerCase().includes(query) &&
        (category.value === 'all' || category.value === record.category),
    );
    document.querySelector('#demo-count').textContent =
      `${filtered.length} sample ${filtered.length === 1 ? 'expense' : 'expenses'}`;
    document.querySelector('#demo-total').textContent = currency.format(
      filtered.reduce((sum, record) => sum + record.amount, 0),
    );
    const items = filtered.map((record) => {
      const row = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = record.name;
      const detail = document.createElement('small');
      detail.textContent = record.category;
      label.append(detail);
      const amount = document.createElement('strong');
      amount.textContent = currency.format(record.amount);
      row.append(label, amount);
      return row;
    });
    if (!items.length) {
      const empty = document.createElement('li');
      empty.textContent =
        'No matching expenses. Try another search or reset the filters.';
      items.push(empty);
    }
    document.querySelector('#demo-records').replaceChildren(...items);
  }
  search.addEventListener('input', render);
  category.addEventListener('change', render);
  document.querySelector('#demo-reset').addEventListener('click', () => {
    search.value = '';
    category.value = 'all';
    render();
  });
  render();

  const art = document.querySelector('#dialog-art');
  const enlarged = document.querySelector('#image-dialog');
  let start = null;
  let swiped = false;
  art.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    start = { x: event.clientX, y: event.clientY };
    swiped = false;
  });
  art.addEventListener('pointercancel', () => {
    start = null;
  });
  art.addEventListener('pointerup', (event) => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiped = true;
      document
        .querySelector(dx < 0 ? '#gallery-next' : '#gallery-prev')
        .click();
    }
  });
  art.addEventListener('click', () => {
    if (swiped) {
      swiped = false;
      return;
    }
    const source = art.querySelector('img');
    if (!source) return;
    const image = document.querySelector('#enlarged-image');
    image.src = source.src;
    image.alt = source.alt;
    enlarged.showModal();
    document.body.classList.add('modal-open');
  });
})();
