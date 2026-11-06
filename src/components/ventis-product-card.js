/* Ventis chat components for the chat widget (chat-messenger v1.16, custom_template rich content).
   Load once per page (site + the apps' chat page), before cards arrive. Approved design 2026-11-06.

   The agent sends, per product card:
     {type:"custom_template", name:"ventis-product-card", payload:{
        n, title, price, old, disc, brand, sizes, image, url,
        labels:{view, sizes, oneSize, more} }}
     - sizes: an array (["40","41"]) or a plain string; ["Unica"] shows labels.oneSize
     - labels.more contains "{n}", e.g. "e altre {n}" / "and {n} more"
   and, for the recommendations block:
     {type:"custom_template", name:"ventis-suggestions", payload:{
        heading, items:[{title, brand, price, image, url}], labels:{view} }}
   All texts come from the agent, already in the chat's language. Links/images must be https.
   Wishlist (heart) button: to be added when Ventis provides a wishlist API. */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = u => /^https:\/\//i.test(String(u || '')) ? esc(u) : '';
  const MAX_SIZES = 8;

  // Paint the image box in the photo's own edge colour, so any background colour blends in.
  function matchBackground(img, box) {
    try {
      const w = 32, h = 32, c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(img, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data, px = [];
      for (let i = 0; i < w; i++) px.push(i, (h - 1) * w + i);
      for (let j = 1; j < h - 1; j++) px.push(j * w, j * w + w - 1);
      let r = 0, g = 0, b = 0; px.forEach(k => { r += d[k*4]; g += d[k*4+1]; b += d[k*4+2]; });
      r /= px.length; g /= px.length; b /= px.length;
      let dev = 0; px.forEach(k => { dev += Math.abs(d[k*4]-r) + Math.abs(d[k*4+1]-g) + Math.abs(d[k*4+2]-b); });
      if (dev / px.length < 24) { box.style.background = `rgb(${r|0},${g|0},${b|0})`; img.style.mixBlendMode = 'normal'; }
    } catch (e) { /* no pixel access: keep the default grey + blend */ }
  }
  function wireImages(root) {
    root.querySelectorAll('img').forEach(im => {
      const box = im.parentElement;
      if (im.complete && im.naturalWidth) matchBackground(im, box);
      else im.addEventListener('load', () => matchBackground(im, box), {once: true});
    });
  }
  function sizesText(p, L) {
    const s = p.sizes;
    if (Array.isArray(s)) {
      if (!s.length) return '';
      if (s.length === 1 && /^(unica|one size|os|tu)$/i.test(String(s[0]).trim())) return esc(L.oneSize || 'Taglia unica');
      const shown = s.slice(0, MAX_SIZES).map(esc).join(', ');
      const more = s.length - MAX_SIZES;
      const moreText = more > 0 ? ` <span class="more">${esc((L.more || 'e altre {n}').replace('{n}', more))}</span>` : '';
      return `${esc(L.sizes || 'Taglie disponibili')}: ${shown}${moreText}`;
    }
    return s ? `${esc(L.sizes || 'Taglie disponibili')}: ${esc(s)}` : '';
  }

  if (!customElements.get('ventis-product-card')) {
    customElements.define('ventis-product-card', class extends HTMLElement {
      connectedCallback() {
        if (this.shadowRoot) return;
        const p = this.dfPayload || {}, L = p.labels || {};
        const url = safeUrl(p.url), img = safeUrl(p.image), sz = sizesText(p, L);
        this.attachShadow({mode: 'open'}).innerHTML = `
          <style>
            :host{display:block;font-family:inherit;margin:6px 0}
            .card{background:#fff;border-radius:18px;padding:14px;box-shadow:0 1px 8px rgba(20,24,40,.06)}
            .head{display:flex;align-items:flex-start;gap:10px;margin-bottom:12px}
            .num{flex:0 0 22px;height:22px;border-radius:7px;background:#eef1f6;color:#1d2340;
                 display:flex;align-items:center;justify-content:center;font-weight:500;font-size:12px}
            .title{font-weight:700;font-size:15px;line-height:22px;color:#111;min-width:0;overflow-wrap:anywhere;
                   display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
            .body{display:flex;gap:12px;align-items:center}
            .imgbox{flex:0 0 38%;aspect-ratio:1/1;background:#f3f4f7;border-radius:12px;
                    display:flex;align-items:center;justify-content:center;overflow:hidden}
            .imgbox img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
            .info{flex:1;min-width:0;display:flex;flex-direction:column;gap:7px}
            .prices{display:flex;align-items:baseline;flex-wrap:wrap;column-gap:6px;row-gap:4px}
            .price{font-weight:700;font-size:17px;color:#111;white-space:nowrap}
            .old{text-decoration:line-through;color:rgba(0,0,0,.38);font-size:12px;white-space:nowrap}
            .disc{background:#e6f6ec;color:#137333;border-radius:999px;padding:2px 7px;font-weight:600;font-size:11.5px;white-space:nowrap}
            .brand{color:#5f6368;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .sizes{background:#f5f6f8;border-radius:8px;padding:5px 8px}
            .sizes .t{font-size:11.5px;color:#333;line-height:16px;overflow-wrap:anywhere;
                      display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
            .more{color:#5f6368;font-weight:600;white-space:nowrap}
            .cta{display:block;text-align:center;color:#fff;text-decoration:none;white-space:nowrap;overflow:hidden;
                 text-overflow:ellipsis;background:linear-gradient(180deg,#2a3156 0%,#1b2140 100%);
                 border-radius:12px;padding:8px;font-weight:600;font-size:13px;margin-top:2px}
          </style>
          <div class="card">
            <div class="head">${p.n ? `<div class="num">${esc(p.n)}</div>` : ''}
              <div class="title">${esc(p.title)}</div></div>
            <div class="body">
              ${img ? `<a class="imgbox" href="${url}" target="_blank" rel="noopener"><img crossorigin="anonymous" src="${img}" alt="${esc(p.title)}"></a>` : ''}
              <div class="info">
                <div class="prices"><span class="price">${esc(p.price)}</span>
                  ${p.old ? `<span class="old">${esc(p.old)}</span>` : ''}
                  ${p.disc ? `<span class="disc">${esc(p.disc)}</span>` : ''}</div>
                ${p.brand ? `<div class="brand">${esc(p.brand)}</div>` : ''}
                ${sz ? `<div class="sizes"><div class="t">${sz}</div></div>` : ''}
                ${url ? `<a class="cta" href="${url}" target="_blank" rel="noopener">${esc(L.view || 'Vedi su VENTIS')} ↗</a>` : ''}
              </div>
            </div>
          </div>`;
        wireImages(this.shadowRoot);
      }
    });
  }

  if (!customElements.get('ventis-suggestions')) {
    customElements.define('ventis-suggestions', class extends HTMLElement {
      connectedCallback() {
        if (this.shadowRoot) return;
        const p = this.dfPayload || {}, L = p.labels || {};
        const items = (Array.isArray(p.items) ? p.items : []).filter(it => safeUrl(it.url));
        if (!items.length) return;
        this.attachShadow({mode: 'open'}).innerHTML = `
          <style>
            :host{display:block;font-family:inherit;margin:10px 0 6px}
            .box{background:#fff;border-radius:18px;padding:12px 14px;box-shadow:0 1px 8px rgba(20,24,40,.06)}
            .heading{font-weight:700;font-size:14px;color:#111;margin-bottom:6px}
            .row{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid #f0f1f4}
            .row:first-of-type{border-top:none}
            .thumb{flex:0 0 44px;width:44px;height:44px;background:#f3f4f7;border-radius:10px;
                   display:flex;align-items:center;justify-content:center;overflow:hidden}
            .thumb img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
            .txt{flex:1;min-width:0}
            .t{font-weight:600;font-size:13px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .s{font-size:12px;color:#5f6368;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .go{flex:0 0 auto;font-size:12px;font-weight:600;color:#1d2340;text-decoration:none;white-space:nowrap;
                border:1px solid #d9dce3;border-radius:10px;padding:5px 10px}
          </style>
          <div class="box">
            ${p.heading ? `<div class="heading">${esc(p.heading)}</div>` : ''}
            ${items.map(it => `
              <div class="row">
                ${safeUrl(it.image) ? `<a class="thumb" href="${safeUrl(it.url)}" target="_blank" rel="noopener"><img crossorigin="anonymous" src="${safeUrl(it.image)}" alt="${esc(it.title)}"></a>` : ''}
                <div class="txt"><div class="t">${esc(it.title)}</div>
                  <div class="s">${[it.brand, it.price].filter(Boolean).map(esc).join(' · ')}</div></div>
                <a class="go" href="${safeUrl(it.url)}" target="_blank" rel="noopener">${esc(L.view || 'Vedi')} ↗</a>
              </div>`).join('')}
          </div>`;
        wireImages(this.shadowRoot);
      }
    });
  }
})();
