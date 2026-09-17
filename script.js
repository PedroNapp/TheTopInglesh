const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '✕' : '☰';
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

const form = document.getElementById('interestForm');
const message = document.getElementById('formMessage');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  if (!name) return;

  message.textContent = `Obrigado, ${name}! Seu interesse foi registrado no protótipo.`;
  form.reset();
});

const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 450);
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
