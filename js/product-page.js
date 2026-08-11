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
  const sizes = productSizes(product);
  let activeSize = sizes.includes("M") ? "M" : sizes[0];
  let qty = 1;

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
        ${buildBadge(product)}
        <img id="pd-img" src="${variant().img}" alt="${product.name} — coloris ${variant().color}" width="1000" height="1000">
      </div>
      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="quote">${product.quote}</p>
        <div id="pd-swatches"></div>
        <div class="size-row">
          <label for="pd-size">Taille</label>
          ${buildSizeSelect(product, "-detail")}
          <div class="cart-qty" id="pd-qty">
            <button type="button" class="qty-btn" data-action="dec" aria-label="Diminuer la quantité">−</button>
            <span class="qty-value">1</span>
            <button type="button" class="qty-btn" data-action="inc" aria-label="Augmenter la quantité">+</button>
          </div>
        </div>
        <div class="product-price">${product.price} <small>FCFA</small></div>
        <button type="button" id="pd-order" class="btn btn-primary btn-lg add-to-cart-btn">
          ${cartIconSVG()} Ajouter au panier
        </button>
        <a class="cart-continue" href="panier.html">Voir mon panier →</a>

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
              <li>Tailles disponibles : ${sizes.join(", ")}</li>
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

  const sizeSelect = mount.querySelector(`#size-${product.id}-detail`);
  if (sizeSelect) {
    sizeSelect.id = "pd-size";
    sizeSelect.addEventListener("change", () => {
      activeSize = sizeSelect.value;
    });
  }

  const qtyBox = mount.querySelector("#pd-qty");
  const qtyValueEl = qtyBox.querySelector(".qty-value");
  qtyBox.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      qty = Math.max(1, qty + (btn.dataset.action === "inc" ? 1 : -1));
      qtyValueEl.textContent = qty;
    });
  });

  const orderBtn = mount.querySelector("#pd-order");
  orderBtn.addEventListener("click", () => {
    addToCart({
      id: product.id,
      name: product.name,
      color: variant().color,
      size: activeSize,
      price: product.price,
      img: variant().img,
      qty
    });
    const original = orderBtn.innerHTML;
    orderBtn.classList.add("is-added");
    orderBtn.innerHTML = "✓ Ajouté au panier";
    setTimeout(() => {
      orderBtn.classList.remove("is-added");
      orderBtn.innerHTML = original;
    }, 1400);
  });

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

document.addEventListener("DOMContentLoaded", () => {
  window.productsReadyPromise.then(renderProductPage);
});
