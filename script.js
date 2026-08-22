const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealElements = [...document.querySelectorAll('.reveal')];
let revealFramePending = false;

function updateReveals() {
  const viewportHeight = window.innerHeight;
  const entryLine = viewportHeight * 0.88;
  const exitLine = viewportHeight * 0.3;

  revealElements.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    const hasEntered = bounds.top < entryLine;
    const isLeavingAbove = bounds.bottom < exitLine;

    if (isLeavingAbove) {
      element.classList.remove('visible');
      element.classList.add('past');
    } else if (hasEntered) {
      element.classList.remove('past');
      element.classList.add('visible');
    } else {
      element.classList.remove('visible', 'past');
    }
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
updateReveals();
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const imagesApiUrl = 'http://localhost:3000/api/images';

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

      const element = document.querySelector(`[data-image-slot="${CSS.escape(image.slot)}"]`);
      if (!element) return;

      element.style.backgroundImage = `url("${image.url.replaceAll('"', '%22')}")`;
      if (image.alt) element.setAttribute('aria-label', image.alt);

      const caption = element.querySelector('span');
      if (caption && image.caption) caption.textContent = image.caption;
    });
  } catch (error) {
    console.warn('Using built-in image fallbacks because the image API is unavailable.', error);
  }
}

loadImages();
