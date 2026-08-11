/* =========================================================
   PROBISHIRT — rendu de la page Panier (panier.html)
   ========================================================= */

function renderEmptyCart(mount) {
  mount.innerHTML = `
    <div class="cart-empty">
      <p>Ton panier est vide pour le moment.</p>
      <a class="btn btn-primary" href="collection.html">Voir la collection</a>
    </div>
  `;
}

function renderCartPage() {
  const mount = document.getElementById("cart-mount");
  if (!mount) return;

  const cart = getCart();
  if (!cart.length) {
    renderEmptyCart(mount);
    return;
  }

  const rows = cart
    .map((it, i) => {
      const lineTotal = parsePrice(it.price) * it.qty;
      return `
      <div class="cart-item" data-idx="${i}">
        <img src="${it.img}" alt="${it.name}" width="90" height="90">
        <div class="cart-item-info">
          <h4>${it.name}</h4>
          <p>${it.color} · Taille ${it.size}</p>
          <div class="cart-qty">
            <button type="button" class="qty-btn" data-action="dec" aria-label="Diminuer la quantité">−</button>
            <span class="qty-value">${it.qty}</span>
            <button type="button" class="qty-btn" data-action="inc" aria-label="Augmenter la quantité">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <div class="cart-item-price">${formatPrice(lineTotal)} <small>FCFA</small></div>
          <button type="button" class="cart-remove" aria-label="Retirer">Retirer</button>
        </div>
      </div>`;
    })
    .join("");

  const total = cartTotal();

  mount.innerHTML = `
    <div class="cart-list">${rows}</div>
    <div class="cart-summary">
      <div class="cart-total-row">
        <span>Total</span>
        <span class="cart-total-value">${formatPrice(total)} <small>FCFA</small></span>
      </div>
      <a id="cart-checkout" class="btn btn-primary btn-lg" href="${waLink(buildCartMessage())}" target="_blank" rel="noopener">
        ${waIconSVG()} Commander sur WhatsApp
      </a>
      <a class="cart-continue" href="collection.html">← Continuer mes achats</a>
    </div>
  `;

  mount.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.closest(".cart-item").dataset.idx);
      const current = getCart()[idx];
      if (!current) return;
      const delta = btn.dataset.action === "inc" ? 1 : -1;
      updateCartQty(idx, current.qty + delta);
      renderCartPage();
    });
  });

  mount.querySelectorAll(".cart-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.closest(".cart-item").dataset.idx);
      removeFromCart(idx);
      renderCartPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  window.productsReadyPromise.then(renderCartPage);
});
