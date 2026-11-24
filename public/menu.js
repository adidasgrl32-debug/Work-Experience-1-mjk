document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const iconOpen = document.querySelector('.icon-open');
  const iconClose = document.querySelector('.icon-close');

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');

    iconOpen.classList.toggle('hidden', isOpen);
    iconClose.classList.toggle('hidden', !isOpen);

    toggleBtn.setAttribute('aria-expanded', isOpen);
  });
});