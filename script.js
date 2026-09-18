const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); });
nav.addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('click', event => { if(!event.target.closest('.navigation')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.querySelector('#year').textContent = new Date().getFullYear();
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
  const message = `Hello Sawariya Crane, I need assistance.\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nService: ${data.get('service')}\nLocation: ${data.get('location')}\n\nPlease confirm availability, estimated arrival, and price.`;
  window.location.href = `https://wa.me/917231970757?text=${encodeURIComponent(message)}`;
});
