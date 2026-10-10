(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const marquee = document.querySelector('.name-marquee');
  const contact = document.querySelector('.contact');
  const about = document.querySelector('.about');
  const nav = document.querySelector('#navigation');
  const menu = document.querySelector('.menu-toggle');
  function setDrawerMode(enabled) {
    if (nav.classList.contains('drawer-mode') === enabled) return;
    // Switching navigation layouts must not animate a closed drawer across the screen.
    nav.classList.add('nav-layout-change');
    nav.classList.toggle('drawer-mode', enabled);
    void nav.offsetWidth;
    nav.classList.remove('nav-layout-change');
  }
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const running = new Set();
  function animate(element, frames, options) {
    if (reduced.matches) return Promise.resolve();
    const animation = element.animate(frames, options);
    running.add(animation);
    return animation.finished
      .catch(() => {})
      .finally(() => running.delete(animation));
  }

  // Reveal elements only after the observer is ready, leaving no-JS content visible.
  const revealElements = document.querySelectorAll(
    '.about>.eyebrow,.intro-side>p,.expertise>div,.work-heading,.filters,.project,.work-bottom,.contact>.section-shell>.eyebrow,.contact-details,footer',
  );
  revealElements.forEach((element, index) => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
  });
  const headings = document.querySelectorAll(
    '.intro-grid>h2,.contact-heading>h2',
  );
  headings.forEach((heading) => {
    const lines = [[]];
    Array.from(heading.childNodes).forEach((node) => {
      if (node.nodeName === 'BR') lines.push([]);
      else lines[lines.length - 1].push(node);
    });
    heading.replaceChildren(
      ...lines.map((nodes, index) => {
        const mask = document.createElement('span');
        mask.className = 'line-mask';
        const inner = document.createElement('span');
        inner.className = 'line-inner';
        inner.style.setProperty('--line-delay', `${index * 110}ms`);
        inner.append(...nodes);
        mask.append(inner);
        return mask;
      }),
    );
  });
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
  );
  [...revealElements, ...headings].forEach((element) =>
    observer.observe(element),
  );
  root.classList.add('motion-ready');

  // Curved welcome curtain and the hero's scale-up entrance.
  let curtain;
  async function welcome() {
    if (reduced.matches) return;
    try {
      if (sessionStorage.getItem('portfolio-welcome-seen')) return;
      sessionStorage.setItem('portfolio-welcome-seen', 'true');
    } catch {
      // The introduction still works when browser storage is unavailable.
    }
    let skipped = false;
    curtain = document.createElement('div');
    curtain.className = 'welcome-curtain';
    const word = document.createElement('span');
    word.className = 'welcome-word';
    word.setAttribute('aria-hidden', 'true');
    const skip = document.createElement('button');
    skip.className = 'welcome-skip';
    skip.textContent = 'Skip introduction';
    skip.addEventListener('click', () => {
      skipped = true;
      running.forEach((animation) => animation.cancel());
      curtain.remove();
      document.querySelector('.brand').focus({ preventScroll: true });
    });
    curtain.append(word, skip);
    document.body.append(curtain);
    const greetings = [
      { text: 'Hello', lang: 'en', duration: 450 },
      { text: 'Bonjour', lang: 'fr', duration: 190 },
      { text: 'Hola', lang: 'es', duration: 190 },
      { text: 'Ciao', lang: 'it', duration: 190 },
      { text: 'Olá', lang: 'pt', duration: 190 },
      { text: 'Hallo', lang: 'de', duration: 190 },
      { text: 'こんにちは', lang: 'ja', duration: 240 },
      { text: '안녕하세요', lang: 'ko', duration: 240 },
      { text: '你好', lang: 'zh', duration: 190 },
      { text: 'नमस्ते', lang: 'hi', duration: 240 },
      { text: 'مرحبا', lang: 'ar', duration: 240 },
      { text: 'Kumusta', lang: 'fil', duration: 500 },
    ];
    const fallback = setTimeout(
      () => curtain?.remove(),
      greetings.reduce((total, greeting) => total + greeting.duration, 0) +
        2500,
    );
    for (const [index, greeting] of greetings.entries()) {
      if (skipped || reduced.matches) break;
      word.textContent = greeting.text;
      word.lang = greeting.lang;
      // Quick word changes, with longer holds on the first and final greetings.
      const finalGreeting = index === greetings.length - 1;
      await animate(
        word,
        [
          { opacity: 0 },
          { opacity: 1, offset: 0.12 },
          { opacity: 1, offset: 0.9 },
          { opacity: finalGreeting ? 1 : 0 },
        ],
        { duration: greeting.duration, easing: 'linear' },
      );
    }
    if (skipped) {
      clearTimeout(fallback);
      return;
    }
    const points = (progress) => {
      const height = innerHeight,
        bend = Math.sin(progress * Math.PI) * height * 0.22;
      const edge = height * (1 - progress) - bend;
      const curve = Array.from(
        { length: 25 },
        (_, i) =>
          `${(i / 24) * 100}% ${edge + bend * 4 * (i / 24) * (1 - i / 24)}px`,
      );
      return `polygon(0 0,100% 0,${curve.reverse().join(',')})`;
    };
    const frames = Array.from({ length: 31 }, (_, i) => ({
      clipPath: points(i / 30),
    }));
    await Promise.all([
      animate(
        word,
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-35px)' },
        ],
        { duration: 400, easing: 'ease-in', fill: 'forwards' },
      ),
      animate(curtain, frames, {
        duration: 850,
        easing: 'cubic-bezier(.65,0,.25,1)',
        fill: 'forwards',
      }),
      animate(
        document.querySelector('.hero-art'),
        [
          { transform: 'translateY(100px) scale(.88)' },
          { transform: 'translateY(0) scale(1)' },
        ],
        { duration: 1200, easing: 'cubic-bezier(.16,1,.3,1)' },
      ),
      ...Array.from(
        document.querySelectorAll(
          '.site-header,.hero-role,.location,.hero-bottom',
        ),
        (element, index) =>
          animate(
            element,
            [
              { opacity: 0, translate: '0 25px' },
              { opacity: 1, translate: '0 0' },
            ],
            {
              duration: 950,
              delay: index * 70,
              easing: 'cubic-bezier(.16,1,.3,1)',
              fill: 'backwards',
            },
          ),
      ),
    ]);
    clearTimeout(fallback);
    curtain.remove();
  }
  welcome();

  // Magnetic movement uses translate so it composes with button parallax.
  document
    .querySelectorAll('.circle-button,.pill-link,.filter,.brand,nav a')
    .forEach((element) => {
      element.classList.add('magnetic');
      let origin;
      element.addEventListener('pointerenter', () => {
        origin = element.getBoundingClientRect();
      });
      element.addEventListener('pointermove', (event) => {
        if (
          reduced.matches ||
          !finePointer.matches ||
          event.pointerType === 'touch'
        )
          return;
        const rect = origin || element.getBoundingClientRect();
        const strength = element.classList.contains('circle-button')
          ? 0.16
          : 0.08;
        element.classList.add('is-magnetic');
        element.style.setProperty(
          '--magnet-x',
          `${(event.clientX - rect.left - rect.width / 2) * strength}px`,
        );
        element.style.setProperty(
          '--magnet-y',
          `${(event.clientY - rect.top - rect.height / 2) * strength}px`,
        );
      });
      element.addEventListener('pointerleave', () => {
        origin = null;
        element.classList.remove('is-magnetic');
        element.style.setProperty('--magnet-x', '0px');
        element.style.setProperty('--magnet-y', '0px');
      });
    });

  // One frame loop for the direction-aware marquee and smoothly trailing preview.
  const preview = document.createElement('div');
  preview.className = 'floating-project';
  preview.setAttribute('aria-hidden', 'true');
  document.body.append(preview);
  let hover = false,
    pointerX = 0,
    pointerY = 0,
    previewX = 0,
    previewY = 0,
    previewWidth = 350,
    previewHeight = 340;
  new ResizeObserver(() => {
    previewWidth = preview.offsetWidth;
    previewHeight = preview.offsetHeight;
  }).observe(preview);
  function positionPreview() {
    const left = clamp(
      previewX - previewWidth / 2,
      12,
      innerWidth - previewWidth - 12,
    );
    const top = clamp(
      previewY - previewHeight / 2,
      12,
      innerHeight - previewHeight - 12,
    );
    preview.style.transform = `translate3d(${left}px,${top}px,0)`;
  }
  function hidePreview() {
    hover = false;
    preview.classList.remove('visible');
    root.classList.remove('cursor-preview-active');
  }
  document.querySelectorAll('.project').forEach((project) => {
    project.addEventListener('pointerenter', (event) => {
      if (reduced.matches || !finePointer.matches || innerWidth <= 850) return;
      const art = project.querySelector('.project-hover').cloneNode(true);
      preview.replaceChildren(art);
      previewX = pointerX = event.clientX;
      previewY = pointerY = event.clientY;
      positionPreview();
      hover = true;
      preview.classList.add('visible');
      root.classList.add('cursor-preview-active');
      startLoop();
    });
    project.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    });
    project.addEventListener('pointerleave', hidePreview);
    project.addEventListener('click', hidePreview);
  });
  let frame = 0,
    last = 0,
    offset = 0,
    direction = -1,
    currentDirection = -1,
    boost = 0,
    previousScroll = scrollY,
    heroVisible = true,
    marqueeWidth = 1;
  function measure() {
    marqueeWidth = marquee.scrollWidth / 2 || 1;
    updateScroll();
  }
  new ResizeObserver(measure).observe(marquee);
  new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible) startLoop();
  }).observe(hero);
  function tick(time) {
    frame = 0;
    if (reduced.matches || document.hidden) return;
    const dt = Math.min(time - (last || time), 48);
    last = time;
    const follow = 1 - Math.exp(-dt / 90);
    if (heroVisible) {
      currentDirection +=
        (direction - currentDirection) * (1 - Math.exp(-dt / 180));
      offset += ((currentDirection * marqueeWidth) / 34000) * (1 + boost) * dt;
      offset = ((offset % marqueeWidth) - marqueeWidth) % marqueeWidth;
      marquee.style.transform = `translate3d(${offset}px,0,0)`;
      boost *= Math.pow(0.97, dt / 16);
    }
    if (hover) {
      previewX += (pointerX - previewX) * follow;
      previewY += (pointerY - previewY) * follow;
      positionPreview();
    }
    if (heroVisible || hover) frame = requestAnimationFrame(tick);
  }
  function startLoop() {
    if (!frame && !reduced.matches && !document.hidden) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  // Reveal the footer with a shrinking curve, sliding call-to-action, and parallax.
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const delta = scrollY - previousScroll;
    if (Math.abs(delta) > 1) direction = delta > 0 ? -1 : 1;
    boost = Math.min(5, boost + Math.abs(delta) * 0.025);
    previousScroll = scrollY;
    floatingMenu.classList.toggle(
      'shown',
      scrollY > 130 || nav.classList.contains('open'),
    );
    if (scrollY > 130 && !nav.classList.contains('drawer-mode'))
      setDrawerMode(true);
    if (
      scrollY <= 130 &&
      innerWidth > 600 &&
      !nav.classList.contains('open') &&
      nav.classList.contains('drawer-mode')
    )
      setDrawerMode(false);
    if (reduced.matches) return;
    hero.style.setProperty(
      '--hero-drift',
      `${Math.min(scrollY * 0.16, 150)}px`,
    );
    const aboutRect = about.getBoundingClientRect();
    about.style.setProperty(
      '--about-drift',
      `${clamp((aboutRect.top - innerHeight * 0.3) * 0.12, -45, 65)}px`,
    );
    const rect = contact.getBoundingClientRect();
    const progress = clamp(
      (innerHeight - rect.top) / Math.min(rect.height, innerHeight),
      0,
      1,
    );
    contact.style.setProperty('--footer-curve', `${(1 - progress) * 85}px`);
    contact.style.setProperty('--footer-drift', `${(1 - progress) * 85}px`);
    contact.style.setProperty('--footer-angle', `${(1 - progress) * 18}deg`);
    contact.style.setProperty(
      '--contact-drift',
      `${(1 - progress) * -Math.min(innerWidth * 0.18, 180)}px`,
    );
  }
  addEventListener(
    'scroll',
    () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    },
    { passive: true },
  );

  // Keep section links intact; a sliding drawer replaces page-route transitions.
  const shade = document.createElement('div');
  shade.className = 'menu-shade';
  shade.setAttribute('aria-hidden', 'true');
  document.body.append(shade);
  const floatingMenu = document.createElement('button');
  floatingMenu.className = 'floating-menu';
  floatingMenu.type = 'button';
  floatingMenu.innerHTML = '<span aria-hidden="true"></span>';
  floatingMenu.setAttribute('aria-label', 'Open navigation');
  floatingMenu.setAttribute('aria-controls', 'navigation');
  floatingMenu.setAttribute('aria-expanded', 'false');
  document.body.append(floatingMenu);
  nav
    .querySelectorAll('a')
    .forEach((link, index) => link.style.setProperty('--nav-index', index));
  let menuWasOpen = false;
  function syncMenu() {
    const open = nav.classList.contains('open');
    if ((open || innerWidth <= 600) && !nav.classList.contains('drawer-mode'))
      setDrawerMode(true);
    floatingMenu.classList.toggle('shown', scrollY > 130 || open);
    floatingMenu.setAttribute('aria-expanded', String(open));
    floatingMenu.setAttribute(
      'aria-label',
      open ? 'Close navigation' : 'Open navigation',
    );
    shade.classList.toggle('open', open);
    if (open && !menuWasOpen)
      nav.querySelector('a').focus({ preventScroll: true });
    if (!open && menuWasOpen && nav.contains(document.activeElement))
      (scrollY > 130 ? floatingMenu : menu).focus({ preventScroll: true });
    menuWasOpen = open;
  }
  new MutationObserver(syncMenu).observe(nav, {
    attributes: true,
    attributeFilter: ['class'],
  });
  floatingMenu.addEventListener('click', () => menu.click());
  shade.addEventListener('click', () => {
    if (nav.classList.contains('open')) menu.click();
  });
  nav.addEventListener('transitionend', (event) => {
    if (
      event.target === nav &&
      !nav.classList.contains('open') &&
      innerWidth > 600 &&
      scrollY <= 130
    )
      setDrawerMode(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !nav.classList.contains('open')) return;
    const items = [...nav.querySelectorAll('a'), floatingMenu];
    const index = items.indexOf(document.activeElement);
    event.preventDefault();
    items[
      (index + (event.shiftKey ? -1 : 1) + items.length) % items.length
    ].focus();
  });
  addEventListener('resize', () => {
    hidePreview();
    if (innerWidth > 600 && !nav.classList.contains('open'))
      setDrawerMode(false);
    syncMenu();
    updateScroll();
  });
  syncMenu();
  updateScroll();
  startLoop();

  // FLIP keeps the remaining project rows moving into their new positions.
  document.querySelectorAll('.filter').forEach((button) =>
    button.addEventListener(
      'click',
      () => {
        const projects = [...document.querySelectorAll('.project')];
        const before = new Map(
          projects
            .filter((p) => !p.hidden)
            .map((p) => [p, p.getBoundingClientRect()]),
        );
        requestAnimationFrame(() =>
          projects
            .filter((p) => !p.hidden)
            .forEach((project, index) => {
              const previous = before.get(project),
                current = project.getBoundingClientRect();
              animate(
                project,
                [
                  {
                    opacity: previous ? 1 : 0,
                    transform: `translateY(${previous ? previous.top - current.top : 35}px)`,
                  },
                  { opacity: 1, transform: 'translateY(0)' },
                ],
                {
                  duration: 550,
                  delay: index * 45,
                  easing: 'cubic-bezier(.16,1,.3,1)',
                },
              );
            }),
        );
      },
      true,
    ),
  );

  document.querySelectorAll('dialog').forEach((dialog) => {
    new MutationObserver(() => {
      if (dialog.open)
        animate(
          dialog,
          [
            { opacity: 0, transform: 'translateY(22px) scale(.985)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' },
          ],
          { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' },
        );
    }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    let closing = false;
    async function closeAnimated(event) {
      if (reduced.matches) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (closing) return;
      closing = true;
      const style = getComputedStyle(dialog);
      const from = { opacity: style.opacity, transform: style.transform };
      dialog.getAnimations().forEach((animation) => animation.cancel());
      await animate(
        dialog,
        [from, { opacity: 0, transform: 'translateY(12px) scale(.99)' }],
        { duration: 200, easing: 'cubic-bezier(.4,0,1,1)' },
      );
      dialog.close();
      closing = false;
    }
    dialog
      .querySelector('.dialog-close')
      .addEventListener('click', closeAnimated, true);
    dialog.addEventListener('cancel', closeAnimated);
    dialog.addEventListener(
      'click',
      (event) => {
        const rect = dialog.getBoundingClientRect();
        if (
          event.target === dialog &&
          (event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom)
        )
          closeAnimated(event);
      },
      true,
    );
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      running.forEach((animation) => animation.cancel());
      curtain?.remove();
      hidePreview();
      marquee.style.transform = '';
      cancelAnimationFrame(frame);
      frame = 0;
    } else startLoop();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else startLoop();
  });

  // Damped desktop wheel scrolling; touch, keyboard, and modal scrolling stay native.
  let wheelFrame = 0,
    wheelTarget = scrollY,
    wheelPosition = scrollY,
    wheelTime = 0;
  function stopWheel() {
    cancelAnimationFrame(wheelFrame);
    wheelFrame = 0;
    wheelTarget = scrollY;
    wheelPosition = scrollY;
  }
  function wheelTick(time) {
    const elapsed = Math.min(time - (wheelTime || time), 48);
    wheelTime = time;
    const next =
      wheelPosition +
      (wheelTarget - wheelPosition) * (1 - Math.exp(-elapsed / 120));
    if (Math.abs(wheelTarget - wheelPosition) < 0.5) {
      window.scrollTo({ top: wheelTarget, behavior: 'instant' });
      wheelFrame = 0;
      return;
    }
    wheelPosition = next;
    window.scrollTo({ top: next, behavior: 'instant' });
    wheelFrame = requestAnimationFrame(wheelTick);
  }
  addEventListener(
    'wheel',
    (event) => {
      if (
        reduced.matches ||
        !finePointer.matches ||
        event.ctrlKey ||
        event.shiftKey ||
        !event.cancelable ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        document.querySelector('dialog[open]') ||
        nav.classList.contains('open')
      )
        return;
      if (!wheelFrame) wheelTarget = wheelPosition = scrollY;
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      wheelTarget = clamp(
        wheelTarget + event.deltaY * unit,
        0,
        document.documentElement.scrollHeight - innerHeight,
      );
      event.preventDefault();
      if (!wheelFrame) {
        wheelTime = 0;
        wheelFrame = requestAnimationFrame(wheelTick);
      }
    },
    { passive: false },
  );
  ['pointerdown', 'keydown', 'touchstart', 'resize'].forEach((type) =>
    addEventListener(type, stopWheel, { passive: true }),
  );
  reduced.addEventListener('change', stopWheel);
  document.addEventListener('visibilitychange', stopWheel);
})();
