const fs = require("fs");
const path = require("path");
const fallbackProducts = require("../products-data.json");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
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
        price: (row[idx.price] || "").trim(),
        img: ""
      };
      order.push(id);
    }
    const img = (row[idx.image_url] || "").trim();
    if (img && !byId[id].img) byId[id].img = img;
  }
  return order.map((id) => byId[id]).filter((p) => p.img);
}

async function getProducts() {
  try {
    const cfgPath = path.join(__dirname, "..", "..", "sheet-config.json");
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    if (cfg.csvUrl) {
      const sep = cfg.csvUrl.includes("?") ? "&" : "?";
      const resp = await fetch(`${cfg.csvUrl}${sep}t=${Date.now()}`);
      if (resp.ok) {
        const text = await resp.text();
        const products = rowsToProducts(parseCSV(text));
        if (products.length) return products;
      }
    }
  } catch (e) {
    console.warn("Sheet indisponible côté serveur, fallback utilisé.", e);
  }
  return fallbackProducts;
}

module.exports = async (req, res) => {
  const { id } = req.query;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);

  const proto = req.headers["x-forwarded-proto"] || "https";
  const origin = `${proto}://${req.headers.host}`;
  const fallbackUrl = `${origin}/collection.html`;

  if (!product) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(404).send(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${fallbackUrl}"></head><body>Redirection…</body></html>`
    );
    return;
  }

  const title = `${product.name} — Probishirt`;
  const description = `${product.quote} — ${product.price} FCFA. Commande directe sur WhatsApp.`;
  const imageUrl = `${origin}/${product.img}`;
  const productUrl = `${origin}/produit.html?id=${encodeURIComponent(product.id)}`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">

<meta property="og:type" content="product">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:url" content="${productUrl}">
<meta property="og:site_name" content="Probishirt">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${imageUrl}">

<meta http-equiv="refresh" content="0;url=${productUrl}">
</head>
<body>
<p>Redirection vers <a href="${productUrl}">${escapeHtml(product.name)}</a>…</p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  res.status(200).send(html);
};
