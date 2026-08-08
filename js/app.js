/* =========================================================
   CONFIGURATION PROBISHIRT
   Modifie uniquement les valeurs ci-dessous pour mettre à
   jour ton numéro WhatsApp, tes prix ou tes produits — pas
   besoin de toucher au reste du fichier.
   ========================================================= */

// ⚠️ À REMPLACER : ton numéro WhatsApp au format international,
// sans "+", sans espaces. Exemple pour le Bénin : "22997000000"
const WHATSAPP_NUMBER = "22900000000";

// ⚠️ Les prix ci-dessous sont des exemples à ajuster.
const PRODUCTS = [
  {
    id: "sagesse-divine",
    name: "Sagesse Divine Illimitée",
    quote: "« Savoir des hommes limité, mais sagesse divine illimitée. »",
    price: "15 000",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/sagesse-divine-black.jpg" }
    ]
  },
  {
    id: "kd-kingdom",
    name: "KD Kingdom",
    quote: "L'emblème couronné de ceux qui règnent en esprit.",
    price: "15 000",
    variants: [
      { color: "Bleu roi", hex: "#1447c4", img: "assets/products/kd-kingdom-blue.jpg" },
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/kd-kingdom-white.jpg" }
    ]
  },
  {
    id: "guard-your-heart",
    name: "Guard Your Heart",
    quote: "Un rappel porté près du cœur, chaque jour.",
    price: "15 000",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/guard-heart-black.jpg" },
      { color: "Bleu profond", hex: "#3a3fb0", img: "assets/products/guard-heart-blue.jpg" }
    ]
  },
  {
    id: "esprit-songes",
    name: "L'Esprit des Songes",
    quote: "« L'esprit qui interprète les songes vit en moi. »",
    price: "15 000",
    variants: [
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/esprit-songes-white.jpg" },
      { color: "Jaune", hex: "#eecf3d", img: "assets/products/esprit-songes-yellow.jpg" }
    ]
  },
  {
    id: "intelligence-siecles",
    name: "Intelligence des Siècles",
    quote: "« Habité par une intelligence qui dépasse les siècles. »",
    price: "15 000",
    variants: [
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/intelligence-siecles-white.jpg" }
    ]
  },
  {
    id: "sagesse-haut",
    name: "Sagesse d'en Haut",
    quote: "« Une sagesse qui ne vient pas d'ici, mais d'en haut. »",
    price: "18 000",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/sagesse-haut-black.jpg" }
    ]
  }
];

/* ========================================================= */

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function waIconSVG() {
  return `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.001 3C9.1 3 3.5 8.6 3.5 15.5c0 2.3.6 4.5 1.8 6.4L3 29l7.3-2.2c1.8 1 3.9 1.5 6 1.5h.1c6.9 0 12.5-5.6 12.5-12.5S22.9 3 16.001 3zm0 22.7h-.1c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.3 1.3 1.3-4.2-.2-.4c-1.1-1.7-1.6-3.6-1.6-5.6 0-5.7 4.6-10.3 10.3-10.3 2.8 0 5.3 1.1 7.3 3s3 4.5 3 7.3c0 5.7-4.7 10.6-10.3 10.6zm5.6-7.8c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"/></svg>`;
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
  const orderMsg = `Bonjour Probishirt, je souhaite commander : ${product.name} (${variant.color}) — ${product.price} FCFA.`;

  el.innerHTML = `
    <div class="card-media">
      <span class="tag-premium">Édition premium</span>
      <img src="${variant.img}" alt="${product.name} — coloris ${variant.color}" loading="lazy" width="1000" height="1000">
    </div>
    <div class="card-body">
      <h3>${product.name}</h3>
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
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const v = product.variants[idx];
      img.src = v.img;
      img.alt = `${product.name} — coloris ${v.color}`;
      swatchButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      const msg = `Bonjour Probishirt, je souhaite commander : ${product.name} (${v.color}) — ${product.price} FCFA.`;
      orderBtn.href = waLink(msg);
    });
  });

  return el;
}

function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;
  PRODUCTS.forEach((p) => grid.appendChild(renderCard(p)));
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

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  wireGlobalWhatsApp();
  setYear();
});

registerServiceWorker();
