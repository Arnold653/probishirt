/* =========================================================
   PROBISHIRT — panier multi-articles
   Stocké dans localStorage, partagé entre toutes les pages.
   ========================================================= */

const CART_KEY = "probishirt_cart";

function parsePrice(priceStr) {
  const digits = String(priceStr).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatPrice(n) {
  return n.toLocaleString("fr-FR").replace(/,/g, " ");
}

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn("Impossible d'enregistrer le panier.", e);
  }
  updateCartBadge();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(
    (it) => it.id === item.id && it.color === item.color && it.size === item.size
  );
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      color: item.color,
      size: item.size,
      price: item.price,
      img: item.img,
      qty: item.qty || 1
    });
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  return cart;
}

function updateCartQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return cart;
  cart[index].qty = Math.max(1, qty);
  saveCart(cart);
  return cart;
}

function cartCount() {
  return getCart().reduce((sum, it) => sum + it.qty, 0);
}

function cartTotal() {
  return getCart().reduce((sum, it) => sum + parsePrice(it.price) * it.qty, 0);
}

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll(".cart-badge").forEach((el) => {
    el.textContent = count;
    el.hidden = count === 0;
  });
}

function buildCartMessage() {
  const cart = getCart();
  if (!cart.length) return "";
  const lines = cart.map((it, i) => {
    const lineTotal = parsePrice(it.price) * it.qty;
    return `${i + 1}. ${it.name} (${it.color}, taille ${it.size}) x${it.qty} — ${formatPrice(lineTotal)} FCFA`;
  });
  const total = cartTotal();
  return (
    "Bonjour Probishirt, je souhaite commander :\n" +
    lines.join("\n") +
    `\n\nTotal : ${formatPrice(total)} FCFA`
  );
}

function cartIconSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none"/><path d="M2.5 3h2l2.4 12.1a1.8 1.8 0 0 0 1.8 1.5h8a1.8 1.8 0 0 0 1.8-1.4L20.5 7H6"/></svg>`;
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
