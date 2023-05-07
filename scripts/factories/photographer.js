function photographerFactory(data) {
  const { id, name, portrait, city, country, tagline, price } = data;

  const picture = `assets/photographers/${portrait}`;
  function getUserCardDOM() {
    // const photographerSection = document.querySelector(".photographer_section");
    const article = document.createElement("article");
    const a = document.createElement("a");
    const img = document.createElement("img");
    // img.setAttribute("alt", `photo de : ${name}`);
    const h2 = document.createElement("h2");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const span = document.createElement("span");

    // article.setAttribute("aria-label", `profil du photographe ${name}`);

    a.setAttribute("href", `photographer.html?id=${id}`);
    // a.setAttribute("href", `photographer.html#${id}`);
    img.setAttribute("src", picture);
    h2.textContent = name;
    h3.textContent = `${city}, ${country}`;
    p.textContent = tagline;
    span.textContent = ` ${price} €/Jour `;

    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(h3);
    article.appendChild(p);
    article.appendChild(span);
    article.appendChild(a);
    a.parentNode.insertBefore(a, img);
    a.appendChild(img);
    a.appendChild(h2);
    return article;
  }
  return { name, picture, getUserCardDOM };
}
