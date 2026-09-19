const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); });
nav.addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('click', event => { if(!event.target.closest('.navigation')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.querySelector('#year').textContent = new Date().getFullYear();
// Gallery links still work when the dialog API is unavailable.
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const galleryDialog = document.querySelector('#gallery-dialog');
const lightboxImage = document.querySelector('#lightbox-image');
let photoIndex = 0;
let galleryOpener;
function showPhoto(index) {
  photoIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[photoIndex];
  lightboxImage.src = item.href;
  lightboxImage.alt = item.querySelector('img').alt;
  document.querySelector('#lightbox-title').textContent = item.dataset.title;
  document.querySelector('#lightbox-count').textContent = `${photoIndex + 1} / ${galleryItems.length}`;
}
if (typeof galleryDialog.showModal === 'function') {
  galleryItems.forEach((item, index) => item.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    galleryOpener = item;
    showPhoto(index);
    galleryDialog.showModal();
    document.body.classList.add('viewer-open');
  }));
  galleryDialog.querySelector('.lightbox-close').addEventListener('click', () => galleryDialog.close());
  galleryDialog.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
  galleryDialog.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(photoIndex + 1));
  galleryDialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      galleryDialog.close();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  galleryDialog.addEventListener('click', event => {
    const rect = galleryDialog.getBoundingClientRect();
    if (event.target === galleryDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) galleryDialog.close();
  });
  galleryDialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    galleryOpener?.focus({preventScroll: true});
  });
}
document.querySelectorAll('.gallery-image img').forEach(img => {
  const frame = img.parentElement;
  const finish = () => {
    frame.classList.remove('is-loading');
    frame.classList.toggle('has-error', !img.naturalWidth);
  };
  img.addEventListener('load', finish);
  img.addEventListener('error', finish);
  if (img.complete) finish();
  else frame.classList.add('is-loading');
});
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('reveal-visible');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.08});
  document.querySelectorAll('.section-heading, .card, .fleet, .gallery-item, .coverage article, .request, .visit').forEach(element => {
    element.classList.add('reveal-pending');
    observer.observe(element);
  });
  const revealAll = () => {
    observer.disconnect();
    document.querySelectorAll('.reveal-pending').forEach(element => element.classList.remove('reveal-pending'));
  };
  motionPreference.addEventListener('change', event => { if (event.matches) revealAll(); });
  document.addEventListener('focusin', event => event.target.closest('.reveal-pending')?.classList.remove('reveal-pending'));
  window.addEventListener('beforeprint', revealAll);
}
const locate = document.querySelector('#locate');
const status = document.querySelector('#location-status');
locate.addEventListener('click', () => {
  if(!navigator.geolocation || !window.isSecureContext) { status.textContent = 'Location is unavailable here. Please type your area or a nearby landmark.'; return; }
  locate.disabled = true; status.textContent = 'Finding your location…';
  navigator.geolocation.getCurrentPosition(({coords}) => {
    document.querySelector('#location').value = `https://www.google.com/maps?q=${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`;
    status.textContent = 'Location added. You can also add a nearby landmark.'; locate.disabled = false;
  }, () => { status.textContent = 'Could not get your location. Please type your area or a nearby landmark.'; locate.disabled = false; }, {enableHighAccuracy:true, timeout:12000, maximumAge:60000});
});
document.querySelector('#tow-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  form.querySelectorAll('input').forEach(input => { input.value = input.value.trim(); });
  if(!form.reportValidity()) return;
  const data = new FormData(form);
  const message = `Hello Monu Crane Service, I need assistance.\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nService: ${data.get('service')}\nLocation: ${data.get('location')}\n\nPlease confirm availability, estimated arrival, and price.`;
  window.location.href = `https://wa.me/917231970757?text=${encodeURIComponent(message)}`;
});
