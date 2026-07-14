// VitaKeto Service Worker — Push Notifications

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Alarm-Check alle 15 Minuten
self.addEventListener("periodicsync", (e) => {
  if (e.tag === "VitaKeto-reminders") {
    e.waitUntil(checkReminders());
  }
});

// Fallback: message-basierter Trigger
self.addEventListener("message", (e) => {
  if (e.data?.type === "CHECK_REMINDERS") checkReminders();
  if (e.data?.type === "SHOW_NOTIFICATION") {
    showNotif(e.data.titel, e.data.body, e.data.icon ?? "💧", e.data.url ?? "/");
  }
});

async function checkReminders() {
  const clients = await self.clients.matchAll();
  // Reminders aus Cache lesen
  const cache = await caches.open("VitaKeto-reminders-v1");
  const resp = await cache.match("/reminders-config");
  if (!resp) return;
  const config = await resp.json();
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  for (const r of config) {
    if (!r.aktiv) continue;
    if (r.zeiten && r.zeiten.includes(hhmm)) {
      await showNotif(r.titel, r.body, r.icon, r.url);
    }
  }
}

async function showNotif(titel, body, icon, url) {
  return self.registration.showNotification(titel, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: titel,
    data: { url },
    vibrate: [200, 100, 200],
  });
}

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url ?? "/";
  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

