(() => {
  const section = document.querySelector('#project-interaction');
  const content = document.querySelector('#interaction-content');
  let cleanup = null;

  function mountRoute(host) {
    host.innerHTML = `
      <div class="route-preview">
        <svg class="route-map" viewBox="0 0 560 280" role="img" aria-label="Illustrative map connecting a start point to a sample shelter">
          <rect width="560" height="280" rx="16" fill="#eef0e6" />
          <g fill="#dce3d1">
            <rect x="18" y="16" width="152" height="108" rx="10" />
            <rect x="238" y="112" width="116" height="144" rx="10" />
            <rect x="420" y="110" width="120" height="70" rx="10" />
          </g>
          <g fill="#e4ddce">
            <rect x="90" y="192" width="82" height="64" rx="8" />
            <rect x="238" y="16" width="116" height="40" rx="8" />
            <rect x="420" y="210" width="120" height="46" rx="8" />
          </g>
          <g fill="none" stroke="#fffdf7" stroke-width="22" stroke-linecap="round">
            <path d="M58 16V264M202 16V264M384 16V264M18 166H540M18 78H540" />
          </g>
          <path class="route-underlay" d="M58 224V180Q58 166 72 166H188Q202 166 202 152V92Q202 78 216 78H370Q384 78 384 64V54H492" />
          <path class="route-trace" pathLength="1" d="M58 224V180Q58 166 72 166H188Q202 166 202 152V92Q202 78 216 78H370Q384 78 384 64V54H492" />
          <circle cx="58" cy="224" r="10" fill="#fff" stroke="#963b35" stroke-width="3" />
          <g transform="translate(492 54)">
            <circle r="17" fill="#fff" stroke="#963b35" stroke-width="2" />
            <path d="m-9 0 9-8 9 8M-6-2v10H6V-2M-2 8V2h4v6" fill="none" stroke="#963b35" stroke-width="2" stroke-linejoin="round" />
          </g>
          <g class="route-actor"><circle r="7" fill="#963b35" stroke="#fff" stroke-width="3" /></g>
          <g fill="#52604e" font-size="12" font-family="inherit" text-anchor="middle">
            <text x="58" y="254">Start</text><text x="492" y="92">Sample shelter</text>
          </g>
        </svg>
        <div class="interaction-controls">
          <button class="interaction-button route-play" type="button">Play route</button>
          <button class="interaction-button route-reset" type="button">Reset</button>
          <span class="route-status" role="status" aria-live="polite"></span>
        </div>
      </div>`;
    const trace = host.querySelector('.route-trace');
    const actor = host.querySelector('.route-actor');
    const play = host.querySelector('.route-play');
    const reset = host.querySelector('.route-reset');
    const status = host.querySelector('.route-status');
    const length = trace.getTotalLength();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const listeners = new AbortController();
    let progress = reduced.matches ? 1 : 0;
    let running = false;
    let frame = 0;
    let lastTime = 0;
    function paint() {
      trace.style.strokeDashoffset = 1 - progress;
      const point = trace.getPointAtLength(length * progress);
      actor.setAttribute('transform', `translate(${point.x} ${point.y})`);
    }
    function updateControls() {
      play.textContent = reduced.matches
        ? 'Show route'
        : running
          ? 'Pause route'
          : progress === 1
            ? 'Replay route'
            : progress > 0
              ? 'Resume route'
              : 'Play route';
      status.textContent = running
        ? 'Tracing the sample route...'
        : progress === 1
          ? 'Sample route complete.'
          : progress > 0
            ? 'Route preview paused.'
            : 'Ready to trace.';
    }
    function pause() {
      cancelAnimationFrame(frame);
      frame = 0;
      running = false;
      updateControls();
    }
    function tick(time) {
      if (!running) return;
      if (lastTime) progress = Math.min(1, progress + (time - lastTime) / 2800);
      lastTime = time;
      paint();
      if (progress < 1) frame = requestAnimationFrame(tick);
      else {
        frame = 0;
        running = false;
        updateControls();
      }
    }
    play.addEventListener(
      'click',
      () => {
        if (reduced.matches) {
          progress = 1;
          paint();
          updateControls();
          return;
        }
        if (running) {
          pause();
          return;
        }
        if (progress === 1) progress = 0;
        running = true;
        lastTime = 0;
        updateControls();
        frame = requestAnimationFrame(tick);
      },
      { signal: listeners.signal },
    );
    reset.addEventListener(
      'click',
      () => {
        pause();
        progress = reduced.matches ? 1 : 0;
        paint();
        updateControls();
      },
      { signal: listeners.signal },
    );
    reduced.addEventListener(
      'change',
      () => {
        pause();
        progress = reduced.matches ? 1 : 0;
        paint();
        updateControls();
      },
      { signal: listeners.signal },
    );
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) pause();
      },
      { signal: listeners.signal },
    );
    paint();
    updateControls();
    return () => {
      pause();
      listeners.abort();
    };
  }

  function listingArtwork(kind) {
    if (kind === 'desk')
      return `<svg viewBox="0 0 260 180" aria-hidden="true"><ellipse cx="134" cy="156" rx="95" ry="12" fill="#d6cdbd"/><path d="M40 73h180v13H40z" fill="#b48054"/><path d="M50 86h12v67H50zM198 86h12v67h-12z" fill="#494641"/><path d="M78 56h52v17H78z" fill="#8d879b"/><path d="M180 54h22l-4 19h-14z" fill="#c4b298"/><path d="M190 56V33m0 13c-16-2-17-17-17-17 16 0 17 17 17 17m0-5c16-2 17-17 17-17-16 0-17 17-17 17" stroke="#6a815a" stroke-width="4" fill="#849c6f"/></svg>`;
    if (kind === 'book')
      return `<svg viewBox="0 0 260 180" aria-hidden="true"><ellipse cx="134" cy="154" rx="78" ry="10" fill="#d4d0dc"/><path d="M72 25h112v124H72z" fill="#746389"/><path d="M79 25h105v117H79z" fill="#9686a8"/><path d="M82 143h102v8H82z" fill="#fffaf0"/><path d="M80 33h6v101" stroke="#b3a4c4" stroke-width="2"/><text x="133" y="69" text-anchor="middle" font-size="12" letter-spacing="1.5" fill="#fffaf0">CALCULUS</text><path d="M106 89h55m-55 10h42" stroke="#d8cfdf" stroke-width="3"/></svg>`;
    const keys = Array.from(
      { length: 16 },
      (_, i) =>
        `<rect x="${93 + (i % 4) * 19}" y="${75 + Math.floor(i / 4) * 17}" width="13" height="10" rx="2" fill="${i % 4 === 3 ? '#8c79a3' : '#d0ccd5'}"/>`,
    ).join('');
    return `<svg viewBox="0 0 260 180" aria-hidden="true"><ellipse cx="130" cy="160" rx="65" ry="8" fill="#d4d0dc"/><rect x="82" y="16" width="96" height="140" rx="12" fill="#49464e"/><rect x="93" y="29" width="74" height="31" rx="4" fill="#d4ddc7"/><text x="160" y="50" text-anchor="end" font-size="15" fill="#465140">123.45</text>${keys}</svg>`;
  }
  function mountListings(host) {
    const listings = [
      {
        id: 'desk',
        title: 'Compact study desk',
        price: 1200,
        condition: 'Pre-loved · Good condition',
        copy: 'A compact desk for study sessions, with room for a laptop and a few essentials.',
        color: '#eee8db',
      },
      {
        id: 'book',
        title: 'Calculus textbook',
        price: 350,
        condition: 'Pre-loved · Lightly used',
        copy: 'A sample textbook listing showing how course materials can find their next owner.',
        color: '#ece7f1',
      },
      {
        id: 'calculator',
        title: 'Scientific calculator',
        price: 450,
        condition: 'Pre-loved · Good condition',
        copy: 'A sample calculator listing with a clear price and condition at a glance.',
        color: '#e6e9ed',
      },
    ];
    const currency = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    });
    host.innerHTML = `<div class="listing-detail" aria-live="polite" aria-atomic="true"></div><div class="listing-options" role="group" aria-label="Choose a sample listing"></div>`;
    const detail = host.querySelector('.listing-detail');
    const options = host.querySelector('.listing-options');
    const listeners = new AbortController();
    function choose(index) {
      const listing = listings[index];
      const artwork = document.createElement('div');
      artwork.className = 'listing-artwork';
      artwork.style.background = listing.color;
      artwork.innerHTML = listingArtwork(listing.id);
      const information = document.createElement('div');
      information.className = 'listing-information';
      const label = document.createElement('span');
      label.className = 'listing-sample-label';
      label.textContent = 'SAMPLE LISTING';
      const title = document.createElement('h4');
      title.textContent = listing.title;
      const price = document.createElement('strong');
      price.className = 'listing-price';
      price.textContent = currency.format(listing.price);
      const condition = document.createElement('p');
      condition.className = 'listing-condition';
      condition.textContent = listing.condition;
      const copy = document.createElement('p');
      copy.className = 'listing-description';
      copy.textContent = listing.copy;
      information.append(label, title, price, condition, copy);
      detail.replaceChildren(artwork, information);
      [...options.children].forEach((button, i) =>
        button.setAttribute('aria-pressed', String(i === index)),
      );
    }
    listings.forEach((listing, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'listing-option';
      const art = document.createElement('span');
      art.className = 'listing-option-art';
      art.style.background = listing.color;
      art.innerHTML = listingArtwork(listing.id);
      const label = document.createElement('span');
      label.textContent = listing.title;
      button.append(art, label);
      button.addEventListener('click', () => choose(index), {
        signal: listeners.signal,
      });
      options.append(button);
    });
    choose(0);
    return () => listeners.abort();
  }

  const previews = {
    evacu: {
      title: 'Follow the route.',
      intro: 'Trace a path from a starting point to a shelter.',
      note: 'Illustrative map with sample locations and a sample path.',
      mount: mountRoute,
    },
    campus: {
      title: 'A good find, up close.',
      intro: 'Choose a sample listing to explore the marketplace experience.',
      note: 'Illustrative listings and prices for this portfolio preview.',
      mount: mountListings,
    },
    spacesketch: {
      title: 'Give the room a turn.',
      intro: 'Rotate a miniature room to explore the idea behind SpaceSketch.',
      note: 'Illustrative room. Explore the repository for the full space-planning application.',
      mount: (host) => window.mountSpaceSketchPreview(host),
    },
  };
  window.updateProjectInteraction = (id) => {
    cleanup?.();
    cleanup = null;
    content.replaceChildren();
    const preview = previews[id];
    section.hidden = !preview;
    if (!preview) return;
    section.dataset.project = id;
    document.querySelector('#interaction-title').textContent = preview.title;
    document.querySelector('#interaction-intro').textContent = preview.intro;
    document.querySelector('#interaction-note').textContent = preview.note;
    cleanup = preview.mount(content);
  };
  document.querySelector('#project-dialog').addEventListener('close', () => {
    cleanup?.();
    cleanup = null;
  });
})();
