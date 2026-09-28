export function configurarNavegacao() {
  document.querySelectorAll(".side-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".side-link")
        .forEach((button) => button.classList.remove("active"));

      document
        .querySelectorAll(".admin-section")
        .forEach((section) => section.classList.remove("active-section"));

      btn.classList.add("active");

      const section = document.getElementById(`section-${btn.dataset.section}`);

      if (section) {
        section.classList.add("active-section");
      }
    });
  });
}
