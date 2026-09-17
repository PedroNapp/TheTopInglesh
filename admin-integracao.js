/*
  INTEGRAÇÃO DO PAINEL ADMINISTRATIVO COM O SITE PÚBLICO

  Coloque este arquivo na mesma pasta do index.html principal e adicione,
  ANTES de </body>:

  <script src="admin-integracao.js"></script>

  O painel salva os textos em localStorage. O site público lê esses dados
  e substitui os textos correspondentes.

  Para uma versão real publicada na internet, localStorage deve ser trocado
  por backend + banco de dados + autenticação segura.
*/

const TOP_ENGLISH_DEFAULTS = {
  heroTitle: "Seu inglês pode ir mais longe.",
  heroDescription: "Conheça a The Top English, sua escola de inglês em Palmas, e encontre uma forma de estudo que combine com sua rotina.",
  heroButton: "Quero estudar",
  schoolTitle: "Conheça a The Top English",
  schoolText1: "A The Top English é uma escola de idiomas voltada ao ensino de inglês. Aqui, o visitante encontra informações sobre a escola, sua metodologia, modalidades de aula e formas de contato.",
  schoolText2: "O site foi pensado para facilitar o primeiro contato de pessoas interessadas em estudar e deixar as principais informações disponíveis em um único lugar.",
  schoolCardTitle: "Inglês para diferentes objetivos",
  schoolCardText: "Conheça as opções de aulas e converse com a escola para verificar a modalidade e a disponibilidade mais adequada.",
  methodTitle: "Aprender inglês de forma organizada",
  methodDescription: "Consulte as informações da escola e entre em contato para conhecer melhor a proposta das aulas.",
  method1Title: "Metodologia", method1Text: "Informações sobre a proposta de ensino e o funcionamento das aulas.",
  method2Title: "Aulas individuais", method2Text: "Uma opção para quem busca um atendimento mais individualizado.",
  method3Title: "Aulas em grupo", method3Text: "Turmas organizadas conforme disponibilidade e formação dos grupos.",
  mod1Title: "Individual", mod1Text: "Atendimento individual, com horário definido conforme disponibilidade.",
  mod2Title: "Em grupo", mod2Text: "Turmas com organização de horários e disponibilidade de vagas.",
  mod3Title: "Consulte a escola", mod3Text: "Envie seus dados e informe seus horários para verificar as opções disponíveis.",
  address: "406 Norte, Av. LO 14, Lote 10 — Palmas - TO",
  phone: "(63) 3215-1652",
  whatsapp: "(63) 3215-1652"
};

function loadTopEnglishData() {
  try {
    return { ...TOP_ENGLISH_DEFAULTS, ...(JSON.parse(localStorage.getItem("topEnglishSiteData")) || {}) };
  } catch {
    return TOP_ENGLISH_DEFAULTS;
  }
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el && value) el.textContent = value;
}

function applyTopEnglishAdminData() {
  const d = loadTopEnglishData();

  // Página inicial
  const hero = document.querySelector(".hero h1");
  if (hero) {
    const parts = d.heroTitle.split(" ");
    const last = parts.pop();
    hero.innerHTML = `${parts.join(" ")} <strong>${last}</strong>`;
  }
  setText(".hero p", d.heroDescription);
  setText(".hero-actions .btn-primary", d.heroButton);

  // A escola
  setText("#sobre h2", d.schoolTitle);
  setText("#sobre .two-columns > div:first-child p:nth-of-type(1)", d.schoolText1);
  setText("#sobre .two-columns > div:first-child p:nth-of-type(2)", d.schoolText2);
  setText(".info-card h3", d.schoolCardTitle);
  setText(".info-card p", d.schoolCardText);

  // Metodologia
  setText("#metodologia h2", d.methodTitle);
  setText("#metodologia .section-heading > p", d.methodDescription);

  const features = document.querySelectorAll(".feature-card");
  const methods = [
    [d.method1Title, d.method1Text],
    [d.method2Title, d.method2Text],
    [d.method3Title, d.method3Text]
  ];
  features.forEach((card, i) => {
    if (!methods[i]) return;
    setText("h3", methods[i][0]); // scoped below
    const title = card.querySelector("h3");
    const text = card.querySelector("p");
    if (title) title.textContent = methods[i][0];
    if (text) text.textContent = methods[i][1];
  });

  // Modalidades
  const modalities = document.querySelectorAll(".modality");
  const mods = [
    [d.mod1Title, d.mod1Text],
    [d.mod2Title, d.mod2Text],
    [d.mod3Title, d.mod3Text]
  ];
  modalities.forEach((item, i) => {
    if (!mods[i]) return;
    const title = item.querySelector("h3");
    const text = item.querySelector("p");
    if (title) title.textContent = mods[i][0];
    if (text) text.textContent = mods[i][1];
  });

  // Contato
  const contactCards = document.querySelectorAll(".contact-card");
  if (contactCards[0]) {
    const p = contactCards[0].querySelector("p");
    if (p) p.innerHTML = d.address.replace(" — ", "<br>");
  }
  if (contactCards[1]) {
    const p = contactCards[1].querySelector("p");
    if (p) p.textContent = d.phone;
  }
  if (contactCards[2]) {
    const p = contactCards[2].querySelector("p");
    if (p) p.textContent = "Entre em contato para saber mais.";
    const link = contactCards[2].querySelector("a");
    if (link) {
      const digits = d.whatsapp.replace(/\D/g, "");
      link.href = `https://wa.me/55${digits}`;
    }
  }
}

document.addEventListener("DOMContentLoaded", applyTopEnglishAdminData);
