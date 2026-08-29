const webpush = require("web-push");
const fs = require("fs");
const path = require("path");

const VAPID_PUBLIC_KEY = "BE0_4aygFo4Tgtg3Bq6NlEhhdx471s64Lzp7i21puV5OwFqlLPI_TNHMmFKtvz6jVgQ2JYQFP1l6-OF3NpL-Nt0";

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

function rowsToSubscriptions(rows) {
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const subs = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const endpoint = (row[idx.endpoint] || "").trim();
    const p256dh = (row[idx.p256dh] || "").trim();
    const auth = (row[idx.auth] || "").trim();
    if (endpoint && p256dh && auth) {
      subs.push({ endpoint, keys: { p256dh, auth } });
    }
  }
  return subs;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  const { title, body, url, secret } = req.body || {};

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    res.status(401).json({ error: "Mot de passe incorrect" });
    return;
  }
  if (!title || !body) {
    res.status(400).json({ error: "Titre et message requis" });
    return;
  }
  if (!process.env.VAPID_PRIVATE_KEY) {
    res.status(500).json({ error: "VAPID_PRIVATE_KEY manquante côté serveur (Vercel)" });
    return;
  }

  let cfg = {};
  try {
    const cfgPath = path.join(__dirname, "..", "sheet-config.json");
    cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  } catch (e) {
    res.status(500).json({ error: "sheet-config.json illisible" });
    return;
  }
  if (!cfg.pushSubscribersCsvUrl) {
    res.status(500).json({ error: "pushSubscribersCsvUrl non configuré dans sheet-config.json" });
    return;
  }

  let subs = [];
  try {
    const sep = cfg.pushSubscribersCsvUrl.includes("?") ? "&" : "?";
    const csvRes = await fetch(`${cfg.pushSubscribersCsvUrl}${sep}t=${Date.now()}`);
    const text = await csvRes.text();
    subs = rowsToSubscriptions(parseCSV(text));
  } catch (e) {
    res.status(500).json({ error: "Impossible de lire la liste des abonnés" });
    return;
  }

  webpush.setVapidDetails("mailto:contact@probishirt.com", VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

  const payload = JSON.stringify({ title, body, url: url || "/" });
  const results = await Promise.allSettled(subs.map((sub) => webpush.sendNotification(sub, payload)));

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;
  const errors = results
    .filter((r) => r.status === "rejected")
    .map((r) => (r.reason && r.reason.body) || (r.reason && r.reason.message) || String(r.reason));

  res.status(200).json({ total: subs.length, sent, failed, errors });
};
