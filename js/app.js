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

function renderCard(product) {
  const el = document.createElement("article");
  el.className = "card";
  el.dataset.active = "0";

  const variant = product.variants[0];
  const orderMsg = `Bonjour Probishirt, je souhaite commander : ${product.name} (${variant.color}) — ${product.price} FCFA.\n${shareUrl(product.id)}`;

  el.innerHTML = `
    <a class="card-media" href="produit.html?id=${product.id}" aria-label="Voir ${product.name}">
      <span class="tag-premium">Édition premium</span>
      <img src="${variant.img}" alt="${product.name} — coloris ${variant.color}" loading="lazy" width="1000" height="1000">
    </a>
    <div class="card-body">
      <h3><a href="produit.html?id=${product.id}">${product.name}</a></h3>
      <p class="quote">${product.quote}</p>
      ${buildSwatches(product, 0)}
      <div class="card-foot">
        <div class="price">${product.price} <small>FCFA</small></div>
        <a class="order-btn" href="${waLink(orderMsg)}" target="_blank" rel="noopener">
          ${waIconSVG()} Commander
        </a>
      </div>
    </div>
  `;

  const swatchButtons = el.querySelectorAll(".swatch");
  const img = el.querySelector("img");
  const orderBtn = el.querySelector(".order-btn");

  swatchButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = Number(btn.dataset.idx);
      const v = product.variants[idx];
      img.src = v.img;
      img.alt = `${product.name} — coloris ${v.color}`;
      swatchButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      const msg = `Bonjour Probishirt, je souhaite commander : ${product.name} (${v.color}) — ${product.price} FCFA.\n${shareUrl(product.id)}`;
      orderBtn.href = waLink(msg);
    });
  });

  return el;
}

function renderCatalog(targetId, list) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  (list || PRODUCTS).forEach((p) => grid.appendChild(renderCard(p)));
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
  renderCatalog("catalog-grid");
  renderCatalog("featured-grid", PRODUCTS.slice(0, 3));
  wireGlobalWhatsApp();
  setYear();
  highlightActiveNav();
  wireMobileMenu();
});

registerServiceWorker();
