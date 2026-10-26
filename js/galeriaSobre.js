const galleryImage = document.querySelector("#galleryImage");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");

const galleryTitle = document.querySelector("#galleryTitle");
const galleryDescription = document.querySelector("#galleryDescription");

const galleryImages = [
  {
    src: "assets/fotos/sala-de-aula.jpg",
    alt: "Alunos e a teacher Maureen em volta da mesa na sala de aula da The Top English",
    title: "Sala de aula",
    description:
      "Um espaço preparado para proporcionar uma experiência agradável de aprendizagem.",
  },
];

let currentImage = 0;
let galleryTimer;


// Exibe uma imagem
function showImage(index) {
  galleryImage.style.opacity = "0";

  setTimeout(() => {
    currentImage = index;

    galleryImage.src = galleryImages[index].src;
    galleryImage.alt = galleryImages[index].alt;

    galleryTitle.textContent = galleryImages[index].title;
    galleryDescription.textContent =
      galleryImages[index].description;

    galleryImage.style.opacity = "1";
  }, 500);
}


// Próxima imagem
function nextImage() {
  const nextIndex =
    (currentImage + 1) % galleryImages.length;

  showImage(nextIndex);
}


// Imagem anterior
function previousImage() {
  const previousIndex =
    (currentImage - 1 + galleryImages.length) %
    galleryImages.length;

  showImage(previousIndex);
}


// Reinicia o contador automático
function startGalleryTimer() {
  clearInterval(galleryTimer);

  galleryTimer = setInterval(() => {
    nextImage();
  }, 5000);
}


// Botão próxima
galleryNext.addEventListener("click", () => {
  nextImage();
  startGalleryTimer();
});


// Botão anterior
galleryPrev.addEventListener("click", () => {
  previousImage();
  startGalleryTimer();
});


// Com uma foto só, não há o que alternar: esconde as setas e não roda o timer
if (galleryImages.length > 1) {
  startGalleryTimer();
} else {
  document.querySelector(".school-gallery").classList.add("is-single");
}