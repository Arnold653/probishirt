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

  const subtotal = cartTotal();
  const promo = getAppliedPromo();
  const discount = cartDiscount();
  const finalTotal = cartTotalWithDiscount();

  mount.innerHTML = `
    <div class="cart-list">${rows}</div>
    <div class="cart-promo">
      <input type="text" id="promo-input" placeholder="Code promo" value="${promo ? promo.code : ""}" ${promo ? "disabled" : ""}>
      ${promo
        ? `<button type="button" id="promo-remove" class="btn btn-dark">Retirer</button>`
        : `<button type="button" id="promo-apply" class="btn btn-dark">Appliquer</button>`}
    </div>
    <p class="promo-feedback" id="promo-feedback" hidden></p>
    <div class="cart-summary">
      ${promo
        ? `<div class="cart-total-row cart-subtotal-row">
             <span>Sous-total</span>
             <span>${formatPrice(subtotal)} <small>FCFA</small></span>
           </div>
           <div class="cart-total-row cart-discount-row">
             <span>Code ${promo.code} (-${promo.percent}%)</span>
             <span>−${formatPrice(discount)} <small>FCFA</small></span>
           </div>`
        : ""}
      <div class="cart-total-row">
        <span>Total</span>
        <span class="cart-total-value">${formatPrice(finalTotal)} <small>FCFA</small></span>
      </div>
      <a id="cart-checkout" class="btn btn-primary btn-lg" href="${waLink(buildCartMessage())}" target="_blank" rel="noopener">
        ${waIconSVG()} Commander sur WhatsApp
      </a>
      <a class="cart-continue" href="collection.html">← Continuer mes achats</a>
    </div>
  `;

  const promoInput = mount.querySelector("#promo-input");
  const promoFeedback = mount.querySelector("#promo-feedback");
  const applyBtn = mount.querySelector("#promo-apply");
  const removeBtn = mount.querySelector("#promo-remove");

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const result = applyPromoCode(promoInput.value);
      if (result.ok) {
        renderCartPage();
      } else {
        promoFeedback.hidden = false;
        promoFeedback.textContent = "Code invalide ou expiré.";
        promoFeedback.classList.add("is-error");
      }
    });
  }
  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      clearPromoCode();
      renderCartPage();
    });
  }

  const checkoutLink = mount.querySelector("#cart-checkout");
  if (checkoutLink) {
    checkoutLink.addEventListener("click", () => {
      logOrderToSheet(getCart(), cartTotalWithDiscount(), getAppliedPromo());
    });
  }

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
