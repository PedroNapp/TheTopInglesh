import { supabase } from "../../js/supabase.js";

const BUCKET = "imagens-site";
const MAX_BYTES = 5 * 1024 * 1024;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];
const GALLERY_PREFIX = "galeria_";

function status(message, error = false) {
  const el = document.getElementById("imageStatus");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("is-error", error);
}

function validarArquivo(file) {
  if (!file) throw new Error("Selecione uma imagem.");
  if (!TIPOS.includes(file.type)) throw new Error("Use JPG, PNG ou WebP.");
  if (file.size > MAX_BYTES) throw new Error("Cada imagem deve ter no máximo 5 MB.");
}

function extensao(file) {
  return ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" })[file.type];
}

function criarTextosAutomaticos(nomeInformado) {
  const nome = nomeInformado.trim().replace(/\s+/g, " ");
  const nomeFormatado = nome.charAt(0).toLocaleUpperCase("pt-BR") + nome.slice(1);
  return {
    nome: nomeFormatado,
    alt: `${nomeFormatado}, imagem da The Top English.`,
  };
}

async function usuarioAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") throw new Error("Apenas administradores podem gerenciar imagens.");
  return user;
}

async function enviarArquivo({ chave, nome, descricao = "", alt, file, ordem = 0 }) {
  validarArquivo(file);
  const user = await usuarioAdmin();
  const caminho = `${chave}/${Date.now()}-${crypto.randomUUID()}.${extensao(file)}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(caminho, file, {
    cacheControl: "3600", contentType: file.type, upsert: false,
  });
  if (uploadError) throw uploadError;

  const registro = {
    chave, nome, descricao, caminho, alt,
    ordem,
    atualizado_em: new Date().toISOString(),
    atualizado_por: user.id,
  };
  const { error: dbError } = await supabase.from("site_imagens").upsert(registro, { onConflict: "chave" });
  if (dbError) {
    await supabase.storage.from(BUCKET).remove([caminho]);
    throw dbError;
  }
  return supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
}

async function carregarGaleria() {
  const container = document.getElementById("galleryAdminList");
  if (!container) return;
  const { data, error } = await supabase.from("site_imagens")
    .select("chave,nome,descricao,caminho,alt,ordem")
    .like("chave", `${GALLERY_PREFIX}%`)
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });
  if (error) {
    status(`Não foi possível carregar a galeria: ${error.message}`, true);
    return;
  }
  container.replaceChildren();
  if (!data?.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Sua galeria ainda está vazia. Adicione a primeira imagem acima.";
    container.append(empty);
    return;
  }

  data.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "gallery-admin-card";
    const img = document.createElement("img");
    img.src = supabase.storage.from(BUCKET).getPublicUrl(item.caminho).data.publicUrl;
    img.alt = item.alt || item.nome;
    const details = document.createElement("div");
    details.className = "gallery-admin-details";
    const title = document.createElement("strong");
    title.textContent = item.nome;
    const description = document.createElement("p");
    description.textContent = item.descricao || "Esta imagem ainda não possui descrição.";
    const position = document.createElement("small");
    position.textContent = `Posição ${index + 1} no carrossel`;
    details.append(title, description, position);
    const actions = document.createElement("div");
    actions.className = "gallery-admin-actions";

    const up = document.createElement("button");
    up.type = "button"; up.className = "btn btn-gallery-move btn-small";
    up.textContent = "↑"; up.title = "Mover para cima"; up.setAttribute("aria-label", `Mover ${item.nome} para cima`); up.disabled = index === 0;
    up.addEventListener("click", () => alterarOrdem(data, index, index - 1));

    const down = document.createElement("button");
    down.type = "button"; down.className = "btn btn-gallery-move btn-small";
    down.textContent = "↓"; down.title = "Mover para baixo"; down.setAttribute("aria-label", `Mover ${item.nome} para baixo`); down.disabled = index === data.length - 1;
    down.addEventListener("click", () => alterarOrdem(data, index, index + 1));

    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "btn btn-danger btn-small";
    remove.textContent = "Remover";
    remove.addEventListener("click", () => removerImagem(item));
    actions.append(up, down, remove);
    card.append(img, details, actions);
    container.append(card);
  });
}

async function alterarOrdem(items, from, to) {
  if (to < 0 || to >= items.length) return;
  const reordered = [...items];
  [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
  try {
    await usuarioAdmin();
    for (let i = 0; i < reordered.length; i++) {
      const { error } = await supabase.from("site_imagens").update({ ordem: i + 1 }).eq("chave", reordered[i].chave);
      if (error) throw error;
    }
    status("Ordem da galeria atualizada.");
    await carregarGaleria();
  } catch (error) { status(error.message, true); }
}

async function removerImagem(item) {
  if (!confirm(`Remover “${item.nome}” da galeria?`)) return;
  try {
    await usuarioAdmin();
    const { error: dbError } = await supabase.from("site_imagens").delete().eq("chave", item.chave);
    if (dbError) throw dbError;
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([item.caminho]);
    if (storageError) console.warn("Registro removido, mas o arquivo antigo não pôde ser apagado:", storageError);
    status("Imagem removida da galeria.");
    await carregarGaleria();
  } catch (error) { status(error.message, true); }
}

async function carregarImagemFixa(chave, previewId) {
  const { data } = await supabase.from("site_imagens").select("caminho").eq("chave", chave).maybeSingle();
  if (!data?.caminho) return;
  const url = supabase.storage.from(BUCKET).getPublicUrl(data.caminho).data.publicUrl;
  const preview = document.getElementById(previewId);
  if (preview) preview.src = url;
}

let configured = false;
export function configurarGerenciadorImagens() {
  if (configured) return;
  configured = true;

  const galleryDialog = document.getElementById("galleryAddDialog");
  const openGalleryDialog = document.getElementById("openGalleryDialogBtn");
  const closeGalleryDialog = () => {
    if (galleryDialog?.open) galleryDialog.close();
  };

  openGalleryDialog?.addEventListener("click", () => {
    galleryDialog?.showModal();
    document.getElementById("galleryImageTitle")?.focus();
  });
  document.getElementById("closeGalleryDialogBtn")?.addEventListener("click", closeGalleryDialog);
  document.getElementById("cancelGalleryDialogBtn")?.addEventListener("click", closeGalleryDialog);
  galleryDialog?.addEventListener("click", (event) => {
    if (event.target === galleryDialog) closeGalleryDialog();
  });

  document.querySelectorAll(".upload-image").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.key;
      const input = document.getElementById(`file-${key.replaceAll("_", "-")}`);
      const file = input?.files?.[0];
      button.disabled = true;
      try {
        if (!file) throw new Error("Selecione uma imagem antes de enviar.");
        status("Enviando imagem...");
        const url = await enviarArquivo({
          chave: key, nome: button.dataset.label, alt: button.dataset.alt,
          file, ordem: 0,
        });
        const preview = document.getElementById(`preview-${key.replaceAll("_", "-")}`);
        if (preview) preview.src = url;
        input.value = "";
        status("Imagem atualizada com sucesso.");
      } catch (error) { status(error.message || "Falha ao enviar imagem.", true); }
      finally { button.disabled = false; }
    });
  });

  [["file-professora", "preview-professora"], ["file-escola-galeria", "preview-escola-galeria"]]
    .forEach(([inputId, previewId]) => {
      const input = document.getElementById(inputId);
      input?.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file || !TIPOS.includes(file.type)) return;
        const preview = document.getElementById(previewId);
        if (preview) preview.src = URL.createObjectURL(file);
      });
    });

  document.getElementById("addGalleryImagesBtn")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const input = document.getElementById("galleryFiles");
    const file = input?.files?.[0];
    const nomeInformado = document.getElementById("galleryImageTitle")?.value || "";
    const descricaoInformada = document.getElementById("galleryImageDescription")?.value || "";
    if (!file) { status("Escolha uma foto para adicionar à galeria.", true); return; }
    if (!nomeInformado.trim()) { status("Informe um nome simples para a imagem.", true); return; }
    if (!descricaoInformada.trim()) { status("Escreva uma descrição para a imagem.", true); return; }
    button.disabled = true;
    try {
      validarArquivo(file);
      status("Adicionando foto à galeria...");
      const { data: current, error } = await supabase.from("site_imagens")
        .select("ordem").like("chave", `${GALLERY_PREFIX}%`)
        .order("ordem", { ascending: false }).limit(1);
      if (error) throw error;
      const textos = criarTextosAutomaticos(nomeInformado);
      const key = `${GALLERY_PREFIX}${crypto.randomUUID().replaceAll("-", "").slice(0, 16)}`;
      const order = (current?.[0]?.ordem || 0) + 1;
      await enviarArquivo({
        chave: key,
        ...textos,
        descricao: descricaoInformada.trim(),
        file,
        ordem: order,
      });
      input.value = "";
      document.getElementById("galleryImageTitle").value = "";
      document.getElementById("galleryImageDescription").value = "";
      const preview = document.getElementById("galleryUploadPreview");
      const previewWrap = document.getElementById("galleryPreviewWrap");
      if (preview) preview.removeAttribute("src");
      if (previewWrap) previewWrap.hidden = true;
      const fileName = document.getElementById("gallerySelectedFileName");
      if (fileName) fileName.textContent = "Nenhuma foto selecionada";
      closeGalleryDialog();
      status("Foto adicionada! Ela foi incluída no final do carrossel.");
      await carregarGaleria();
    } catch (error) {
      console.error(error);
      status(error.message || "Não foi possível adicionar a foto.", true);
    } finally { button.disabled = false; }
  });

  const galleryInput = document.getElementById("galleryFiles");
  galleryInput?.addEventListener("change", () => {
    const file = galleryInput.files?.[0];
    const preview = document.getElementById("galleryUploadPreview");
    const previewWrap = document.getElementById("galleryPreviewWrap");
    const fileName = document.getElementById("gallerySelectedFileName");
    if (!file) {
      if (previewWrap) previewWrap.hidden = true;
      if (fileName) fileName.textContent = "Nenhuma foto selecionada";
      return;
    }
    if (!TIPOS.includes(file.type)) {
      status("Use uma imagem JPG, PNG ou WebP.", true);
      galleryInput.value = "";
      return;
    }
    if (preview) preview.src = URL.createObjectURL(file);
    if (previewWrap) previewWrap.hidden = false;
    if (fileName) fileName.textContent = file.name;
  });

  document.getElementById("refreshGalleryBtn")?.addEventListener("click", carregarGaleria);
  carregarImagemFixa("professora", "preview-professora");
  carregarImagemFixa("escola_galeria", "preview-escola-galeria");
  carregarGaleria();
}
