import { supabase } from "./supabase.js";

const BUCKET = "imagens-site";
const galleryImage = document.querySelector("#galleryImage");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const galleryTitle = document.querySelector("#galleryTitle");
const galleryDescription = document.querySelector("#galleryDescription");
const professorImage = document.querySelector('[data-image-slot="professora"]');

const fallbackGallery = [{
  src: "assets/fotos/sala-de-aula.jpg",
  alt: "Alunos e a teacher Maureen em volta da mesa na sala de aula da The Top English",
  title: "Sala de aula",
  description: "Um espaço preparado para proporcionar uma experiência agradável de aprendizagem.",
}];

let galleryImages = [...fallbackGallery];
let currentImage = 0;
let galleryTimer;

function showImage(index) {
  if (!galleryImage || !galleryImages.length) return;
  const item = galleryImages[index];
  galleryImage.style.opacity = "0";
  window.setTimeout(() => {
    currentImage = index;
    galleryImage.src = item.src;
    galleryImage.alt = item.alt || item.title;
    if (galleryTitle) galleryTitle.textContent = item.title || "The Top English";
    if (galleryDescription) galleryDescription.textContent = item.description || "";
    galleryImage.style.opacity = "1";
  }, 180);
}

function nextImage() {
  if (galleryImages.length < 2) return;
  showImage((currentImage + 1) % galleryImages.length);
}

function previousImage() {
  if (galleryImages.length < 2) return;
  showImage((currentImage - 1 + galleryImages.length) % galleryImages.length);
}

function startGalleryTimer() {
  window.clearInterval(galleryTimer);
  if (galleryImages.length > 1) galleryTimer = window.setInterval(nextImage, 5000);
}

async function carregarImagensGerenciadas() {
  try {
    const { data, error } = await supabase.from("site_imagens")
      .select("chave,nome,descricao,caminho,alt,ordem")
      .order("ordem", { ascending: true });
    if (error) throw error;

    const byKey = new Map((data || []).map((item) => [item.chave, item]));
    const teacher = byKey.get("professora");
    if (teacher && professorImage) {
      professorImage.src = supabase.storage.from(BUCKET).getPublicUrl(teacher.caminho).data.publicUrl;
      if (teacher.alt) professorImage.alt = teacher.alt;
    }

    let galleryItems = (data || [])
      .filter((item) => item.chave.startsWith("galeria_"))
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
      .map((item) => ({
        src: supabase.storage.from(BUCKET).getPublicUrl(item.caminho).data.publicUrl,
        alt: item.alt || item.nome,
        title: item.nome,
        description: item.descricao || (
          item.nome?.trim().toLocaleLowerCase("pt-BR") === "sala de aula"
            ? fallbackGallery[0].description
            : `${item.nome || "Este espaço"} faz parte dos ambientes e experiências de aprendizagem da The Top English.`
        ),
      }));

    // Compatibilidade: usa a foto antiga da galeria se ainda não houver itens novos.
    if (!galleryItems.length && byKey.has("escola_galeria")) {
      const legacy = byKey.get("escola_galeria");
      galleryItems = [{
        src: supabase.storage.from(BUCKET).getPublicUrl(legacy.caminho).data.publicUrl,
        alt: legacy.alt || legacy.nome,
        title: legacy.nome || "A escola",
        description: legacy.descricao || fallbackGallery[0].description,
      }];
    }

    if (galleryItems.length) {
      galleryImages = galleryItems;
      currentImage = 0;
      showImage(0);
    }
  } catch (error) {
    console.warn("Não foi possível carregar as imagens gerenciadas; usando imagens locais.", error);
  }

  const gallery = document.querySelector(".school-gallery");
  if (galleryImages.length > 1) {
    gallery?.classList.remove("is-single");
    startGalleryTimer();
  } else {
    gallery?.classList.add("is-single");
    window.clearInterval(galleryTimer);
  }
}

galleryNext?.addEventListener("click", () => { nextImage(); startGalleryTimer(); });
galleryPrev?.addEventListener("click", () => { previousImage(); startGalleryTimer(); });

carregarImagensGerenciadas();
