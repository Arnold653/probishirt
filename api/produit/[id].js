const products = require("../products-data.json");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = (req, res) => {
  const { id } = req.query;
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
