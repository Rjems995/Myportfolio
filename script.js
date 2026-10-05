// Replace the sample content here with your real project information.
const portfolio = {
  email: 'robinwaje09@gmail.com',
  projects: {
    folio: {
      title: 'Folio Studio',
      description:
        'A concept website for an independent creative studio. An editorial layout, bold typography, and a soft green palette make space for the work to speak for itself.',
      tags: ['Interface design', 'Responsive development', 'Studio concept'],
    },
    orbit: {
      title: 'Orbit Dashboard',
      description:
        'A concept productivity dashboard that brings tasks, activity, and daily priorities into one calm workspace. Designed around clear information and useful interactions.',
      tags: ['Web development', 'Dashboard', 'Product concept'],
    },
    forma: {
      title: 'Forma Objects',
      description:
        'A concept storefront for thoughtfully made everyday objects. Warm neutrals, simple shapes, and generous spacing create an understated shopping experience.',
      tags: ['Art direction', 'Interface design', 'Commerce concept'],
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
  emailLink.href = `mailto:${portfolio.email}`;
  emailLink.hidden = false;
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
