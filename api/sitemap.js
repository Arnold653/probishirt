const fs = require("fs");
const path = require("path");
const fallbackProducts = require("./products-data.json");

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

function idsFromRows(rows) {
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idIdx = header.indexOf("id");
  if (idIdx === -1) return [];
  const ids = [];
  for (let r = 1; r < rows.length; r++) {
    const id = (rows[r][idIdx] || "").trim();
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

async function getProductIds() {
  try {
    const cfgPath = path.join(__dirname, "..", "sheet-config.json");
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    if (cfg.csvUrl) {
      const sep = cfg.csvUrl.includes("?") ? "&" : "?";
      const resp = await fetch(`${cfg.csvUrl}${sep}t=${Date.now()}`);
      if (resp.ok) {
        const text = await resp.text();
        const ids = idsFromRows(parseCSV(text));
        if (ids.length) return ids;
      }
    }
  } catch (e) {
    console.warn("Sitemap : Sheet indisponible, fallback utilisé.", e);
  }
  return fallbackProducts.map((p) => p.id);
}

module.exports = async (req, res) => {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const origin = `${proto}://${req.headers.host}`;
  const ids = await getProductIds();

  const staticPages = ["", "collection.html", "apropos.html", "contact.html", "panier.html"];
  const staticEntries = staticPages.map(
    (p) => `<url><loc>${origin}/${p}</loc><changefreq>weekly</changefreq></url>`
  );
  const productEntries = ids.map(
    (id) => `<url><loc>${origin}/produit.html?id=${encodeURIComponent(id)}</loc><changefreq>weekly</changefreq></url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries.concat(productEntries).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=21600");
  res.status(200).send(xml);
};
