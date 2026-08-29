/* =========================================================
   PROBISHIRT — abonnement aux notifications push
   ========================================================= */

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  // Le protocole Web Push attend du base64url (comme PushSubscription.toJSON()
  // le fait nativement), pas du base64 standard — sinon le serveur ne peut
  // pas reconstruire les clés et l'envoi échoue silencieusement pour tout
  // le monde.
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, reason: "unsupported" };
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, reason: "denied" };

  const reg = await navigator.serviceWorker.ready;
  let sub;
  try {
    sub =
      (await reg.pushManager.getSubscription()) ||
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY)
      }));
  } catch (e) {
    return { ok: false, reason: "subscribe-failed" };
  }

  try {
    const cfgRes = await fetch("sheet-config.json", { cache: "no-store" });
    const cfg = cfgRes.ok ? await cfgRes.json() : {};
    if (cfg.pushSaveUrl) {
      const p256dh = arrayBufferToBase64(sub.getKey("p256dh"));
      const auth = arrayBufferToBase64(sub.getKey("auth"));
      const params = new URLSearchParams({
        endpoint: sub.endpoint,
        p256dh,
        auth,
        date: new Date().toLocaleString("fr-FR")
      });
      fetch(`${cfg.pushSaveUrl}?${params.toString()}`, { mode: "no-cors" }).catch(() => {});
    }
  } catch (e) {
    /* best-effort : l'abonnement navigateur reste valide même si la sauvegarde échoue */
  }

  localStorage.setItem("probishirt_push_subscribed", "1");
  return { ok: true };
}

function wirePushButton() {
  const btn = document.getElementById("push-opt-in");
  if (!btn) return;

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const supported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

  if (isIos && !isStandalone) {
    // iPhone : les notifications web ne marchent que si le site est
    // installé sur l'écran d'accueil (limite imposée par Apple).
    btn.hidden = false;
    btn.title = "Sur iPhone : ajoute d'abord Probishirt à ton écran d'accueil (Partager → Sur l'écran d'accueil), puis reviens ici.";
    btn.addEventListener("click", () => {
      alert("Sur iPhone, ouvre le menu de partage de Safari puis choisis \"Sur l'écran d'accueil\". Une fois le site ouvert depuis l'icône ajoutée, reviens activer les notifications ici.");
    });
    return;
  }

  if (!supported || Notification.permission === "denied") {
    btn.hidden = false;
    btn.disabled = true;
    btn.textContent = "🔕 Indisponible";
    btn.title = !supported
      ? "Ton navigateur ne supporte pas les notifications web."
      : "Les notifications sont bloquées pour ce site. Autorise-les dans les réglages de ton navigateur pour réessayer.";
    return;
  }
  if (Notification.permission === "granted" && localStorage.getItem("probishirt_push_subscribed")) {
    btn.hidden = false;
    btn.textContent = "🔔 Activé";
    btn.title = "Déjà activé. Clique pour resynchroniser si besoin.";
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = "…";
      await subscribeToPush();
      btn.textContent = "🔔 Resynchronisé ✓";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
      }, 1500);
    });
    return;
  }

  btn.hidden = false;
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "…";
    const result = await subscribeToPush();
    if (result.ok) {
      btn.textContent = "🔔 Activé";
      setTimeout(() => {
        btn.hidden = true;
      }, 1500);
    } else {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
}

document.addEventListener("DOMContentLoaded", wirePushButton);
