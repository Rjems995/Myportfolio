// Selected public repositories from github.com/Rjems995.
const portfolio = {
  email: 'robinwaje09@gmail.com',
  projects: {
    tally: {
      title: 'Tally',
      description:
        'A receipt scanner and expense tracker that turns photos into searchable spending records. Browser-local OCR, editable receipt review, analytics, and exports connect to a Python and SQLite backend. Capacitor projects extend the app to mobile, with an Android preview and an iOS build workflow.',
      tags: ['JavaScript', 'Python', 'SQLite', 'Tesseract OCR', 'Capacitor'],
      url: 'https://github.com/Rjems995/Tally',
      note: 'The Android preview uses temporary demo data. Mobile store releases are not published.',
    },
    campus: {
      title: 'Campus Marketplace',
      description:
        'A full-stack marketplace for university communities to buy, sell, and trade items. Includes searchable listings, image galleries, real-time chat, favorites, seller reviews, and an administration workflow for moderation.',
      tags: ['Flask', 'PostgreSQL', 'SQLAlchemy', 'Socket.IO', 'Bootstrap'],
      url: 'https://github.com/Rjems995/CampusMarketplace',
      note: 'Explore the source and local setup instructions on GitHub.',
    },
    evacu: {
      title: 'EVACU-ROSA',
      description:
        'A map-first evacuation application for Santa Rosa City, Laguna. Combines street-hazard reporting, transport-aware shelter routing, GPS guidance, and downloadable offline directions. Built with A* routing, fuzzy inference, and a geospatial database.',
      tags: ['Next.js', 'TypeScript', 'Leaflet', 'Supabase', 'PostGIS'],
      url: 'https://github.com/Rjems995/EVACU-ROSA-v1',
      note: 'A development project requiring verified shelters, operational data, and field validation before real-world use.',
    },
  },
};

const menuButton = document.querySelector('.menu-toggle');
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
    const art = document.querySelector('#dialog-art');
    art.className = `dialog-art ${button.dataset.project}-preview`;
    art.replaceChildren(
      ...Array.from(button.querySelector('.project-hover').children, (child) =>
        child.cloneNode(true),
      ),
    );
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
