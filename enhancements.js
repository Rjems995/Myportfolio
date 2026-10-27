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

const contributionsChart = document.querySelector('#contributions-chart');
function showContributionFallback() {
  document.querySelector('.contributions-scroll').hidden = true;
  document.querySelector('#contributions-fallback').hidden = false;
}
contributionsChart.addEventListener('error', showContributionFallback);
if (contributionsChart.complete && !contributionsChart.naturalWidth) {
  showContributionFallback();
}
