// Selected public repositories from github.com/Rjems995.
const portfolio = {
  email: 'robinwaje09@gmail.com',
  projects: {
    tally: {
      title: 'Tally',
      screenshot: 'assets/projects/tally.webp',
      screenshotCaption: 'Dashboard screenshot — built-in demo data.',
      description:
        'A receipt scanner and expense tracker that turns photos into searchable spending records. Browser-local OCR, editable receipt review, analytics, and exports connect to a Python and SQLite backend. Capacitor projects extend the app to mobile, with an Android preview and an iOS build workflow.',
      tags: ['JavaScript', 'Python', 'SQLite', 'Tesseract OCR', 'Capacitor'],
      url: 'https://github.com/Rjems995/Tally',
      note: 'The Android preview uses temporary demo data. Mobile store releases are not published.',
    },
    campus: {
      title: 'Campus Marketplace',
      screenshot: 'assets/projects/campus.webp',
      screenshotCaption:
        'Landing page screenshot — local preview with an empty database.',
      description:
        'A full-stack marketplace for university communities to buy, sell, and trade items. Includes searchable listings, image galleries, real-time chat, favorites, seller reviews, and an administration workflow for moderation.',
      tags: ['Flask', 'PostgreSQL', 'SQLAlchemy', 'Socket.IO', 'Bootstrap'],
      url: 'https://github.com/Rjems995/CampusMarketplace',
      note: 'Explore the source and local setup instructions on GitHub.',
    },
    evacu: {
      title: 'EVACU-ROSA',
      screenshot: 'assets/projects/evacu.webp',
      screenshotCaption:
        'Public map screenshot — awaiting shelter setup. Map data © OpenStreetMap contributors.',
      description:
        'A map-first evacuation application for Santa Rosa City, Laguna. Combines street-hazard reporting, transport-aware shelter routing, GPS guidance, and downloadable offline directions. Built with A* routing, fuzzy inference, and a geospatial database.',
      tags: ['Next.js', 'TypeScript', 'Leaflet', 'Supabase', 'PostGIS'],
      url: 'https://github.com/Rjems995/EVACU-ROSA-v1',
      note: 'A development project requiring verified shelters, operational data, and field validation before real-world use.',
    },
  },
};

const menuButton = document.querySelector('.menu-toggle');
const extraScreenshots = {
  tally: [
    ['tally-receipts', 'Receipt history — built-in demo data.'],
    ['tally-analytics', 'Spending analytics — built-in demo data.'],
  ],
  campus: [
    ['campus-browse', 'Browse and search filters — empty local database.'],
    ['campus-register', 'Student registration page — local preview.'],
  ],
  evacu: [
    [
      'evacu-guide',
      'How-it-works guide — local preview. Map data © OpenStreetMap contributors.',
    ],
    [
      'evacu-admin',
      'Operations entry page — local preview without a connected backend.',
    ],
  ],
};
let galleryProject = null;
let galleryIndex = 0;
let galleryImages = [];
function showScreenshot(index) {
  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  const item = galleryImages[galleryIndex];
  const image = document.createElement('img');
  image.src = item.src;
  image.alt = `${galleryProject.title}: ${item.caption}`;
  image.decoding = 'async';
  const art = document.querySelector('#dialog-art');
  art.className = 'dialog-art screenshot-art';
  art.replaceChildren(image);
  document.querySelector('#screenshot-caption').textContent = item.caption;
  document.querySelector('#gallery-counter').textContent =
    `${galleryIndex + 1} / ${galleryImages.length}`;
  document
    .querySelectorAll('#gallery-thumbnails button')
    .forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === galleryIndex));
    });
}
function openGallery(project, id) {
  galleryProject = project;
  galleryImages = [
    { src: project.screenshot, caption: project.screenshotCaption },
    ...extraScreenshots[id].map(([file, caption]) => ({
      src: `assets/projects/${file}.webp`,
      caption,
    })),
  ];
  document.querySelector('#gallery-thumbnails').replaceChildren(
    ...galleryImages.map((item, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Screenshot ${i + 1}: ${item.caption}`);
      const thumbnail = document.createElement('img');
      thumbnail.src = item.src;
      thumbnail.alt = '';
      thumbnail.loading = 'lazy';
      button.append(thumbnail);
      button.addEventListener('click', () => showScreenshot(i));
      return button;
    }),
  );
  showScreenshot(0);
}
document
  .querySelector('#gallery-prev')
  .addEventListener('click', () => showScreenshot(galleryIndex - 1));
document
  .querySelector('#gallery-next')
  .addEventListener('click', () => showScreenshot(galleryIndex + 1));
document
  .querySelector('#project-dialog')
  .addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showScreenshot(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation
  .querySelectorAll('a')
  .forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((filter) => {
      filter.classList.toggle('active', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    document.querySelectorAll('.project').forEach((project) => {
      project.hidden =
        button.dataset.filter !== 'all' &&
        !project.dataset.category.split(' ').includes(button.dataset.filter);
    });
  });
});

function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog
    .querySelector('.dialog-close')
    .addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () =>
    document.body.classList.remove('modal-open'),
  );
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
});
document.querySelectorAll('.project').forEach((button) => {
  button.addEventListener('click', () => {
    const project = portfolio.projects[button.dataset.project];
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-description').textContent =
      project.description;
    document.querySelector('#dialog-repository').href = project.url;
    document
      .querySelector('#dialog-repository')
      .setAttribute('aria-label', `View ${project.title} on GitHub`);
    document.querySelector('#project-dialog .dialog-note').textContent =
      project.note;
    openGallery(project, button.dataset.project);
    document.querySelector('#dialog-tags').replaceChildren(
      ...project.tags.map((tag) => {
        const span = document.createElement('span');
        span.textContent = tag;
        return span;
      }),
    );
    openDialog(document.querySelector('#project-dialog'));
  });
});
if (portfolio.email) {
  document.querySelector('#contact-message').textContent =
    'Have a project in mind? Send me a note and let’s start a conversation.';
  const emailLink = document.querySelector('#email-link');
  const subject = 'Portfolio inquiry';
  const gmailUrl = new URL('https://mail.google.com/mail/');
  gmailUrl.search = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: portfolio.email,
    su: subject,
  }).toString();
  emailLink.href = gmailUrl.href;
  document.querySelector('#email-app-link').href =
    `mailto:${portfolio.email}?subject=${encodeURIComponent(subject)}`;
  document.querySelector('#email-address').textContent = portfolio.email;
  const copyEmail = document.querySelector('#copy-email');
  copyEmail.hidden = false;
  copyEmail.addEventListener('click', async () => {
    const status = document.querySelector('#email-status');
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(portfolio.email);
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = `Please select and copy the address: ${portfolio.email}`;
    }
  });
}
document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const body = `Hi Robin,\n\n${data.get('message')}\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nOrganization: ${data.get('organization') || 'Not specified'}\nServices: ${data.get('service') || 'Not specified'}`;
  const draft = new URL('https://mail.google.com/mail/');
  draft.search = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: portfolio.email,
    su: `Project inquiry from ${data.get('name')}`,
    body,
  });
  const link = document.querySelector('#email-link');
  link.href = draft.href;
  document.querySelector('#email-app-link').href =
    `mailto:${portfolio.email}?subject=${encodeURIComponent(`Project inquiry from ${data.get('name')}`)}&body=${encodeURIComponent(body)}`;
  link.click();
  document.querySelector('#email-status').textContent =
    'Draft prepared. If Gmail did not open, choose Email Robin below. Your message has not been sent yet.';
});
document
  .querySelector('#contact-open')
  .addEventListener('click', () =>
    openDialog(document.querySelector('#contact-dialog')),
  );
function updateTime() {
  document.querySelector('#local-time').textContent =
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date()) + ' PHT';
}
updateTime();
setInterval(updateTime, 60000);
