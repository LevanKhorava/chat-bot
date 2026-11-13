/* Ventis chat components for the chat widget (chat-messenger v1.16, custom_template rich content).
   Design: Ventis third-round feedback, 9 Nov 2026 ("FEEDBACK CX CHAT AGENT – THIRD ROUND").
   Load once per page (site + the apps' chat page). Defines <ventis-product-card> and <ventis-suggestions>.

   The agent sends, per product card:
     {type:"custom_template", name:"ventis-product-card", payload:{
        title, brand, price, old, disc, sizes, image, url, labels:{view, sizes} }}
     - sizes: a list (["41","42"]) or a string; empty / ["OS"] / ["Unica"] -> no sizes row (Home Design)
   and, once per reply, the recommendations:
     {type:"custom_template", name:"ventis-suggestions", payload:{
        heading, items:[{title, brand, price, old, disc, url}], labels:{view} }}
   All texts come from the agent in the chat's language. Links/images must be https.
   The widget font (Inter) is set on the page; these components inherit it.
   Wishlist (heart) button: to be added when Ventis provides a wishlist API. */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = u => /^https:\/\//i.test(String(u || '')) ? esc(u) : '';
  const ARROW = `<svg class="arr" width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
    <path d="M3.5 9.5l6-6M4.5 3.5h5v5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>`;

  function sizeList(s) {
    const list = Array.isArray(s) ? s : String(s || '').split(/\s*[,·]\s*/);
    const clean = list.map(x => String(x).trim()).filter(Boolean);
    if (!clean.length || (clean.length === 1 && /^(os|unica|one size|tu|taglia unica)$/i.test(clean[0]))) return [];
    return clean;
  }
  function priceRow(p, cls) {
    return `<div class="prices ${cls}"><span class="price">${esc(p.price)}</span>${
      p.old || p.disc ? `<span class="was">${p.old ? `<s class="old">${esc(p.old)}</s>` : ''}${
        p.disc ? `<span class="disc">${esc(p.disc)}</span>` : ''}</span>` : ''}</div>`;
  }

  const CARD_CSS = `
    :host{display:block;font-family:inherit;margin:0 0 16px}
    .card{background:#fff;border-radius:12px;padding:16px}
    .top{display:grid;grid-template-columns:42% minmax(0,1fr);column-gap:16px;align-items:start}
    .img{width:100%;max-width:129px;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .img img{max-width:100%;max-height:100%;object-fit:contain}
    .meta{min-width:0}
    .brand{font-size:17px;font-weight:650;color:#191919;line-height:23px;text-transform:uppercase;overflow-wrap:anywhere}
    .name{font-size:16px;font-weight:400;color:#454545;line-height:23px;overflow-wrap:anywhere}
    .sizes{margin-top:14px;font-size:16px;font-weight:400;color:#626262;line-height:23px;overflow-wrap:anywhere}
    .prices{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:10px;row-gap:4px;margin-top:8px}
    .price{font-size:21px;font-weight:600;color:#191919;white-space:nowrap}
    .was{display:inline-flex;align-items:baseline;gap:8px;white-space:nowrap}
    .old{font-size:16px;font-weight:400;color:#707070}
    .disc{font-size:16px;font-weight:500;color:#333;background:#EFEFEF;border-radius:4px;padding:1px 6px}
    .link{margin-top:12px;text-align:right}
    a.go{font-size:16px;font-weight:400;color:#626262;text-decoration:underline;text-decoration-color:#B5B5B5;
         text-underline-offset:3px;white-space:nowrap}
    .arr{width:13px;height:13px;margin-left:4px;vertical-align:-1px}
    @media (max-width:375px){ .card{padding:12px} .top{column-gap:12px} .img{max-width:110px} }
    /* Desktop (the chat is a floating panel, not full-screen): Ventis's spec is for mobile; same layout, ~12% smaller */
    @media (min-width:601px){
      :host{margin-bottom:12px} .card{padding:14px} .top{column-gap:14px}
      .img{max-width:108px}
      .brand{font-size:15px;line-height:20px} .name,.sizes{font-size:14px;line-height:20px}
      .sizes{margin-top:12px} .price{font-size:18px} .old,a.go{font-size:14px}
      .disc{font-size:14px;padding:0 5px} .link{margin-top:10px} .arr{width:11px;height:11px} }`;

  const SUGG_CSS = `
    :host{display:block;font-family:inherit;margin:8px 0 16px}
    .heading{font-size:17px;font-weight:500;color:#333;line-height:24px;margin-bottom:16px}
    .row{padding:16px 0;border-top:1px solid #DEDEDE}
    .row.first{border-top:none;padding-top:0}
    .l1{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
    .brand{font-size:17px;font-weight:600;color:#292929;line-height:24px;text-transform:uppercase;min-width:0;overflow-wrap:anywhere}
    a.go{flex:0 0 auto;font-size:16px;font-weight:400;color:#626262;text-decoration:underline;text-decoration-color:#B5B5B5;
         text-underline-offset:3px;white-space:nowrap}
    .arr{width:13px;height:13px;margin-left:4px;vertical-align:-1px}
    .name{font-size:16px;font-weight:400;color:#454545;line-height:24px;overflow-wrap:anywhere}
    .prices{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:10px;row-gap:4px;margin-top:4px}
    .price{font-size:18px;font-weight:600;color:#191919;white-space:nowrap}
    .was{display:inline-flex;align-items:baseline;gap:8px;white-space:nowrap}
    .old{font-size:16px;font-weight:400;color:#707070}
    .disc{font-size:14px;font-weight:500;color:#000;border:1px solid #000;border-radius:4px;padding:0 5px;background:transparent}
    @media (min-width:601px){
      .heading{font-size:15px;line-height:20px;margin-bottom:12px} .row{padding:12px 0}
      .brand{font-size:15px;line-height:20px} .name{font-size:14px;line-height:20px} a.go,.old{font-size:14px}
      .price{font-size:16px} .disc{font-size:12px} .arr{width:11px;height:11px} }`;

  function define(cardName, suggName) {
    if (cardName && !customElements.get(cardName)) {
      customElements.define(cardName, class extends HTMLElement {
        connectedCallback() {
          if (this.shadowRoot) return;
          const p = this.dfPayload || {}, L = p.labels || {};
          const url = safeUrl(p.url), img = safeUrl(p.image), sizes = sizeList(p.sizes);
          this.attachShadow({mode: 'open'}).innerHTML = `<style>${CARD_CSS}</style>
            <div class="card">
              <div class="top">
                ${img ? `<a class="img" href="${url}" target="_blank" rel="noopener"><img src="${img}" alt="${esc(p.title)}"></a>` : ''}
                <div class="meta">
                  ${p.brand ? `<div class="brand">${esc(p.brand)}</div>` : ''}
                  <div class="name">${esc(p.title)}</div>
                </div>
              </div>
              ${sizes.length ? `<div class="sizes">${esc(L.sizes || 'Taglie')}: ${sizes.map(esc).join(' · ')}</div>` : ''}
              ${priceRow(p, '')}
              ${url ? `<div class="link"><a class="go" href="${url}" target="_blank" rel="noopener">${esc(L.view || 'Vedi prodotto')}${ARROW}</a></div>` : ''}
              <!-- Wishlist (heart) button: to be added when Ventis provides the wishlist API -->
            </div>`;
        }
      });
    }
    if (suggName && !customElements.get(suggName)) {
      customElements.define(suggName, class extends HTMLElement {
        connectedCallback() {
          if (this.shadowRoot) return;
          const p = this.dfPayload || {}, L = p.labels || {};
          const items = (Array.isArray(p.items) ? p.items : []).filter(it => safeUrl(it.url));
          if (!items.length) return;
          this.attachShadow({mode: 'open'}).innerHTML = `<style>${SUGG_CSS}</style>
            ${p.heading ? `<div class="heading">${esc(p.heading)}</div>` : ''}
            ${items.map((it, i) => `
              <div class="row${i === 0 ? ' first' : ''}">
                <div class="l1">
                  <span class="brand">${esc(it.brand || '')}</span>
                  <a class="go" href="${safeUrl(it.url)}" target="_blank" rel="noopener">${esc(L.view || 'Vedi')}${ARROW}</a>
                </div>
                <div class="name">${esc(it.title)}</div>
                ${priceRow(it, '')}
              </div>`).join('')}`;
        }
      });
    }
  }

  window.VentisChatComponents = { define };        // e.g. for testing under other names
  define('ventis-product-card', 'ventis-suggestions');
})();
