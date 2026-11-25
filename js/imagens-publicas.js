import { supabase } from "./supabase.js";

async function aplicarImagensSalvas() {
  const elementos = document.querySelectorAll("[data-image-slot]");
  if (!elementos.length) return;

  const { data, error } = await supabase
    .from("site_imagens")
    .select("chave,caminho,alt");

  if (error) {
    console.warn("Não foi possível carregar as imagens do Supabase; usando imagens locais.", error);
    return;
  }

  const imagens = new Map((data || []).map((item) => [item.chave, item]));
  elementos.forEach((elemento) => {
    const imagem = imagens.get(elemento.dataset.imageSlot);
    if (!imagem) return;
    const { data: publicData } = supabase.storage.from("imagens-site").getPublicUrl(imagem.caminho);
    if (publicData?.publicUrl) elemento.src = publicData.publicUrl;
    if (imagem.alt) elemento.alt = imagem.alt;
  });
}

aplicarImagensSalvas();
