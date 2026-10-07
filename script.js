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

const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 450);
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================
// TROCA ENTRE CURSOS E VALORES
// =========================

const btnConsultarValores =
  document.getElementById("btnConsultarValores");

const btnVoltarCursos =
  document.getElementById("btnVoltarCursos");

const cursosConteudo =
  document.getElementById("cursosConteudo");

const valoresConteudo =
  document.getElementById("valoresConteudo");

btnConsultarValores.addEventListener("click", () => {
  cursosConteudo.hidden = true;
  valoresConteudo.hidden = false;
});

btnVoltarCursos.addEventListener("click", () => {
  valoresConteudo.hidden = true;
  cursosConteudo.hidden = false;
});