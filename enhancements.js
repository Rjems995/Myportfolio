// Project screenshot touch navigation and enlargement.
(() => {
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

// Real daily counts augment the static image when the public API is available.
(() => {
  const chart = document.querySelector('#contributions-chart');
  const imageLink = chart.closest('a');
  const calendar = document.querySelector('#contributions-calendar');
  const fallback = document.querySelector('#contributions-fallback');
  const details = document.querySelector('#contribution-details');
  const hint = document.querySelector('#contributions-hint');
  const section = document.querySelector('#contributions');
  const dayLength = 86400000;
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const monthFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  function imageFailed() {
    imageLink.hidden = true;
    if (calendar.hidden) fallback.hidden = false;
  }
  chart.addEventListener('error', imageFailed);
  if (chart.complete && !chart.naturalWidth) imageFailed();

  function renderCalendar(contributions) {
    const days = contributions
      .map((day) => {
        const time = Date.parse(`${day.date}T00:00:00Z`);
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
          !Number.isFinite(time) ||
          new Date(time).toISOString().slice(0, 10) !== day.date ||
          !Number.isInteger(day.count) ||
          day.count < 0 ||
          !Number.isInteger(day.level) ||
          day.level < 0 ||
          day.level > 4
        )
          throw new Error('Invalid contribution data');
        return { ...day, time };
      })
      .sort((a, b) => a.time - b.time);
    if (new Set(days.map((day) => day.date)).size !== days.length)
      throw new Error('Duplicate contribution dates');
    if (days.at(-1).time - days[0].time >= 400 * dayLength)
      throw new Error('Unexpected contribution date range');
    const start = days[0].time - new Date(days[0].time).getUTCDay() * dayLength;
    const weeks = Math.floor((days.at(-1).time - start) / dayLength / 7) + 1;
    calendar.style.setProperty('--weeks', weeks);
    const months = document.createElement('div');
    months.className = 'contribution-months';
    months.setAttribute('aria-hidden', 'true');
    let lastMonth = '';
    let lastColumn = -4;
    days.forEach((day) => {
      const month = day.date.slice(0, 7);
      if (month === lastMonth) return;
      lastMonth = month;
      const column = Math.floor((day.time - start) / dayLength / 7);
      if (column - lastColumn < 3 || weeks - column < 3) return;
      const label = document.createElement('span');
      label.textContent = monthFormat.format(day.time);
      label.style.gridColumn = `${column + 1} / span ${Math.min(4, weeks - column)}`;
      months.append(label);
      lastColumn = column;
    });
    const body = document.createElement('div');
    body.className = 'contribution-body';
    const weekdays = document.createElement('div');
    weekdays.className = 'contribution-weekdays';
    weekdays.setAttribute('aria-hidden', 'true');
    ['Mon', 'Wed', 'Fri'].forEach((name, index) => {
      const label = document.createElement('span');
      label.textContent = name;
      label.style.gridRow = index * 2 + 2;
      weekdays.append(label);
    });
    const grid = document.createElement('div');
    grid.className = 'contribution-days';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Daily GitHub contributions');
    grid.setAttribute('aria-describedby', 'contributions-hint');
    const labels = days.map(
      (day) =>
        `${day.count.toLocaleString()} ${day.count === 1 ? 'contribution' : 'contributions'} on ${dateFormat.format(day.time)}`,
    );
    const buttons = days.map((day, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `contribution-day level-${day.level}`;
      button.setAttribute('aria-label', labels[index]);
      button.dataset.index = index;
      button.dataset.date = day.date;
      button.tabIndex = index === days.length - 1 ? 0 : -1;
      const offset = Math.round((day.time - start) / dayLength);
      button.style.gridColumn = Math.floor(offset / 7) + 1;
      button.style.gridRow = (offset % 7) + 1;
      return button;
    });
    grid.append(...buttons);
    body.append(weekdays, grid);
    calendar.replaceChildren(months, body);

    const tooltip = document.createElement('div');
    tooltip.id = 'contribution-tooltip';
    tooltip.className = 'contribution-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    document.body.append(tooltip);
    let active = buttons.at(-1);
    function hideTooltip() {
      tooltip.hidden = true;
      active.removeAttribute('aria-describedby');
    }
    function showDay(button) {
      if (active === button && !tooltip.hidden) return;
      active.tabIndex = -1;
      active.removeAttribute('aria-describedby');
      active = button;
      active.tabIndex = 0;
      const label = labels[Number(button.dataset.index)];
      details.textContent = label;
      tooltip.textContent = label;
      tooltip.hidden = false;
      button.setAttribute('aria-describedby', tooltip.id);
      const rect = button.getBoundingClientRect();
      const tip = tooltip.getBoundingClientRect();
      const left = Math.max(
        8,
        Math.min(
          rect.left + rect.width / 2 - tip.width / 2,
          innerWidth - tip.width - 8,
        ),
      );
      const top =
        rect.top >= tip.height + 16
          ? rect.top - tip.height - 8
          : rect.bottom + 8;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${Math.max(8, Math.min(top, innerHeight - tip.height - 8))}px`;
    }
    function inspectTarget(event) {
      const button = event.target.closest('.contribution-day');
      if (button) showDay(button);
    }
    grid.addEventListener('pointerover', inspectTarget);
    grid.addEventListener('click', inspectTarget);
    grid.addEventListener('focusin', inspectTarget);
    grid.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse') {
        inspectTarget(event);
        return;
      }
      if (!event.buttons) return;
      const button = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest('.contribution-day');
      if (button && grid.contains(button)) showDay(button);
    });
    grid.addEventListener('pointerleave', hideTooltip);
    grid.addEventListener('focusout', hideTooltip);
    grid.addEventListener('keydown', (event) => {
      const button = event.target.closest('.contribution-day');
      if (!button) return;
      if (event.key === 'Escape') {
        hideTooltip();
        return;
      }
      const index = Number(button.dataset.index);
      const offsets = {
        ArrowLeft: -7,
        ArrowRight: 7,
        ArrowUp: -1,
        ArrowDown: 1,
      };
      let target;
      if (event.key in offsets) target = index + offsets[event.key];
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[Math.max(0, Math.min(target, buttons.length - 1))].focus({
        preventScroll: true,
      });
    });
    addEventListener('scroll', hideTooltip, { passive: true });
    addEventListener('resize', hideTooltip);
    calendar.hidden = false;
    imageLink.hidden = true;
    fallback.hidden = true;
    hint.hidden = false;
    details.textContent = 'Explore a day to see its contribution count.';
  }

  async function loadCalendar() {
    details.hidden = false;
    details.textContent = 'Loading daily contribution details...';
    calendar.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(
        'https://github-contributions-api.jogruber.de/v4/Rjems995?y=last',
        { signal: controller.signal },
      );
      if (!response.ok) throw new Error('Contribution API unavailable');
      const data = await response.json();
      if (
        !Array.isArray(data.contributions) ||
        !data.contributions.length ||
        data.contributions.length > 400
      )
        throw new Error('Missing contribution data');
      renderCalendar(data.contributions);
    } catch {
      details.textContent =
        'Daily details are unavailable. View my GitHub profile for contribution counts.';
    } finally {
      clearTimeout(timeout);
      calendar.removeAttribute('aria-busy');
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadCalendar();
      },
      { rootMargin: '300px' },
    );
    observer.observe(section);
  } else loadCalendar();
})();
