const CREDENTIALS = {
  username: "admin",
  password: "topenglish2026"
};

const DEFAULT_DATA = {
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
  method1Title: "Metodologia",
  method1Text: "Informações sobre a proposta de ensino e o funcionamento das aulas.",
  method2Title: "Aulas individuais",
  method2Text: "Uma opção para quem busca um atendimento mais individualizado.",
  method3Title: "Aulas em grupo",
  method3Text: "Turmas organizadas conforme disponibilidade e formação dos grupos.",

  mod1Title: "Individual",
  mod1Text: "Atendimento individual, com horário definido conforme disponibilidade.",
  mod2Title: "Em grupo",
  mod2Text: "Turmas com organização de horários e disponibilidade de vagas.",
  mod3Title: "Consulte a escola",
  mod3Text: "Envie seus dados e informe seus horários para verificar as opções disponíveis.",

  address: "406 Norte, Av. LO 14, Lote 10 — Palmas - TO",
  phone: "(63) 3215-1652",
  whatsapp: "(63) 3215-1652"
};

function getData() {
  try {
    return { ...DEFAULT_DATA, ...(JSON.parse(localStorage.getItem("topEnglishSiteData")) || {}) };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

function saveData(data) {
  localStorage.setItem("topEnglishSiteData", JSON.stringify(data));
}

function setFields(data) {
  Object.keys(data).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.value = data[key];
  });
}

function readFields(data) {
  Object.keys(data).forEach(key => {
    const el = document.getElementById(key);
    if (el) data[key] = el.value;
  });
  return data;
}

const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");

function showAdmin() {
  loginView.classList.add("hidden");
  adminView.classList.remove("hidden");
  setFields(getData());
}

if (sessionStorage.getItem("topEnglishAdminLogged") === "true") showAdmin();

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    sessionStorage.setItem("topEnglishAdminLogged", "true");
    error.textContent = "";
    showAdmin();
  } else {
    error.textContent = "Usuário ou senha incorretos.";
  }
});

document.querySelectorAll(".side-link").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-link").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".admin-section").forEach(s => s.classList.remove("active-section"));
    btn.classList.add("active");
    document.getElementById(`section-${btn.dataset.section}`).classList.add("active-section");
  });
});

document.querySelectorAll(".save-section").forEach(btn => {
  btn.addEventListener("click", () => {
    const data = readFields(getData());
    saveData(data);
    const status = document.getElementById("saveStatus");
    status.textContent = "Alterações salvas ✓";
    setTimeout(() => status.textContent = "Tudo salvo", 1800);
  });
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("topEnglishAdminLogged");
  adminView.classList.add("hidden");
  loginView.classList.remove("hidden");
  document.getElementById("password").value = "";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Restaurar todo o conteúdo padrão?")) return;
  localStorage.removeItem("topEnglishSiteData");
  setFields(DEFAULT_DATA);
  document.getElementById("saveStatus").textContent = "Conteúdo padrão restaurado";
  setTimeout(() => document.getElementById("saveStatus").textContent = "Tudo salvo", 1800);
});
