/* Injected before the engine. Content hashes identify immutable art across builds/releases. */
(() => {
  'use strict';
  const manifest = JSON.parse(document.getElementById('s6-art-manifest').textContent);
  const root = document.getElementById('s6-boot');
  const status = document.getElementById('boot-status'), detail = document.getElementById('boot-detail');
  const bar = document.getElementById('boot-progress'), fill = document.getElementById('boot-fill');
  const percent = document.getElementById('boot-percent'), retry = document.getElementById('boot-retry');
  const base = new URL('.', document.baseURI);
  // A release subfolder must share its parent game's cache, never another app's cache.
  const appPath = base.pathname.replace(/releases\/[^/]+\/$/, '');
  const cacheName = 's6-art-v1:' + appPath;
  const images = new Map(), retainedURLs = [];
  let progress = 0, failed = false, finished = false, cache = null, timer;
  const stats = {total: manifest.files.length, loaded: 0, cacheHits: 0, downloads: 0, bytes: 0, cacheAvailable: false};
  const normalize = url => {const u = new URL(url, base); u.search = ''; u.hash = ''; return u.href;};
  const cacheKey = entry => new URL(appPath + '__s6_art__/' + entry.sha256, base.origin).href;
  const touch = () => {clearTimeout(timer);timer = setTimeout(() => fail(new Error('startup stalled')), 90000);};
  function update(value, text, extra) {
    if (failed || finished) return;
    progress = Math.max(progress, Math.min(99, value));
    fill.style.width = progress + '%'; percent.textContent = Math.floor(progress) + '%';
    bar.setAttribute('aria-valuenow', String(Math.floor(progress)));
    if (text) status.textContent = text;
    if (extra) detail.textContent = extra;
    touch();
  }
  function fail(error) {
    if (failed || finished) return;
    failed = true; clearTimeout(timer); root.dataset.state = 'error'; root.setAttribute('aria-busy','false');
    status.textContent = '加载未完成'; detail.textContent = '请检查网络后重试，已缓存的资源会保留。';
    retry.hidden = false; console.error('[S6 startup]', error);
  }
  retry.addEventListener('click', () => location.reload());
  window.addEventListener('error', event => {if (event.error) fail(event.error);});
  window.addEventListener('unhandledrejection', event => fail(event.reason));
  const digest = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2,'0')).join('');
  async function checked(response, entry) {
    if (!response || !response.ok) throw new Error('Art response missing: '+entry.path);
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength !== entry.bytes) throw new Error('Art size mismatch: '+entry.path);
    if (globalThis.crypto?.subtle && await digest(bytes) !== entry.sha256) throw new Error('Art hash mismatch: '+entry.path);
    return bytes;
  }
  async function decode(bytes, entry) {
    const url = URL.createObjectURL(new Blob([bytes], {type:entry.mime}));
    const image = new Image(); image.src = url;
    try { await image.decode(); } catch (e) { URL.revokeObjectURL(url); throw e; }
    retainedURLs.push(url); images.set(normalize(entry.path), image);
    root.querySelectorAll('[data-boot-art]').forEach(element => {if(element.dataset.bootArt === entry.path)element.src = url;});
  }
  async function loadArt(entry) {
    let bytes, hit = false;
    if (cache) {
      try {bytes = await checked(await cache.match(cacheKey(entry)), entry); await decode(bytes, entry); hit = true;}
      catch {bytes = null; try {await cache.delete(cacheKey(entry));} catch {}}
    }
    if (!hit) {
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 45000);
      try {
        const url = new URL(entry.path, base); url.searchParams.set('art',entry.sha256.slice(0,16));
        bytes = await checked(await fetch(url, {cache:'no-store', signal:controller.signal}), entry);
        await decode(bytes, entry);
      } finally {clearTimeout(timeout);}
      if (cache) try {await cache.put(cacheKey(entry), new Response(bytes, {headers:{'Content-Type':entry.mime}}));}
      catch {stats.cacheAvailable = false;} // quota/private-mode failures never prevent play
      stats.downloads++;
    } else stats.cacheHits++;
    stats.loaded++; stats.bytes += entry.bytes;
    update(stats.bytes / manifest.bytes * 88, hit ? '正在读取本地美术…' : '正在加载冒险世界…', '美术资源 ' + stats.loaded + ' / ' + stats.total);
  }
  const artReady = (async () => {
    touch();
    try {cache = await caches.open(cacheName);stats.cacheAvailable = true;} catch {}
    let next = 0;
    await Promise.all(Array.from({length:4}, async () => {
      while (next < manifest.files.length && !failed) await loadArt(manifest.files[next++]);
    }));
    if (failed || stats.loaded !== stats.total) throw new Error('Art preload incomplete');
    update(88, '美术已就绪，正在启动游戏…', '本地缓存 ' + stats.cacheHits + ' / ' + stats.total);
  })();
  // Observe immediately even when the engine import takes longer than the art request.
  artReady.catch(fail);
  window.S6Boot = {
    stats, version:manifest.version, artReady, fail,
    textureProgress(done,total) {update(88 + 7 * done / total, '正在整理冒险行装…', '游戏资源 ' + done + ' / ' + total);},
    preparingUI() {update(96, '正在准备游戏界面…', '美术资源已全部加载');},
    async install(engine) {
      await artReady;
      if (failed) throw new Error('Startup failed');
      const fromPreload = (url, options, done) => {
        const image = images.get(normalize(url));
        if (!image) return done(new Error('Unlisted startup artwork: '+url));
        done(null, image);
      };
      ['.png','.jpg','.jpeg','.webp'].forEach(type => engine.assetManager.downloader.register(type, fromPreload));
    },
    async finish() {
      await artReady;
      if (failed) throw new Error('Startup failed');
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (failed) throw new Error('Startup failed');
      clearTimeout(timer); progress = 100; fill.style.width = '100%'; percent.textContent = '100%';
      bar.setAttribute('aria-valuenow','100'); status.textContent = '准备完成'; detail.textContent = '冒险，即刻启程';
      root.setAttribute('aria-busy','false'); root.dataset.state = 'ready';
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      document.documentElement.classList.remove('s6-loading'); root.dataset.state = 'leaving';
      await new Promise(resolve => setTimeout(resolve, 220)); root.remove(); finished = true;
      // Prune superseded art only after successful entry; never touch saves or other apps.
      if (cache) try {
        const current = new Set(manifest.files.map(cacheKey));
        for (const key of await cache.keys()) if (!current.has(key.url)) await cache.delete(key);
      } catch {}
    }
  };
})();
