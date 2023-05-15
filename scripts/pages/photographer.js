async function getPhotographers() {
  let photographers = [];
  await fetch("./data/photographers.json")
    .then((res) => res.json())
    .then((datas) => (photographers = datas.photographers));
  console.log(photographers);
  return {
    photographers,
  };
}

function photographerFactory(data) {
  const result = data[0];
  const picture = `assets/photographers/${result.portrait}`;

  function getUserCardDOM() {
    const nameModal = document.querySelector(".modal h2");
    nameModal.textContent = `Contactez-moi ${result.name}`;
    const article = document.createElement("article");
    const title = document.createElement("div");
    title.setAttribute("class", "title");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `la photo de : ${result.name}`);
    const h1 = document.createElement("h1");
    h1.textContent = result.name;
    const h2 = document.createElement("h2");
    h2.textContent = `${result.city}, ${result.country}`;
    const p = document.createElement("p");
    p.textContent = result.tagline;
    const span = document.querySelector(".total_likes_container > span");
    span.textContent = `${result.price}€/Jour`;

    article.appendChild(img);
    title.appendChild(h1);
    title.appendChild(h2);
    title.appendChild(p);
    article.appendChild(title);

    return article;
  }
  return { picture, getUserCardDOM };
}
async function displayPhotographers(photographers) {
  const titleContainer = document.querySelector(".title_container");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const photographerData = photographers.filter(
    (photographer) => photographer.id == id
  );
  const photographerTitle = photographerFactory(photographerData);
  const userCardDOM = photographerTitle.getUserCardDOM();
  titleContainer.appendChild(userCardDOM);
}

async function initPhotographers() {
  const { photographers } = await getPhotographers();
  displayPhotographers(photographers);
}
initPhotographers();

async function getMedia() {
  let medias = [];
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  await fetch("./data/photographers.json")
    .then((res) => res.json())
    .then((datas) => {
      medias = datas.media.filter((media) => media.photographerId == id);
      console.log(medias);
    });
  return {
    medias,
  };
}

const lightBoxModal = document.getElementById("lightbox_modal");

function mediaFactory(medias) {
  const { id, image, video, title, likes } = medias;

  const picture = `assets/images/${image}`;
  const videoPicture = `assets/images/${video}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.setAttribute("class", "article");
    const a = document.createElement("a");
    a.setAttribute("href", `#${id}`);
    // DEBUT DE TRI ENTRE LES IMAGES ET LES VIDEOS-----------------------------
    if ("image" in medias) {
      const imgMedia = document.createElement("img");
      imgMedia.setAttribute("src", picture);
      imgMedia.setAttribute("alt", `la photo : ${title}`);
      a.appendChild(imgMedia);
    } else if ("video" in medias) {
      const videoMedia = document.createElement("video");
      videoMedia.setAttribute("src", videoPicture);
      videoMedia.setAttribute("alt", `la vidéo: ${title}`);
      videoMedia.controls = true;
      a.appendChild(videoMedia);
    }
    // FIN DU TRI ENTRE LES IMAGES ET LES VIDEOS-------------------------------

    const titleAndLikes = document.createElement("div");
    titleAndLikes.setAttribute("class", "title_likes");
    const h2 = document.createElement("h2");
    h2.textContent = title;
    const p = document.createElement("p");
    const span = document.createElement("span");
    span.setAttribute("class", "likes");
    span.innerHTML = likes;

    const i = document.createElement("i");
    i.setAttribute("class", "fa-sharp fa-solid fa-heart");
    i.setAttribute("id", "heart");
    i.setAttribute("tabindex", "0");

    article.appendChild(a);
    p.appendChild(span);
    p.appendChild(i);
    titleAndLikes.appendChild(h2);
    titleAndLikes.appendChild(p);
    article.appendChild(titleAndLikes);

    return article;
  }
  return { picture, videoPicture, getUserCardDOM };
}

const inputRadioPopularity = document.getElementById("popularity_sorted");
const inputRadioDate = document.getElementById("date_sorted");
const inputRadioTitle = document.getElementById("title_sorted");
// ----------------------------------LA FONTION DE TRI DES MEDIAS----------------------------------
function sortMedias(medias) {
  let mediasSorted;
  if (inputRadioPopularity.checked) {
    mediasSorted = medias.sort((a, b) => b.likes - a.likes);
  } else if (inputRadioDate.checked) {
    mediasSorted = medias.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  } else if (inputRadioTitle.checked) {
    mediasSorted = medias.sort((a, b) => a.title.localeCompare(b.title));
  }
  return mediasSorted;
}
// -------------------------------------------FIN----------------------------------------------------
const mediaSection = document.querySelector(".media_section");
const totalLikes = document.querySelector(".total_likes");

async function displayMedia(medias) {
  mediaSection.innerHTML = "";
  let mediasSorted = sortMedias(medias);

  let sum = 0;
  for (let i = 0; i < mediasSorted.length; i++) {
    sum += mediasSorted[i].likes;
    totalLikes.textContent = sum;
  }
  mediasSorted.forEach((mediaData) => {
    const photographerMedia = mediaFactory(mediaData);
    const mediaCardDOM = photographerMedia.getUserCardDOM();
    mediaSection.appendChild(mediaCardDOM);

    const span = mediaCardDOM.lastChild.lastChild.firstChild;
    const heart = mediaCardDOM.lastChild.lastChild.lastChild;
    let likesMedia = span.textContent;

    function updateLikes() {
      if (likesMedia === span.textContent) {
        likesMedia++;
        span.innerText = likesMedia;
        sum++;
        totalLikes.textContent = sum;
      } else {
        likesMedia--;
        span.innerHTML = likesMedia;
        likesMedia = span.textContent;
        sum--;
        totalLikes.textContent = sum;
      }
      return span.innerHTML;
    }
    heart.addEventListener("click", updateLikes);
    heart.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        updateLikes();
      }
    });

    // --------------------DEBUT POUR L'AFFICHAGE ET L'ACCECIBILITE DE LA LIGHTBOX ---------------------
    const closeLightBox = document.querySelector(".close_lightbox");
    const main = document.getElementById("main");
    const header = document.querySelector("header");
    mediaCardDOM.firstChild.addEventListener("click", () => {
      lightBoxModal.style.display = "block";
      main.setAttribute("aria-hidden", "true");
      main.setAttribute("tabindex", "-1");

      header.setAttribute("aria-hidden", "true");
      header.setAttribute("tabindex", "-1");

      lightBoxModal.setAttribute("aria-hidden", "false");
      lightBoxModal.setAttribute("tabindex", "0");

      closeLightBox.focus();
    });
    // --------------------FIN POUR L'AFFICHAGE ET L'ACCECIBILITE DE LA LIGHTBOX------------------------
  });
}
async function initMedia() {
  const { medias } = await getMedia();
  displayMedia(medias);
}
initMedia();

//  ----------------------CREATION ET GESTION DU MENU TRIEUR DES MEDIAS----------------------------//
const labelsContainer = document.querySelector(".labels_container");
const labelRadioPopularity = document.querySelector(".label_radio_popularity");
const labelRadioDate = document.querySelector(".label_radio_date");
const labelRadioTitle = document.querySelector(".label_radio_title");
const labelRadios = document.querySelectorAll(".sort_container label");
const iconVector = document.querySelector(".icon_vector");
const spanTopLabelsContainer = document.querySelector(
  ".span_top_labels_container"
);
const spanBottomLabelsContainer = document.querySelector(
  ".span_bottom_labels_container"
);

labelRadioDate.style.display = "none";
labelRadioTitle.style.display = "none";
labelRadioPopularity.style.display = "block";

function openCloseMenuSort() {
  if (
    labelRadioDate.style.display === "none" ||
    labelRadioTitle.style.display === "none" ||
    labelRadioPopularity.style.display === "none"
  ) {
    iconVector.classList.toggle("rotate");
    labelRadioDate.style.display = "block";
    labelRadioTitle.style.display = "block";
    labelRadioPopularity.style.display = "block";

    labelsContainer.children[0].style.borderRadius = "5px 5px 0 0";
    labelsContainer.children[1].style.borderRadius = "0";
    labelsContainer.children[2].style.borderRadius = "0 0 5px 5px";

    spanTopLabelsContainer.style.display = "block";
    spanBottomLabelsContainer.style.display = "block";
  } else {
    labelRadioDate.style.display = "none";
    labelRadioTitle.style.display = "none";
    iconVector.classList.toggle("rotate");
    labelRadioPopularity.style.borderRadius = "5px";
    spanTopLabelsContainer.style.display = "none";
    spanBottomLabelsContainer.style.display = "none";
  }
}

iconVector.addEventListener("click", openCloseMenuSort);
iconVector.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 || e.keyCode === 32) {
    openCloseMenuSort();
  }
});

function displayMenuDate() {
  labelsContainer.insertBefore(labelRadioDate, labelRadioPopularity);
  labelRadioDate.style.borderRadius = "5px";
  labelRadioPopularity.style.display = "none";
  labelRadioTitle.style.display = "none";
  iconVector.classList.toggle("rotate");

  spanTopLabelsContainer.style.display = "none";
  spanBottomLabelsContainer.style.display = "none";
}
function displayMenuTitle() {
  labelsContainer.insertBefore(labelRadioTitle, labelRadioPopularity);
  labelRadioTitle.style.borderRadius = "5px";
  labelRadioPopularity.style.display = "none";
  labelRadioDate.style.display = "none";

  iconVector.classList.toggle("rotate");
  spanTopLabelsContainer.style.display = "none";
  spanBottomLabelsContainer.style.display = "none";
}
function displayMenuPopularity() {
  labelsContainer.insertBefore(labelRadioPopularity, labelRadioDate);
  labelRadioPopularity.style.borderRadius = "5px";
  labelRadioDate.style.display = "none";
  labelRadioTitle.style.display = "none";

  iconVector.classList.toggle("rotate");
  spanTopLabelsContainer.style.display = "none";
  spanBottomLabelsContainer.style.display = "none";
}
labelRadios.forEach((label) => {
  if (label === labelRadioDate) {
    labelRadioDate.addEventListener("click", () => {
      displayMenuDate();
    });
    labelRadioDate.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        displayMenuDate();
      }
    });
  } else if (label === labelRadioTitle) {
    labelRadioTitle.addEventListener("click", () => {
      displayMenuTitle();
    });
    labelRadioTitle.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        displayMenuTitle();
      }
    });
  } else if (label === labelRadioPopularity) {
    labelRadioPopularity.addEventListener("click", () => {
      displayMenuPopularity();
    });
    labelRadioPopularity.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        displayMenuPopularity();
      }
    });
  }
});

const inputRadios = document.querySelectorAll(".sort_container input");
const labelsRadios = document.querySelectorAll(".labels_container label");

inputRadios.forEach((inputRadio) => {
  inputRadio.addEventListener("input", initMedia);
});
//-----------------------------TRI DES MEDIAS AVEC LES TOUCHES DU CLAVIER------------------------------
labelsRadios.forEach((labelRadio) => {
  if (labelRadio === labelRadioPopularity) {
    labelRadioPopularity.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        inputRadioPopularity.checked = true;
        initMedia();
      }
    });
  } else if (labelRadio === labelRadioDate) {
    labelRadioDate.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        inputRadioDate.checked = true;
        initMedia();
      }
    });
  } else if (labelRadio === labelRadioTitle) {
    labelRadioTitle.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        inputRadioTitle.checked = true;
        initMedia();
      }
    });
  }
});

// --------------------------------------SECTION DE LA LIGHTBOX--------------------------------------//
function lightBoxMediaFactory(medias) {
  const { id, image, video, title } = medias;

  const picture = `assets/images/${image}`;
  const videoPicture = `assets/images/${video}`;

  function getLightBoxCardDOM() {
    const articleLightBox = document.createElement("article");
    articleLightBox.setAttribute("class", "article");
    articleLightBox.setAttribute("id", id);
    if ("image" in medias) {
      const imgMedia = document.createElement("img");
      imgMedia.setAttribute("src", picture);
      imgMedia.setAttribute("alt", `la photo : ${title}`);
      articleLightBox.appendChild(imgMedia);
    } else if ("video" in medias) {
      const videoMedia = document.createElement("video");
      videoMedia.setAttribute("src", videoPicture);
      videoMedia.setAttribute("alt", `la vidéo: ${title}`);
      videoMedia.controls = true;
      articleLightBox.appendChild(videoMedia);
    }
    const h2 = document.createElement("h2");
    h2.textContent = title;
    articleLightBox.appendChild(h2);

    return articleLightBox;
  }
  return { picture, videoPicture, getLightBoxCardDOM };
}

const articleContainer = document.querySelector(".article_container");
const closeLightBox = document.querySelector(".close_lightbox");

async function displayLightBoxMedia(medias) {
  articleContainer.innerHTML = "";
  let mediasSorted = sortMedias(medias);
  mediasSorted.forEach((mediaData) => {
    const lightBoxMedia = lightBoxMediaFactory(mediaData);
    const lightBoxCardDOM = lightBoxMedia.getLightBoxCardDOM();
    articleContainer.appendChild(lightBoxCardDOM);

    // ---DEBUT-------AFFICHAGE------FERMETURE------ET L'ACCECIBILITE DE LA LIGHTBOX ---------------------
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const lightBox = document.querySelector(".lightbox");
    const previousImage = document.querySelector(".previous_image");
    const nextImage = document.querySelector(".next_image");

    closeLightBox.addEventListener("click", () => {
      lightBoxModal.style.display = "none";
      main.setAttribute("aria-hidden", "false");
      main.setAttribute("tabindex", "0");

      header.setAttribute("aria-hidden", "false");
      header.setAttribute("tabindex", "0");

      lightBoxModal.setAttribute("aria-hidden", "true");
      lightBoxModal.setAttribute("tabindex", "-1");

      lightBoxCardDOM.focus();
    });

    const lightBoxCardsDOM = document.querySelectorAll(
      ".media_section .article"
    );
    const lightBoxWidth = lightBox.clientWidth;

    const articleContainerWidth = lightBoxCardsDOM.length * lightBoxWidth;
    articleContainer.style.width = `${articleContainerWidth}px`;
    let position = 0;

    previousImage.addEventListener("click", () => {
      position--;
      articleContainer.style.transform = `translateX(${position * 800}px)`;
    });
    previousImage.addEventListener("keydown", (e) => {
      position--;
      if (e.keyCode === 13 || e.keyCode === 32) {
        articleContainer.style.transform = `translateX(${position * 800}px)`;
      }
    });

    nextImage.addEventListener("click", () => {
      if (position < 0) position++;
      if (position == lightBoxCardsDOM.length) {
        position = 0;
      }
      articleContainer.style.transform = `translateX(${-position * 800}px)`;
    });
    nextImage.addEventListener("keydown", (e) => {
      if (position < 0) position++;
      if (e.keyCode === 13 || e.keyCode === 32) {
        articleContainer.style.transform = `translateX(${position * 800}px)`;
      }
    });
  });
}

async function initMediaLightBox() {
  const { medias } = await getMedia();
  displayLightBoxMedia(medias);
}
initMediaLightBox();

lightBoxModal.addEventListener("keydown", (e) => {
  const focusableElements = lightBoxModal.querySelectorAll(
    ".close_lightbox, .previous_image, .next_image"
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
});

function closeModalLight() {
  lightBoxModal.style.display = "none";
  lightBoxModal.setAttribute("aria-hidden", "true");
}

function handleKeyPress(e) {
  if (e.keyCode === 27) {
    closeModalLight();
  }
}
lightBoxModal.addEventListener("keydown", handleKeyPress);

closeLightBox.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 || e.keyCode === 32) {
    closeModalLight();
  }
});
// ---FIN-----AFFICHAGE------FERMETURE------ET ACCECIBILITE DE LA LIGHTBOX-------------------
