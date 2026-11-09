const root = document.querySelector('#mobile-app');
const scene = document.querySelector('#glass-scene');
const tabs = document.querySelector('.nav-links');
const post = document.querySelector('.nav-post');
const dialog = document.querySelector('#dialog');
const controls = [tabs, post];
const links = [...tabs.querySelectorAll('a')];
const opaque = matchMedia('(prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)');
const inkSample = document.createElement('canvas');
inkSample.width = links.length * 5;
inkSample.height = 4;
const inkContext = inkSample.getContext('2d', { willReadFrequently: true });

let inView = false;
let renderer;
let loading = false;
let unavailable = false;
let refreshFrame;
let sceneDirty = false;
let inkFrame;

const shouldRender = () => inView && !opaque.matches && !unavailable && document.documentElement.hasAttribute('data-liquid-glass');

function sampleGlassInk() {
  if (!inkContext || inkFrame) return;
  inkFrame = requestAnimationFrame(() => {
    inkFrame = 0;
    const canvas = tabs.querySelector('canvas');
    if (!renderer || !canvas?.width) return;
    const width = tabs.offsetWidth * devicePixelRatio;
    const height = tabs.offsetHeight * devicePixelRatio;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2 + height * .18;
    const columns = inkSample.width;
    inkContext.clearRect(0, 0, columns, 4);
    inkContext.drawImage(canvas, x, y, width, height * .64, 0, 0, columns, 4);
    const { data } = inkContext.getImageData(0, 0, columns, 4);
    if (!tabs.hasAttribute('data-refractive')) {
      if (!data.some((value, i) => i % 4 === 3 && value >= 224)) return;
      for (const control of controls) control.dataset.refractive = '';
    }
    for (const [tab, link] of links.entries()) {
      const cutoff = link.hasAttribute('aria-current') ? 130 : 119;
      for (const [part, start] of [['icon', 0], ['label', 2]]) {
        let lightness = 0;
        let count = 0;
        for (let row = start; row < start + 2; row++) {
          for (let col = tab * 5 + 1; col <= tab * 5 + 3; col++) {
            const i = (row * columns + col) * 4;
            if (data[i + 3] < 224) continue;
            lightness += .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2];
            count++;
          }
        }
        link.toggleAttribute(`data-light-${part}`, count > 0 && lightness / count < cutoff);
      }
    }
  });
}

function redrawGlass() {
  if (!renderer) return;
  renderer.markChanged();
  sampleGlassInk();
}

function queueSceneRefresh() {
  if (!renderer || !sceneDirty || refreshFrame) return;
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0;
    if (!renderer) return;
    const { capture } = renderer;
    // The pinned library skips duplicate requests while a capture is in flight.
    if (capture._capturing.has(scene)) {
      queueSceneRefresh();
      return;
    }
    sceneDirty = false;
    void capture.captureElement(scene, true);
  });
}

async function syncGlass() {
  if (!shouldRender()) {
    if (refreshFrame) cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
    if (renderer) {
      for (const control of controls) control.removeAttribute('data-refractive');
      renderer.destroy();
      renderer = null;
    }
    return;
  }
  if (renderer || loading || dialog.open) return;
  loading = true;
  try {
    const { LiquidGlass } = await import('./liquidglass-1.0.3.js');
    if (!shouldRender()) return;
    for (const control of controls) {
      const radius = control.offsetHeight / 2;
      const material = control === tabs ? {
        blurAmount: .085,
        refraction: .96,
        zRadius: 10,
        chromAberration: .035,
        edgeHighlight: .29,
        specular: .23,
        brightness: .03,
        saturation: -.16,
        shadowOpacity: .2,
      } : { brightness: -.3 };
      control.dataset.config = JSON.stringify({ cornerRadius: radius, ...material });
    }
    sceneDirty = false;
    const instance = await LiquidGlass.init({
      root,
      glassElements: controls,
      defaults: { blurAmount: .25 },
    });
    // The library disables selection for drag panels; SERV's controls are fixed.
    root.style.removeProperty('user-select');
    root.style.removeProperty('-webkit-user-select');
    if (!shouldRender()) {
      instance.destroy();
      return;
    }
    renderer = instance;
    const notifyCapture = instance.capture.onCacheUpdate;
    instance.capture.onCacheUpdate = (element) => {
      notifyCapture?.(element);
      if (element === scene && renderer === instance) sampleGlassInk();
    };
    for (const control of controls) control.querySelector('canvas')?.setAttribute('aria-hidden', 'true');
    queueSceneRefresh();
    sampleGlassInk();
  } catch {
    unavailable = true;
    root.style.removeProperty('user-select');
    root.style.removeProperty('-webkit-user-select');
  } finally {
    loading = false;
  }
}

const observer = new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting && entry.intersectionRect.width > 0;
  syncGlass();
});
observer.observe(tabs);
opaque.addEventListener('change', syncGlass);
const preferenceObserver = new MutationObserver(syncGlass);
preferenceObserver.observe(document.documentElement, { attributeFilter: ['data-liquid-glass'] });
dialog.addEventListener('close', syncGlass);
window.addEventListener('resize', sampleGlassInk, { passive: true });

// The renderer coalesces scroll changes into its next frame without recapturing the scene.
window.addEventListener('scroll', () => {
  if (!dialog.open) redrawGlass();
}, { passive: true });

// The pinned renderer caches same-size HTML; refresh after results or tab content changes.
const contentObserver = new MutationObserver(() => {
  sceneDirty = true;
  queueSceneRefresh();
});
contentObserver.observe(scene, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'aria-pressed'] });
