/* =========================================================
   PROBISHIRT — logique commune à toutes les pages
   (nécessite js/products.js chargé avant ce fichier)
   ========================================================= */

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function waIconSVG() {
  return `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.001 3C9.1 3 3.5 8.6 3.5 15.5c0 2.3.6 4.5 1.8 6.4L3 29l7.3-2.2c1.8 1 3.9 1.5 6 1.5h.1c6.9 0 12.5-5.6 12.5-12.5S22.9 3 16.001 3zm0 22.7h-.1c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.3 1.3 1.3-4.2-.2-.4c-1.1-1.7-1.6-3.6-1.6-5.6 0-5.7 4.6-10.3 10.3-10.3 2.8 0 5.3 1.1 7.3 3s3 4.5 3 7.3c0 5.7-4.7 10.6-10.3 10.6zm5.6-7.8c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"/></svg>`;
}

function shareUrl(productId) {
  return `${location.origin}/api/produit/${encodeURIComponent(productId)}`;
}

function buildSwatches(product, activeIndex) {
  if (product.variants.length < 2) return "";
  return `<div class="swatches" role="group" aria-label="Choisir un coloris">
    ${product.variants
      .map(
        (v, i) => `<button type="button" class="swatch" data-idx="${i}" style="background:${v.hex}" aria-pressed="${i === activeIndex}" aria-label="${v.color}"></button>`
      )
      .join("")}
  </div>`;
}

function productSizes(product) {
  return product.sizes && product.sizes.length ? product.sizes : DEFAULT_SIZES;
}

function buildSizeSelect(product, idSuffix) {
  const sizes = productSizes(product);
  const defaultSize = sizes.includes("M") ? "M" : sizes[0];
  return `<select class="size-select" id="size-${product.id}${idSuffix}" aria-label="Choisir une taille">
    ${sizes.map((s) => `<option value="${s}" ${s === defaultSize ? "selected" : ""}>${s}</option>`).join("")}
  </select>`;
}

function badgeLabel(badge) {
  if (badge === "nouveau") return "Nouveau";
  if (badge === "bestseller") return "Meilleure vente";
  return "";
}

function buildBadge(product) {
  const label = badgeLabel(product.badge);
  if (!label) return "";
  return `<span class="tag-badge tag-badge--${product.badge}">${label}</span>`;
}

function renderCard(product) {
  const el = document.createElement("article");
  el.className = "card";
  el.dataset.active = "0";

  const variant = product.variants[0];

  el.innerHTML = `
    <a class="card-media" href="produit.html?id=${product.id}" aria-label="Voir ${product.name}">
      <span class="tag-premium">Édition premium</span>
      ${buildBadge(product)}
      <img src="${variant.img}" alt="${product.name} — coloris ${variant.color}" loading="lazy" width="1000" height="1000">
    </a>
    <div class="card-body">
      <h3><a href="produit.html?id=${product.id}">${product.name}</a></h3>
      <p class="quote">${product.quote}</p>
      ${buildSwatches(product, 0)}
      <div class="card-size-row">
        <label for="size-${product.id}-card">Taille</label>
        ${buildSizeSelect(product, "-card")}
      </div>
      <div class="card-foot">
        <div class="price">${product.price} <small>FCFA</small></div>
        <button type="button" class="order-btn add-to-cart-btn">
          ${cartIconSVG()} Ajouter
        </button>
      </div>
    </div>
  `;

  const swatchButtons = el.querySelectorAll(".swatch");
  const sizeSelect = el.querySelector(".size-select");
  const img = el.querySelector("img");
  const addBtn = el.querySelector(".add-to-cart-btn");
  let activeColor = variant.color;
  let activeImg = variant.img;

  swatchButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = Number(btn.dataset.idx);
      const v = product.variants[idx];
      img.src = v.img;
      img.alt = `${product.name} — coloris ${v.color}`;
      swatchButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      activeColor = v.color;
      activeImg = v.img;
    });
  });

  addBtn.addEventListener("click", () => {
    addToCart({
      id: product.id,
      name: product.name,
      color: activeColor,
      size: sizeSelect.value,
      price: product.price,
      img: activeImg,
      qty: 1
    });
    const original = addBtn.innerHTML;
    addBtn.classList.add("is-added");
    addBtn.innerHTML = "✓ Ajouté";
    setTimeout(() => {
      addBtn.classList.remove("is-added");
      addBtn.innerHTML = original;
    }, 1400);
  });

  return el;
}

function renderCatalog(targetId, list) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  grid.innerHTML = "";
  (list || PRODUCTS).forEach((p) => grid.appendChild(renderCard(p)));
}

function socialIconSVG(name) {
  const icons = {
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.8h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.5-1.5h1.6V4.1C15.9 4 15 4 14 4c-2.4 0-4 1.5-4 4.1v2.1H7.4v3H10V21h3.5z"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.4 2.1 1.7 3.5 3.9 3.7v2.8c-1.4 0-2.7-.4-3.9-1.2v6.6c0 3.3-2.4 5.6-5.5 5.6-3 0-5.5-2.4-5.5-5.6 0-3.1 2.4-5.5 5.5-5.5.3 0 .6 0 .9.1v2.9a2.7 2.7 0 0 0-.9-.2 2.7 2.7 0 1 0 2.6 2.7V3h2.9z"/></svg>'
  };
  return icons[name] || "";
}

function wireSocialLinks() {
  document.querySelectorAll(".social-links").forEach((container) => {
    const entries = Object.entries(SOCIAL_LINKS || {}).filter(([, url]) => url);
    if (!entries.length) {
      container.hidden = true;
      return;
    }
    container.innerHTML = entries
      .map(
        ([name, url]) =>
          `<a href="${url}" target="_blank" rel="noopener" aria-label="${name}">${socialIconSVG(name)}</a>`
      )
      .join("");
  });
}

function wireGlobalWhatsApp() {
  const generalMsg = "Bonjour Probishirt, j'aimerais en savoir plus sur votre collection.";
  document.querySelectorAll("[data-wa-general]").forEach((a) => {
    a.href = waLink(generalMsg);
  });
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

function highlightActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a[href]").forEach((a) => {
    if (a.getAttribute("href") === current) a.classList.add("is-active");
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

function wireMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => menu.classList.remove("is-open"))
  );
}

document.addEventListener("DOMContentLoaded", () => {
  wireMobileMenu();
  wireSocialLinks();
  window.productsReadyPromise.then(() => {
    renderCatalog("catalog-grid");
    renderCatalog("featured-grid", PRODUCTS.slice(0, 3));
    wireGlobalWhatsApp();
    setYear();
    highlightActiveNav();
  });
});

registerServiceWorker();
