(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Decorative interpretations of each interface, not original design artifacts.
  const outlines = {
    evacu: [
      'M12 28H348 M24 14H100 M254 14H330',
      'M12 62H30V226H12Z M40 42H242V56H40Z M252 42H348V226H252Z',
      'M40 66H242V226H40Z M40 110L242 82 M40 164L242 137 M40 206L242 181 M88 66L120 226 M192 66L156 226',
      'M65 187L103 177L93 139L166 121L179 82 M173 82H185 M179 76V88',
      'M266 62H334 M266 76H314 M266 100H334V136H266Z M266 154H334 M266 176H334V192H266Z M266 202H334V216H266Z',
    ],
    campus: [
      'M12 28H348 M24 14H92 M244 14H276 M294 14H332',
      'M70 55H290 M98 70H262 M62 91H298V111H62Z',
      'M22 142H116V222H22Z M133 142H227V222H133Z M244 142H338V222H244Z',
      'M30 150H108V193H30Z M141 150H219V193H141Z M252 150H330V193H252Z',
      'M30 204H93 M30 214H67 M141 204H204 M141 214H178 M252 204H315 M252 214H289',
    ],
    spacesketch: [
      'M12 28H348 M24 14H96 M248 14H330',
      'M24 65H140 M24 82H124 M24 104H141 M24 116H108 M24 142H90V160H24Z',
      'M180 95L268 55L340 96V171L251 218L180 175Z M180 95L251 138L340 96 M251 138V218 M268 55V111',
      'M192 133L226 153V180L192 160Z M192 146L226 166 M226 153L239 145V172L226 180',
      'M272 161L298 148L318 159L292 174Z M272 161V182 M292 174V195 M318 159V180 M281 81L321 101V126L281 106Z',
    ],
  };
  const pending = new Set();
  const active = new Map();
  const observer =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach(({ target, isIntersecting }) => {
              if (isIntersecting) reveal(target);
            });
          },
          { threshold: 0.3 },
        )
      : null;

  function finish(screen) {
    observer?.unobserve(screen);
    pending.delete(screen);
    screen.classList.remove('sketch-pending');
    active.get(screen)?.forEach((animation) => animation.cancel());
    active.delete(screen);
  }

  function reveal(screen) {
    const img = screen.querySelector('img');
    if (!pending.has(screen) || active.has(screen)) return;
    // A fully clipped lazy image may never load in Chromium. Start its request
    // when the wrapper enters view, then let the load listener re-observe it.
    img.loading = 'eager';
    if (!img.complete) return;
    if (reduced.matches || !img.naturalWidth) return finish(screen);
    const lines = screen.querySelectorAll('path');
    const animations = [...lines].map((line, index) =>
      line.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 650,
        delay: index * 65,
        fill: 'both',
        easing: 'ease-out',
      }),
    );
    const wipe = img.animate(
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
      {
        duration: 900,
        delay: 650,
        fill: 'both',
        easing: 'cubic-bezier(.22,1,.36,1)',
      },
    );
    animations.push(wipe);
    active.set(screen, animations);
    if (document.hidden) animations.forEach((animation) => animation.pause());
    wipe.finished.then(() => finish(screen)).catch(() => {});
  }

  function makeScreen(img, project, thumbnail = false) {
    const screen = document.createElement('span');
    screen.className = `sketch-screen${thumbnail ? ' sketch-thumbnail' : ''}`;
    screen.setAttribute('aria-hidden', 'true');
    screen.innerHTML = `<svg class="sketch-outline" viewBox="0 0 360 240" fill="none" aria-hidden="true" focusable="false">${outlines[project.dataset.project].map((d) => `<path d="${d}" pathLength="1"/>`).join('')}</svg>`;
    img.before(screen);
    screen.append(img);
    if (!reduced.matches && observer && typeof img.animate === 'function') {
      screen.classList.add('sketch-pending');
      pending.add(screen);
      observer.observe(screen);
      // Re-observe on load so slow images never reveal an empty frame.
      img.addEventListener(
        'load',
        () => {
          if (!pending.has(screen)) return;
          observer.unobserve(screen);
          observer.observe(screen);
        },
        { once: true },
      );
      img.addEventListener('error', () => finish(screen), { once: true });
    }
    return screen;
  }

  document.querySelectorAll('.project').forEach((project) => {
    const img = project.querySelector('.screenshot-preview > img');
    if (!img || !outlines[project.dataset.project]) return;
    const thumbnail = img.cloneNode(true);
    project.querySelector('.project-title').before(thumbnail);
    const desktop = makeScreen(thumbnail, project, true);
    const mobile = makeScreen(img, project);
    project.addEventListener('focus', () => {
      finish(desktop);
      finish(mobile);
    });
  });

  reduced.addEventListener('change', () => {
    if (reduced.matches) [...pending].forEach(finish);
  });
  document.addEventListener('visibilitychange', () => {
    active.forEach((animations) =>
      animations.forEach((animation) => {
        if (document.hidden) animation.pause();
        else animation.play();
      }),
    );
  });
})();
