import { supabase } from "./supabase.js";

async function carregarConteudo() {
  const { data, error } = await supabase
    .from("site_conteudo")
    .select("elemento, conteudo");

  if (error) {
    console.error("Erro ao carregar conteúdo:", error);
    return;
  }

  const conteudo = {};

  data.forEach((item) => {
    conteudo[item.elemento] = item.conteudo;
  });

  aplicarConteudo(conteudo);
}

function aplicarConteudo(d) {
  // Página inicial
  document.querySelector(".hero h1").innerHTML =
    `${d.heroTitle} `.replace(/(\S+)\s*$/, "<strong>$1</strong>");

  document.querySelector(".hero p").textContent =
    d.heroDescription;

  document.querySelector(".hero-actions .btn-primary").textContent =
    d.heroButton;


  // A escola
  document.querySelector("#sobre h2").textContent =
    d.schoolTitle;

  document.querySelector(
    "#sobre .two-columns > div:first-child p:nth-of-type(1)"
  ).textContent = d.schoolText1;

  document.querySelector(
    "#sobre .two-columns > div:first-child p:nth-of-type(2)"
  ).textContent = d.schoolText2;

  document.querySelector(".info-card h3").textContent =
    d.schoolCardTitle;

  document.querySelector(".info-card p").textContent =
    d.schoolCardText;


  // Metodologia
  document.querySelector("#metodologia h2").textContent =
    d.methodTitle;

  document.querySelector("#metodologia .section-heading > p").textContent =
    d.methodDescription;

  const cards = document.querySelectorAll(".feature-card");

  const metodos = [
    [d.method1Title, d.method1Text],
    [d.method2Title, d.method2Text],
    [d.method3Title, d.method3Text]
  ];

  cards.forEach((card, i) => {
    card.querySelector("h3").textContent = metodos[i][0];
    card.querySelector("p").textContent = metodos[i][1];
  });


  // Modalidades
  const modalidades = document.querySelectorAll(".modality");

  const mods = [
    [d.mod1Title, d.mod1Text],
    [d.mod2Title, d.mod2Text],
    [d.mod3Title, d.mod3Text]
  ];

  modalidades.forEach((item, i) => {
    item.querySelector("h3").textContent = mods[i][0];
    item.querySelector("p").textContent = mods[i][1];
  });


  // Contato
  const contatos = document.querySelectorAll(".contact-card");

  contatos[0].querySelector("p").innerHTML =
    d.address.replace(" — ", "<br>");

  contatos[1].querySelector("p").textContent =
    d.phone;

  contatos[2].querySelector("a").href =
    `https://wa.me/55${d.whatsapp.replace(/\D/g, "")}`;
}

carregarConteudo();
