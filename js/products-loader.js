/* =========================================================
   PROBISHIRT — chargement des produits depuis Google Sheet
   Lit sheet-config.json à la racine du site. Si aucun lien n'y
   est configuré, ou si le Sheet est inaccessible, les produits
   par défaut de js/products.js restent utilisés tels quels.
   ========================================================= */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function rowsToProducts(rows) {
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byId = {};
  const order = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const id = (row[idx.id] || "").trim();
    if (!id) continue;

    if (!byId[id]) {
      byId[id] = {
        id,
        name: (row[idx.name] || "").trim(),
        quote: (row[idx.quote] || "").trim(),
        description: (row[idx.description] || "").trim(),
        price: (row[idx.price] || "").trim(),
        badge: (row[idx.badge] || "").trim(),
        sizes: (row[idx.sizes] || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        variants: []
      };
      order.push(id);
    }

    const color = (row[idx.color] || "").trim();
    const img = (row[idx.image_url] || "").trim();
    const inStockRaw = (row[idx.in_stock] || "").trim().toLowerCase();
    const inStock = !["non", "false", "0", "no"].includes(inStockRaw);
    const gallery = (row[idx.gallery] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (color && img) {
      byId[id].variants.push({
        color,
        hex: (row[idx.hex] || "#0b0b0d").trim(),
        img,
        inStock,
        gallery
      });
    }
  }

  return order.map((id) => byId[id]).filter((p) => p.variants.length > 0);
}

function rowsToPromoCodes(rows) {
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const codes = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const code = (row[idx.code] || "").trim().toUpperCase();
    const percent = parseFloat(row[idx.percent] || "0");
    const activeRaw = (row[idx.active] || "").trim().toLowerCase();
    const active = !["non", "false", "0", "no"].includes(activeRaw);
    if (code && percent > 0 && active) codes.push({ code, percent });
  }
  return codes;
}

window.productsReadyPromise = (async function loadProducts() {
  let cfg = {};
  try {
    const cfgRes = await fetch("sheet-config.json", { cache: "no-store" });
    cfg = cfgRes.ok ? await cfgRes.json() : {};

    if (cfg.csvUrl) {
      const sep = cfg.csvUrl.includes("?") ? "&" : "?";
      const csvRes = await fetch(`${cfg.csvUrl}${sep}t=${Date.now()}`, { cache: "no-store" });
      if (csvRes.ok) {
        const text = await csvRes.text();
        const products = rowsToProducts(parseCSV(text));
        if (products.length) {
          window.PRODUCTS = products;
        } else {
          console.warn("Google Sheet vide ou mal formaté, produits par défaut utilisés.");
        }
      } else {
        console.warn("Impossible de lire le Google Sheet, produits par défaut utilisés.");
      }
    }
  } catch (e) {
    console.warn("Google Sheet indisponible, produits par défaut utilisés.", e);
  }

  try {
    if (cfg.promoCsvUrl) {
      const sep = cfg.promoCsvUrl.includes("?") ? "&" : "?";
      const promoRes = await fetch(`${cfg.promoCsvUrl}${sep}t=${Date.now()}`, { cache: "no-store" });
      if (promoRes.ok) {
        const text = await promoRes.text();
        const codes = rowsToPromoCodes(parseCSV(text));
        if (codes.length) window.PROMO_CODES = codes;
      }
    }
  } catch (e) {
    console.warn("Sheet des codes promo indisponible, codes par défaut utilisés.", e);
  }

  window.ORDER_LOG_URL = cfg.orderLogUrl || null;
  return window.PRODUCTS;
})();
