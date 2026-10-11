// Web version only (the iPhone app does not register this). Network first, so a new build shows up as soon as
// you are online; the cache keeps the game playable offline.
const CACHE = "castle-busters-6";
const CORE = ["./", "index.html", "matter.min.js", "manifest.json", "icons/icon-192.png", "icons/icon-512.png",
  "fonts/grenze-gotisch-latin-600-normal.woff2", "fonts/grenze-gotisch-latin-800-normal.woff2",
  "fonts/barlow-semi-condensed-latin-500-normal.woff2", "fonts/barlow-semi-condensed-latin-600-normal.woff2",
  "fonts/barlow-semi-condensed-latin-700-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Leave the phone app's update files alone.
  if (e.request.method !== "GET" || url.origin !== location.origin || /\.zip$|version\.json$/.test(url.pathname)) return;
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
});
