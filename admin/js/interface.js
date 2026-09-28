export function mostrarLogin(loginView, adminView) {
  loginView.classList.remove("hidden");
  adminView.classList.add("hidden");
}

export function mostrarAdmin(loginView, adminView) {
  loginView.classList.add("hidden");
  adminView.classList.remove("hidden");
}

export function preencherCampos(data) {
  Object.keys(data).forEach((key) => {
    const elemento = document.getElementById(key);

    if (elemento) {
      elemento.value = data[key];
    }
  });
}

export function lerCampos(data) {
  const novoData = { ...data };

  Object.keys(novoData).forEach((key) => {
    const elemento = document.getElementById(key);

    if (elemento) {
      novoData[key] = elemento.value;
    }
  });

  return novoData;
}

export function mostrarStatus(mensagem, tempo = 1800) {
  const status = document.getElementById("saveStatus");

  if (!status) {
    return;
  }

  status.textContent = mensagem;

  if (tempo > 0) {
    setTimeout(() => {
      status.textContent = "Tudo salvo";
    }, tempo);
  }
}
