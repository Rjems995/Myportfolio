// Selected public repositories and current project previews.
const portfolio = {
  email: 'robinwaje09@gmail.com',
  projects: {
    campus: {
      title: 'CampusMarketplace',
      screenshot: 'assets/projects/campus-current.webp',
      screenshotCaption:
        'Updated landing page captured locally with an empty preview database.',
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
        'Current EvacuRosa public interface, captured locally. Map data ? OpenStreetMap contributors.',
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
        'SpaceSketch homepage captured from the current local build.',
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
      'Current browse page with an empty local preview database.',
    ],
    [
      'campus-current-register',
      'Current student registration interface, local preview.',
    ],
  ],
  evacu: [
    [
      'evacu-details',
      'Evacuation-center panel, local frontend preview without operational data.',
    ],
    [
      'evacu-options',
      'Hazard-information panel, local frontend preview without operational data.',
    ],
  ],
  spacesketch: [
    ['spacesketch-templates', 'Public starter layout previews.'],
    [
      'spacesketch-login',
      'Account access interface for saved projects and editing.',
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
document.querySelectorAll('.project').forEach((button) => {
  button.addEventListener('click', () => {
    const project = portfolio.projects[button.dataset.project];
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-description').textContent =
      project.description;
    document.querySelector('#dialog-story').replaceChildren(
      ...projectStories[button.dataset.project].map(([title, copy]) => {
        const section = document.createElement('section');
        const heading = document.createElement('h3');
        heading.textContent = title;
        const paragraph = document.createElement('p');
        paragraph.textContent = copy;
        section.append(heading, paragraph);
        return section;
      }),
    );
    const [label, outcome] = projectOutcomes[button.dataset.project];
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
