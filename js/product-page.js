/* =========================================================
   PROBISHIRT — logique de la page fiche produit (produit.html)
   ========================================================= */

function getProductIdFromUrl() {
  const params = new URLSearchParams(location.search);
  return params.get("id");
}

function renderProductPage() {
  const mount = document.getElementById("product-detail");
  const notFound = document.getElementById("product-not-found");
  if (!mount) return;

  const id = getProductIdFromUrl();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    mount.hidden = true;
    if (notFound) notFound.hidden = false;
    const relatedSection = document.getElementById("related-section");
    if (relatedSection) relatedSection.hidden = true;
    return;
  }

  document.title = `${product.name} — Probishirt`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", `${product.name} : ${product.quote} Commandez directement via WhatsApp.`);

  let activeIdx = 0;
  const variant = () => product.variants[activeIdx];
  const orderMessage = () =>
    `Bonjour Probishirt, je souhaite commander : ${product.name} (${variant().color}) — ${product.price} FCFA.\n${shareUrl(product.id)}`;

  mount.innerHTML = `
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <a href="index.html">Accueil</a>
      <span>/</span>
      <a href="collection.html">Collection</a>
      <span>/</span>
      <span aria-current="page">${product.name}</span>
    </nav>
    <div class="product-layout">
      <div class="product-media">
        <span class="tag-premium">Édition premium</span>
        <img id="pd-img" src="${variant().img}" alt="${product.name} — coloris ${variant().color}" width="1000" height="1000">
      </div>
      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="quote">${product.quote}</p>
        <div id="pd-swatches"></div>
        <div class="product-price">${product.price} <small>FCFA</small></div>
        <a id="pd-order" class="btn btn-primary btn-lg" href="${waLink(orderMessage())}" target="_blank" rel="noopener">
          ${waIconSVG()} Commander sur WhatsApp
        </a>

        <div class="product-sections">
          <section class="product-section">
            <h3>Description</h3>
            <p>${product.description || ""}</p>
          </section>

          <section class="product-section">
            <h3>Caractéristiques</h3>
            <ul class="product-facts">
              <li>Coton premium, coupe unisexe</li>
              <li>Impression durable, résistante au lavage</li>
              <li>Tailles disponibles : S à XXL</li>
              <li>Édition limitée, produite en petites séries</li>
            </ul>
          </section>

          <section class="product-section">
            <h3>Livraison &amp; retours</h3>
            <ul class="product-facts">
              <li>Commande confirmée directement sur WhatsApp</li>
              <li>Délai communiqué selon votre localisation</li>
              <li>Échange possible en cas de souci de taille</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  `;

  function renderSwatches() {
    const holder = mount.querySelector("#pd-swatches");
    if (product.variants.length < 2) {
      holder.innerHTML = "";
      return;
    }
    holder.innerHTML = `<div class="swatches" role="group" aria-label="Choisir un coloris">
      ${product.variants
        .map(
          (v, i) => `<button type="button" class="swatch" data-idx="${i}" style="background:${v.hex}" aria-pressed="${i === activeIdx}" aria-label="${v.color}"></button>`
        )
        .join("")}
      <span class="swatch-label">${variant().color}</span>
    </div>`;
    holder.querySelectorAll(".swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeIdx = Number(btn.dataset.idx);
        mount.querySelector("#pd-img").src = variant().img;
        mount.querySelector("#pd-img").alt = `${product.name} — coloris ${variant().color}`;
        mount.querySelector("#pd-order").href = waLink(orderMessage());
        renderSwatches();
      });
    });
  }
  renderSwatches();

  // Produits similaires
  const relatedGrid = document.getElementById("related-grid");
  if (relatedGrid) {
    const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
    related.forEach((p) => relatedGrid.appendChild(renderCard(p)));
  }
}

document.addEventListener("DOMContentLoaded", renderProductPage);
