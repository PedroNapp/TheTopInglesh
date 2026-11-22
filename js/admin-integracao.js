import { supabase } from "./supabase.js";
import { DEFAULT_DATA } from "../admin/js/dados.js";

async function carregarConteudo() {
  const conteudo = { ...DEFAULT_DATA };
  try {
    const { data, error } = await supabase.from("site_conteudo").select("elemento, conteudo");
    if (error) throw error;
    (data || []).forEach(({ elemento, conteudo: valor }) => {
      if (Object.prototype.hasOwnProperty.call(conteudo, elemento) && valor !== null && valor !== "") {
        conteudo[elemento] = valor;
      }
    });
  } catch (error) {
    console.warn("Usando conteúdo local de contingência:", error);
  }
  aplicarConteudo(conteudo);
}

function definir(seletor, valor, propriedade = "textContent") {
  const el = document.querySelector(seletor);
  if (el && valor !== undefined && valor !== null) el[propriedade] = valor;
}

// Atualiza os textos sem remover <strong>, <span> ou outras marcações do HTML.
function definirTituloDestacado(seletor, valor, trechoInicial, destaqueSeletor) {
  const el = document.querySelector(seletor);
  if (!el || valor === undefined || valor === null) return;

  const destaque = el.querySelector(destaqueSeletor);
  if (!destaque) {
    el.textContent = valor;
    return;
  }

  const texto = String(valor).trim();
  const inicio = String(trechoInicial);
  const posicao = texto.toLocaleLowerCase('pt-BR').indexOf(inicio.toLocaleLowerCase('pt-BR'));
  if (posicao === -1) {
    // Mantém a marcação visual caso o texto editado não siga a divisão original.
    destaque.textContent = texto;
    const primeiroNo = Array.from(el.childNodes).find((no) => no.nodeType === Node.TEXT_NODE);
    if (primeiroNo) primeiroNo.textContent = '';
    return;
  }

  const fimInicio = posicao + inicio.length;
  const textoAntes = texto.slice(0, fimInicio).trimEnd();
  const textoDepois = texto.slice(fimInicio).trim();
  const primeiroNo = Array.from(el.childNodes).find((no) => no.nodeType === Node.TEXT_NODE);
  if (primeiroNo) primeiroNo.textContent = ` ${textoAntes} `;
  else el.insertBefore(document.createTextNode(`${textoAntes} `), destaque);
  destaque.textContent = textoDepois;
}

function definirDentro(root, seletor, valor) {
  const el = root.querySelector(seletor);
  if (el && valor !== undefined && valor !== null) el.textContent = valor;
}

// O número salvo em Contato é a fonte única para todos os botões do WhatsApp.
function aplicarWhatsAppCentralizado(numeroInformado) {
  const digitos = String(numeroInformado || '').replace(/\D/g, '');
  if (!digitos) return;

  // O wa.me exige o código do país. Se o administrador informar somente DDD + número,
  // o sistema acrescenta 55; se já vier com 55, não duplica o código.
  const numero = digitos.startsWith('55') ? digitos : `55${digitos}`;
  window.SITE_CONFIG = window.SITE_CONFIG || {};
  window.SITE_CONFIG.whatsapp = numero;

  const mensagem = window.SITE_CONFIG.mensagemPadrao ||
    'Olá! Vim pelo site e gostaria de informações sobre as aulas.';
  const destino = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = destino;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

function aplicarConteudo(d) {
  definirTituloDestacado('.hero h1', d.heroTitle, 'Inglês com', 'strong');
  definir('.hero p', d.heroDescription);
  definir('.hero-actions .btn-primary', d.heroButton);

  definirTituloDestacado('#sobre h2', d.schoolTitle, 'Uma escola construída ao longo de', 'span');
  definir('#sobre .two-columns > div:first-child p:nth-of-type(1)', d.schoolText1);
  definir('#sobre .two-columns > div:first-child p:nth-of-type(2)', d.schoolText2);

  definirTituloDestacado('#metodologia h2', d.methodTitle, 'Aprender inglês para', 'span');
  definir('#metodologia .section-heading > p', d.methodDescription);
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    const n = i + 1;
    definirDentro(card, 'h3', d[`method${n}Title`]);
    definirDentro(card, 'p', d[`method${n}Text`]);
  });

  // O título e a descrição ficam na seção de cursos (não em .info-card).
  definirTituloDestacado('#cursosConteudo .section-heading h2', d.schoolCardTitle, 'Inglês para diferentes', 'span');
  definir('#cursosConteudo .section-heading > p', d.schoolCardText);

  // As sete modalidades/cursos exibidos no HTML oficial.
  document.querySelectorAll('#cursosConteudo .course-card').forEach((card, i) => {
    const n = i + 1;
    definirDentro(card, 'h3', d[`mod${n}Title`]);
    definirDentro(card, 'p', d[`mod${n}Text`]);
  });

  // Preserva os destaques estruturais da lista de valores.
  const priceItems = document.querySelectorAll('#valoresConteudo .price-item');
  priceItems.forEach((item, i) => {
    const n = i + 1;
    definirDentro(item, 'h3', d[`price${n}Name`]);
    const strong = item.querySelector('strong');
    const value = d[`price${n}Value`];
    if (strong && value !== undefined && value !== null) {
      if (n === 12 && String(value).includes(' conforme ')) {
        const partes = String(value).split(' conforme ');
        strong.replaceChildren(document.createTextNode(`${partes[0]} conforme `), document.createElement('br'), document.createTextNode(partes.slice(1).join(' conforme ')));
      } else {
        strong.textContent = value;
      }
    }
  });
  definir('#valoresConteudo .prices-note', d.pricesNote);

  const contatos = document.querySelectorAll('.contact-card');
  if (contatos[0]) {
    const endereco = contatos[0].querySelector('p');
    if (endereco && d.address !== undefined) {
      const partes = String(d.address).split(/\n|\s+—\s+/);
      endereco.replaceChildren(document.createTextNode(partes[0] || ''), document.createElement('br'), document.createTextNode(partes.slice(1).join(' ').replace(/^Palmas\s*-\s*TO$/, 'Palmas - TO')));
    }
  }
  if (contatos[1]) definirDentro(contatos[1], 'p', d.phone);
  aplicarWhatsAppCentralizado(d.whatsapp || window.SITE_CONFIG?.whatsapp);
}

carregarConteudo();
