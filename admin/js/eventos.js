export function configurarNavegacao() {
  const botoes = Array.from(document.querySelectorAll(".side-link"));
  const secoes = Array.from(document.querySelectorAll(".admin-section"));
  const menuToggle = document.getElementById("adminMobileMenuToggle");
  const sidebar = menuToggle?.closest(".sidebar");
  const menuLabel = menuToggle?.querySelector(".admin-menu-current-label");

  function fecharMenuMobile({ devolverFoco = false } = {}) {
    sidebar?.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir opções de seção");
    if (devolverFoco) menuToggle?.focus();
  }

  function selecionarSecao(botao) {
    const id = botao.dataset.section;
    if (!id) return;

    botoes.forEach((item) => {
      const ativo = item === botao;
      item.classList.toggle("active", ativo);
      if (ativo) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });

    secoes.forEach((secao) => {
      secao.classList.toggle("active-section", secao.id === `section-${id}`);
    });

    if (menuLabel) {
      menuLabel.textContent = botao.textContent.replace(/\s+/g, " ").trim();
    }

    // No celular, recolhe as opções depois da escolha para liberar a área de edição.
    fecharMenuMobile();
  }

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => selecionarSecao(botao));
  });

  menuToggle?.addEventListener("click", () => {
    const aberto = menuToggle.getAttribute("aria-expanded") === "true";
    sidebar?.classList.toggle("nav-open", !aberto);
    menuToggle.setAttribute("aria-expanded", String(!aberto));
    menuToggle.setAttribute("aria-label", aberto ? "Abrir opções de seção" : "Fechar opções de seção");
  });

  menuToggle?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") fecharMenuMobile({ devolverFoco: true });
  });

  const inicial = botoes.find((botao) => botao.classList.contains("active")) || botoes[0];
  if (inicial) selecionarSecao(inicial);
}
