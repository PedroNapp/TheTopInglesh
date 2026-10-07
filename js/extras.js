/*
  The Top English: extras do site (portados do projeto thetopenglish).
  1. Botão flutuante de WhatsApp: abre a conversa com a mensagem "Vim pelo site"
     e some nas seções do início e do formulário (onde já há botão próprio).
  2. Modo revisão: abra o site com ?revisar no endereço para destacar o conteúdo
     que ainda precisa ser confirmado com a escola (itens com data-confirmar).
*/
(function () {
  'use strict';

  var config = window.SITE_CONFIG || {};
  var params = new URLSearchParams(window.location.search);

  function digitos(texto) {
    return String(texto || '').replace(/\D/g, '');
  }

  /* ---------- 1. Botão flutuante de WhatsApp ---------- */

  var numero = digitos(config.whatsapp);
  var mensagem = config.mensagemPadrao || 'Olá! Vim pelo site.';

  document.querySelectorAll('[data-whatsapp]').forEach(function (link) {
    // Sem número configurado, o botão continua levando ao formulário.
    if (numero) {
      link.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem);
      link.target = '_blank';
      link.rel = 'noopener';
    }
    link.addEventListener('click', function () {
      if (window.umami && typeof window.umami.track === 'function') {
        window.umami.track('whatsapp-clique');
      }
    });
  });

  var flutuante = document.querySelector('.float-whatsapp');

  if (flutuante) {
    if ('IntersectionObserver' in window) {
      var visiveis = [];
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          var posicao = visiveis.indexOf(entrada.target);
          if (entrada.isIntersecting && posicao === -1) visiveis.push(entrada.target);
          if (!entrada.isIntersecting && posicao !== -1) visiveis.splice(posicao, 1);
        });
        flutuante.classList.toggle('is-hidden', visiveis.length > 0);
      }, { threshold: 0.1 });
      ['inicio', 'interesse'].forEach(function (id) {
        var secao = document.getElementById(id);
        if (secao) observador.observe(secao);
      });
    } else {
      flutuante.classList.remove('is-hidden');
    }
  }

  /* ---------- 2. Modo revisão ---------- */

  if (params.has('revisar')) {
    document.documentElement.classList.add('review-mode');
    var total = document.querySelectorAll('[data-confirmar]').length;
    var barra = document.createElement('p');
    barra.className = 'review-bar';
    barra.textContent = 'Modo revisão: ' + total + ' itens tracejados precisam ser confirmados com a escola antes de publicar.';
    document.body.insertBefore(barra, document.body.firstChild);
  }
})();
