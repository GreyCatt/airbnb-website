const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.navigation');

function setMenuOpen(open) {
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

menuButton.addEventListener('click', () => setMenuOpen(!navigation.classList.contains('open')));

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('click', (event) => {
  if (navigation.classList.contains('open') && !navigation.contains(event.target) && !menuButton.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

window.matchMedia('(min-width: 801px)').addEventListener('change', () => setMenuOpen(false));

const revealElements = [...document.querySelectorAll('.reveal')];
let revealFramePending = false;

function updateReveals() {
  const entryLine = window.innerHeight * 0.88;

  revealElements.forEach((element) => {
    element.classList.toggle('visible', element.getBoundingClientRect().top < entryLine);
  });

  revealFramePending = false;
}

function requestRevealUpdate() {
  if (revealFramePending) return;
  revealFramePending = true;
  requestAnimationFrame(updateReveals);
}

window.addEventListener('scroll', requestRevealUpdate, { passive: true });
window.addEventListener('resize', requestRevealUpdate);
// Paint the initial state before applying the reveal classes.
requestAnimationFrame(requestRevealUpdate);
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const imagesApiUrl = '/api/images';

function isSafeImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

async function loadImages() {
  try {
    const response = await fetch(imagesApiUrl);
    if (!response.ok) throw new Error(`Image API returned ${response.status}`);

    const { images } = await response.json();
    if (!Array.isArray(images)) throw new Error('Image API returned invalid data');

    images.forEach((image) => {
      if (!image.slot || !isSafeImageUrl(image.url)) return;

      const element = [...document.querySelectorAll('[data-image-slot]')]
        .find((candidate) => candidate.dataset.imageSlot === image.slot);
      if (!element) return;

      const imageValue = `url("${image.url.replace(/"/g, '%22')}")`;
      if (element.classList.contains('booking')) {
        element.style.backgroundImage = `linear-gradient(rgba(29,42,32,.72), rgba(29,42,32,.72)), ${imageValue}`;
      } else {
        element.style.backgroundImage = imageValue;
      }
      if (image.alt) element.setAttribute('aria-label', image.alt);

      const caption = element.querySelector('span');
      if (caption && image.caption) caption.textContent = image.caption;
    });
  } catch (error) {
    console.warn('Using built-in image fallbacks because the image API is unavailable.', error);
  }
}

loadImages();
