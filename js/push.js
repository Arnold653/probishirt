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
  return btoa(binary);
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

  const supported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
  if (!supported || Notification.permission === "denied") {
    btn.hidden = true;
    return;
  }
  if (Notification.permission === "granted" && localStorage.getItem("probishirt_push_subscribed")) {
    btn.hidden = true;
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
