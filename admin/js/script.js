import { DEFAULT_DATA } from "./dados.js";

import { getAdminUser, login, logout, getSession } from "./auth.js";

import {
  carregarConteudo,
  salvarConteudo,
  restaurarConteudo,
} from "./conteudo.js";

import {
  mostrarLogin,
  mostrarAdmin,
  preencherCampos,
  lerCampos,
  mostrarStatus,
} from "./interface.js";

import { configurarNavegacao } from "./eventos.js";

const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

async function iniciarPainel() {
  const session = await getSession();

  if (!session) {
    mostrarLogin(loginView, adminView);
    return;
  }

  const user = await getAdminUser();

  if (!user) {
    await logout();
    mostrarLogin(loginView, adminView);
    return;
  }

  mostrarAdmin(loginView, adminView);

  const data = await carregarConteudo();

  preencherCampos(data);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  loginError.textContent = "";

  const { data, error } = await login(email, password);

  if (error) {
    console.error("Erro no login:", error);
    loginError.textContent = "E-mail ou senha incorretos.";
    return;
  }

  if (data.user.app_metadata?.role !== "admin") {
    await logout();

    loginError.textContent =
      "Esta conta não possui permissão de administrador.";

    return;
  }

  await iniciarPainel();
});

document.querySelectorAll(".save-section").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const user = await getAdminUser();

    if (!user) {
      alert("Você não possui permissão para realizar esta ação.");
      return;
    }

    const secao = btn.dataset.section;

    if (!secao) {
      console.error("O botão não possui data-section.");
      return;
    }

    const data = lerCampos(DEFAULT_DATA);

    const { error } = await salvarConteudo(data, secao, user);

    if (error) {
      console.error("Erro ao salvar:", error);
      mostrarStatus("Erro ao salvar ❌");
      return;
    }

    mostrarStatus("Alterações salvas ✓");
  });
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  const { error } = await logout();

  if (error) {
    console.error("Erro ao sair:", error);
    return;
  }

  mostrarLogin(loginView, adminView);

  document.getElementById("password").value = "";
  loginError.textContent = "";
});

document.getElementById("resetBtn").addEventListener("click", async () => {
  const confirmar = confirm("Restaurar todo o conteúdo padrão?");

  if (!confirmar) {
    return;
  }

  const user = await getAdminUser();

  if (!user) {
    alert("Você não possui permissão para realizar esta ação.");
    return;
  }

  const { error } = await restaurarConteudo(user);

  if (error) {
    console.error("Erro ao restaurar:", error);
    alert("Não foi possível restaurar o conteúdo.");
    return;
  }

  preencherCampos(DEFAULT_DATA);
  mostrarStatus("Conteúdo padrão restaurado");
});

configurarNavegacao();

iniciarPainel();
