// Selected public repositories and current project previews.
const portfolio = {
  email: 'robinwaje09@gmail.com',
  projects: {
    campus: {
      title: 'CampusMarketplace',
      screenshot: 'assets/projects/campus-current.webp',
      screenshotCaption:
        'Find campus essentials through keyword search and category shortcuts, or start selling an item. Local preview with no listings loaded.',
      description:
        'A full-stack marketplace for university communities to buy, sell, and trade items. Includes searchable listings, image galleries, real-time chat, favorites, seller reviews, and an administration workflow for moderation.',
      tags: ['Flask', 'PostgreSQL', 'SQLAlchemy', 'Socket.IO', 'Bootstrap'],
      url: 'https://github.com/Rjems995/CampusMarketplace',
      note: 'Explore the source and local setup instructions on GitHub.',
    },
    evacu: {
      title: 'EvacuRosa',
      screenshot: 'assets/projects/evacu-current.webp',
      screenshotCaption:
        'Search Santa Rosa, choose a destination, and select a travel mode to begin planning an evacuation route. Local preview without live routing data. Map data © OpenStreetMap contributors.',
      description:
        'My capstone research project: a multi-hazard evacuation decision-support system for Santa Rosa City. My role focuses on UI/UX design, making hazard, route, and evacuation-center information easier to navigate. The system combines fuzzy-logic risk assessment with A* routing and supports offline route calculations.',
      tags: [
        'UI/UX Design',
        'Capstone Research',
        'Next.js',
        'TypeScript',
        'Leaflet',
        'Supabase',
      ],
      url: 'https://github.com/Alenlen1/EvacuRosa',
      note: 'Local frontend preview. Route recommendations depend on current hazard and shelter data and do not replace official emergency guidance.',
    },
    spacesketch: {
      title: 'SpaceSketch',
      screenshot: 'assets/projects/spacesketch.webp',
      screenshotCaption:
        'Explore the space-planning concept through a furnished 3D scene, then choose to start building or explore a space. Local homepage preview.',
      description:
        'An interior and outdoor space planner with connected 2D floor plans and a 3D editor. Users can draw rooms, resize walls, arrange furniture, edit doors and windows, and explore starter layouts. Supabase supports account access, cloud projects, version history, and shared viewing.',
      tags: ['Next.js', 'TypeScript', 'React', '3D Design', 'Supabase'],
      url: 'https://github.com/Rjems995/SpaceSketch',
      note: 'Public browsing preview. Creating and editing projects requires a configured Supabase account.',
    },
  },
};
const projectOutcomes = {
  campus: [
    'Student marketplace',
    'Browse listings, contact sellers in real time, and review transactions.',
  ],
  evacu: [
    'Evacuation decision support',
    'Present hazard, route, and shelter information through an approachable map interface.',
  ],
  spacesketch: [
    'From plan to space',
    'Explore starter layouts and plan indoor or outdoor spaces in connected 2D and 3D views.',
  ],
};
const projectStories = {
  campus: [
    [
      'The problem',
      'Student buying and selling involves more than listings: discovery, communication, and seller feedback all need to work together.',
    ],
    [
      'The approach',
      'Bring searchable listings, favorites, conversations, and reviews into one marketplace, with a moderation workflow.',
    ],
    [
      'Technical detail',
      'Flask and PostgreSQL support the application data, while Socket.IO supports real-time conversations.',
    ],
  ],
  evacu: [
    [
      'Capstone research',
      'A multi-hazard evacuation decision-support application for Santa Rosa City, covering flood, fire, and earthquake scenarios.',
    ],
    [
      'My role: UI/UX',
      'Design the user-facing experience and presentation of route, hazard, and shelter information.',
    ],
    [
      'Technical approach',
      'The system combines fuzzy-logic risk assessment with A* pathfinding and supports downloaded data for offline routing.',
    ],
  ],
  spacesketch: [
    [
      'The problem',
      'Spatial ideas can be difficult to communicate using a floor plan alone.',
    ],
    [
      'The approach',
      'Connect editable 2D plans with 3D space planning, furniture placement, and materials.',
    ],
    [
      'Project workflow',
      'Starter templates help users begin a design; signed-in accounts support saved projects and cloud history.',
    ],
  ],
};
const extraScreenshots = {
  campus: [
    [
      'campus-current-browse',
      'Narrow listings by category, budget, condition, and location to find a suitable item. The empty state offers a way to clear filters; this local preview has no listings.',
    ],
    [
      'campus-current-register',
      'Create a student account with a name, email, and confirmed password to join the campus marketplace. Registration form shown in a local preview.',
    ],
  ],
  evacu: [
    [
      'evacu-details',
      'Review evacuation-center capacity and location alongside the map to help choose a destination. No shelter records are loaded in this local preview.',
    ],
    [
      'evacu-options',
      'Review flood, fire, and earthquake reports alongside the map to understand reported road impacts. No operational hazard data is loaded in this local preview.',
    ],
    [
      'evacu-mobile-map',
      'Search for a destination on a phone while keeping map, shelter, and emergency controls within reach. Local preview shows offline status. Map data © OpenStreetMap contributors.',
      'portrait',
    ],
    [
      'evacu-mobile-centers',
      'Find shelters by name, barangay, or address and filter for centers accepting evacuees. The mobile directory is empty in this local preview.',
      'portrait',
    ],
    [
      'evacu-mobile-hazards',
      'Check hazard summaries and reported road impacts from a phone, with a clear reminder that missing reports do not mean an all-clear. No operational reports are loaded.',
      'portrait',
    ],
  ],
  spacesketch: [
    [
      'spacesketch-templates',
      'Choose a room, apartment, office, or outdoor template as a starting point for a layout, or begin with an empty room. Public template selection preview.',
    ],
    [
      'spacesketch-login',
      'Sign in to return to saved designs, or switch to sign-up to create an account. Account access is unavailable in this local preview; local design remains available.',
    ],
  ],
};
const menuButton = document.querySelector('.menu-toggle');
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
  art.classList.toggle('is-portrait', item.orientation === 'portrait');
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
    ...extraScreenshots[id].map(([file, caption, orientation]) => ({
      src: `assets/projects/${file}.webp`,
      caption,
      orientation,
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
      if (item.orientation === 'portrait') {
        const label = document.createElement('span');
        label.className = 'gallery-device-label';
        label.textContent = 'Mobile';
        button.append(label);
      }
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
    if (event.target.closest('#project-interaction')) return;
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
    document.body.classList.toggle(
      'modal-open',
      !!document.querySelector('dialog[open]'),
    ),
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
const projectDialog = document.querySelector('#project-dialog');
const projectCards = [...document.querySelectorAll('.project')];
const projectOrder = projectCards.map((button) => button.dataset.project);
const nextProjectButton = document.querySelector('#project-next');

function showProject(id) {
  const project = portfolio.projects[id];
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent =
    project.description;
  window.updateProjectInteraction(id);
  document.querySelector('#dialog-story').replaceChildren(
    ...projectStories[id].map(([title, copy]) => {
      const section = document.createElement('section');
      const heading = document.createElement('h3');
      heading.textContent = title;
      const paragraph = document.createElement('p');
      paragraph.textContent = copy;
      section.append(heading, paragraph);
      return section;
    }),
  );
  const [label, outcome] = projectOutcomes[id];
  const heading = document.createElement('h3');
  heading.textContent = label;
  const detail = document.createElement('p');
  detail.textContent = outcome;
  document.querySelector('#dialog-outcomes').replaceChildren(heading, detail);
  document.querySelector('#dialog-repository').href = project.url;
  document
    .querySelector('#dialog-repository')
    .setAttribute('aria-label', `View ${project.title} on GitHub`);
  document.querySelector('#project-dialog .dialog-note').textContent =
    project.note;
  openGallery(project, id);
  document.querySelector('#dialog-tags').replaceChildren(
    ...project.tags.map((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }),
  );
  const index = projectOrder.indexOf(id);
  const nextId = projectOrder[(index + 1) % projectOrder.length];
  const nextTitle = portfolio.projects[nextId].title;
  nextProjectButton.dataset.project = nextId;
  nextProjectButton.setAttribute('aria-label', `Next project: ${nextTitle}`);
  document.querySelector('#project-next-title').textContent = nextTitle;
  document.querySelector('#project-position').textContent =
    `${project.title} · Project ${index + 1} of ${projectOrder.length}`;
  if (!projectDialog.open) openDialog(projectDialog);
  projectDialog.scrollTop = 0;
}

projectCards.forEach((button) => {
  button.addEventListener('click', () => {
    showProject(button.dataset.project);
  });
});
nextProjectButton.addEventListener('click', () => {
  showProject(nextProjectButton.dataset.project);
  projectDialog.querySelector('.dialog-close').focus({ preventScroll: true });
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
const contactForm = document.querySelector('#contact-form');
const copyPortfolio = document.querySelector('#copy-portfolio');
const portfolioUrl = document.querySelector('link[rel="canonical"]').href;
const shareStatus = document.querySelector('#portfolio-share-status');
const shareFallback = document.querySelector('#portfolio-share-fallback');
const shareUrl = document.querySelector('#portfolio-share-url');
shareUrl.value = portfolioUrl;
copyPortfolio.hidden = false;
document.querySelector('#portfolio-share-feedback').hidden = false;
let copyingPortfolio = false;
copyPortfolio.addEventListener('click', async () => {
  if (copyingPortfolio) return;
  copyingPortfolio = true;
  shareStatus.textContent = '';
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(portfolioUrl);
    shareFallback.hidden = true;
    shareStatus.textContent = 'Portfolio link copied. Ready to share!';
  } catch {
    shareFallback.hidden = false;
    shareStatus.textContent =
      'Copy the selected link below to share my portfolio.';
    shareUrl.focus({ preventScroll: true });
    shareUrl.select();
  } finally {
    copyingPortfolio = false;
  }
});
contactForm.addEventListener('change', (event) => {
  if (event.target.name !== 'email-client') return;
  const useEmailApp = event.target.value === 'email-app';
  document.querySelector('#draft-submit').textContent = useEmailApp
    ? 'Open email app'
    : 'Open Gmail draft';
  document.querySelector('#draft-help').textContent = useEmailApp
    ? 'Open a draft in your default email app, then review and send it there.'
    : 'Open a Gmail draft in a new tab, then review and send it there.';
  document.querySelector('#email-status').textContent = '';
});

contactForm.addEventListener('submit', (event) => {
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
  document.querySelector('#email-link').href = draft.href;
  document.querySelector('#email-app-link').href =
    `mailto:${portfolio.email}?subject=${encodeURIComponent(`Project inquiry from ${data.get('name')}`)}&body=${encodeURIComponent(body)}`;
  const useEmailApp = data.get('email-client') === 'email-app';
  document.querySelector('#email-status').textContent = useEmailApp
    ? 'Draft prepared for your email app. Review and send it there. If no app opened, try Open Gmail below.'
    : 'Draft prepared for Gmail. Review and send it in the new tab. If it did not open, try Open Gmail below or use your email app.';
  document
    .querySelector(useEmailApp ? '#email-app-link' : '#email-link')
    .click();
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
