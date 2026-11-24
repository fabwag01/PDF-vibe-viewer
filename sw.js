/* PDF-vibe-viewer – Offline-Speicher (Service Worker)
   Legt alle Dateien der App beim ersten Öffnen ab und liefert sie danach ohne Internet aus.
   Neue Versionen werden beim nächsten Öffnen mit Internet automatisch geladen. */
const VERSION = "576fddc2c7a7";
const CACHE = "pdfvv-" + VERSION;
const FILES = [
  "./",
  "icon-180.png",
  "icon-512.png",
  "icon.svg",
  "index.html",
  "lib/LICENSE-pdf-lib.md",
  "lib/pdf-lib.min.js",
  "lib/pdfjs/LICENSE",
  "lib/pdfjs/iccs/CGATS001Compat-v2-micro.icc",
  "lib/pdfjs/iccs/LICENSE",
  "lib/pdfjs/pdf.min.mjs",
  "lib/pdfjs/pdf.worker.min.mjs",
  "lib/pdfjs/standard_fonts/FoxitDingbats.pfb",
  "lib/pdfjs/standard_fonts/FoxitFixed.pfb",
  "lib/pdfjs/standard_fonts/FoxitFixedBold.pfb",
  "lib/pdfjs/standard_fonts/FoxitFixedBoldItalic.pfb",
  "lib/pdfjs/standard_fonts/FoxitFixedItalic.pfb",
  "lib/pdfjs/standard_fonts/FoxitSerif.pfb",
  "lib/pdfjs/standard_fonts/FoxitSerifBold.pfb",
  "lib/pdfjs/standard_fonts/FoxitSerifBoldItalic.pfb",
  "lib/pdfjs/standard_fonts/FoxitSerifItalic.pfb",
  "lib/pdfjs/standard_fonts/FoxitSymbol.pfb",
  "lib/pdfjs/standard_fonts/LICENSE_FOXIT",
  "lib/pdfjs/standard_fonts/LICENSE_LIBERATION",
  "lib/pdfjs/standard_fonts/LiberationSans-Bold.ttf",
  "lib/pdfjs/standard_fonts/LiberationSans-BoldItalic.ttf",
  "lib/pdfjs/standard_fonts/LiberationSans-Italic.ttf",
  "lib/pdfjs/standard_fonts/LiberationSans-Regular.ttf",
  "lib/pdfjs/wasm/LICENSE_JBIG2",
  "lib/pdfjs/wasm/LICENSE_OPENJPEG",
  "lib/pdfjs/wasm/LICENSE_PDFJS_JBIG2",
  "lib/pdfjs/wasm/LICENSE_PDFJS_OPENJPEG",
  "lib/pdfjs/wasm/LICENSE_PDFJS_QCMS",
  "lib/pdfjs/wasm/LICENSE_QCMS",
  "lib/pdfjs/wasm/jbig2.wasm",
  "lib/pdfjs/wasm/jbig2_nowasm_fallback.js",
  "lib/pdfjs/wasm/openjpeg.wasm",
  "lib/pdfjs/wasm/openjpeg_nowasm_fallback.js",
  "lib/pdfjs/wasm/qcms_bg.wasm",
  "lib/pdfjs/wasm/quickjs-eval.js",
  "lib/pdfjs/wasm/quickjs-eval.wasm",
  "manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("pdfvv-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === "navigate") { const page = await caches.match("index.html"); if (page) return page; }
    return fetch(req);
  })());
});
