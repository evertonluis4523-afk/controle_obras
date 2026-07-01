/* RM Estruturas — Controle de Obras · service worker
   Troque a versao (v6 -> v7 ...) sempre que publicar alteracoes,
   para forcar a atualizacao do cache nos aparelhos ja instalados. */
const CACHE = 'rm-obras-v8';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

// CDNs estaticos que podemos cachear (funcionar offline apos 1o uso)
const STATIC_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'www.gstatic.com',      // SDK do Firebase (firebasejs)
  'unpkg.com',            // leitor de codigo de barras
  'cdn.jsdelivr.net'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (_) { return; }

  // Navegacao (abrir o app): rede primeiro, cai pro cache offline
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isStatic = STATIC_HOSTS.includes(url.hostname);

  // Chamadas de API/tempo-real (Firestore, Storage, Auth, etc.): deixa passar direto
  if (!sameOrigin && !isStatic) return;

  // Estaticos (app + SDKs + fontes): cache primeiro, atualiza em segundo plano
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
