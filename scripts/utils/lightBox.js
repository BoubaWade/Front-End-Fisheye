// const lightBoxModal = document.getElementById("lightbox_modal");
// console.log(lightBoxModal);
const closeLightBox = document.querySelector(".close_lightbox");
const previousImage = document.querySelector(".previous_image");
const nextImage = document.querySelector(".next_image");

lightBoxModal.style.display = "none";

async function getMedia() {
  let medias = [];
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  await fetch("./data/photographers.json")
    .then((res) => res.json())
    .then((datas) => {
      medias = datas.media.filter((media) => media.photographerId == id);
    });
  return {
    medias,
  };
}

function lightBoxMediaFactory(medias) {
  const { id, image, title } = medias;
  const picture = `assets/images/${image}`;

  function getLightBoxCardDOM() {
    const articleLightBox = document.createElement("article");
    articleLightBox.setAttribute("class", "article");
    articleLightBox.setAttribute("id", id);
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    const h2 = document.createElement("h2");
    h2.textContent = title;
    articleLightBox.appendChild(img);
    articleLightBox.appendChild(h2);

    return articleLightBox;
  }
  return { picture, getLightBoxCardDOM };
}

const articleContainer = document.querySelector(".article_container");
async function displayLightBoxMedia(medias) {
  medias.forEach((mediaData) => {
    const lightBoxMedia = lightBoxMediaFactory(mediaData);
    const lightBoxCardDOM = lightBoxMedia.getLightBoxCardDOM();
    articleContainer.appendChild(lightBoxCardDOM);
  });
}

async function initMediaLightBox() {
  // Récupère les medias des photographes
  const { medias } = await getMedia();
  displayLightBoxMedia(medias);
}
initMediaLightBox();

closeLightBox.addEventListener("click", () => {
  lightBoxModal.style.display = "none";
  // mediaSection.style.display = "block";
});

const lightBox = document.querySelector(".lightbox");
const lightBoxCardsDOM = document.querySelectorAll(".article");
const lightBoxWidth = lightBox.clientWidth;
// console.log(lightBoxCardsDOM.length);

const articleContainerWidth = lightBoxCardsDOM.length * lightBoxWidth;
articleContainer.style.width = `${articleContainerWidth}px`;
let position = 0;

previousImage.addEventListener("click", () => {
  position--;
  articleContainer.style.transform = `translateX(${position * 800}px)`;
});
nextImage.addEventListener("click", () => {
  if (position < 0) position++;
  articleContainer.style.transform = `translateX(${position * 800}px)`;
});
