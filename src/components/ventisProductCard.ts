/* Ventis product card for the chat widget (chat-messenger custom_template).
   The agent sends: {type:"custom_template", name:"ventis-product-card", payload:{...}}
   payload: n, title, price, old, disc, brand, sizes, image, url,
            labels: {view, sizes}   (texts in the chat's language, set by the agent) */

type VentisProductPayload = {
  n?: string | number;
  title?: string;
  price?: string | number;
  old?: string | number;
  disc?: string;
  brand?: string;
  sizes?: string;
  image?: string;
  url?: string;
  labels?: { view?: string; sizes?: string };
};

const esc = (s: unknown) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string,
  );
const safeUrl = (u: unknown) =>
  /^https:\/\//i.test(String(u || "")) ? esc(u) : "";

class VentisProductCard extends HTMLElement {
  // Set by the chat SDK. `declare` emits no class field, so a payload assigned
  // before the element upgrades is not overwritten with undefined.
  declare dfPayload?: VentisProductPayload;

  connectedCallback() {
    if (this.shadowRoot) return;
    const p = this.dfPayload || {},
      L = p.labels || {};
    const url = safeUrl(p.url),
      img = safeUrl(p.image);
    this.attachShadow({ mode: "open" }).innerHTML = `
        <style>
          :host{display:block;font-family:inherit;margin:6px 0}
          .card{background:#fff;border-radius:18px;padding:14px;box-shadow:0 1px 8px rgba(20,24,40,.06)}
          .head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
          .num{width:22px;height:22px;border-radius:7px;background:#eef1f6;color:#1d2340;
               display:flex;align-items:center;justify-content:center;font-weight:500;font-size:12px}
          .title{font-weight:700;font-size:15px;color:#111;line-height:1.25}
          .body{display:flex;gap:12px;align-items:center}
          .imgbox{flex:0 0 38%;aspect-ratio:1/1;background:#f3f4f7;border-radius:12px;
                  display:flex;align-items:center;justify-content:center;overflow:hidden}
          .imgbox img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
          .info{flex:1;min-width:0;display:flex;flex-direction:column;gap:7px}
          .prices{display:flex;align-items:baseline;gap:6px;white-space:nowrap}
          .price{font-weight:700;font-size:17px;color:#111}
          .old{text-decoration:line-through;color:rgba(0,0,0,.38);font-size:12px}
          .disc{background:#e6f6ec;color:#137333;border-radius:999px;padding:2px 7px;font-weight:600;font-size:11.5px}
          .brand{color:#5f6368;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .sizes{background:#f5f6f8;border-radius:8px;padding:5px 8px;font-size:11.5px;color:#333;line-height:1.35}
          .cta{display:flex;align-items:center;justify-content:center;gap:3px;color:#fff;text-decoration:none;
               white-space:nowrap;background:linear-gradient(180deg,#2a3156 0%,#1b2140 100%);
               border-radius:12px;padding:8px;font-weight:600;font-size:13px;margin-top:2px}
        </style>
        <div class="card">
          <div class="head">${p.n ? `<div class="num">${esc(p.n)}</div>` : ""}
            <div class="title">${esc(p.title)}</div></div>
          <div class="body">
            ${img ? `<a class="imgbox" href="${url}" target="_blank" rel="noopener"><img src="${img}" alt="${esc(p.title)}"></a>` : ""}
            <div class="info">
              <div class="prices"><span class="price">${esc(p.price)}</span>
                ${p.old ? `<span class="old">${esc(p.old)}</span>` : ""}
                ${p.disc ? `<span class="disc">${esc(p.disc)}</span>` : ""}</div>
              ${p.brand ? `<div class="brand">${esc(p.brand)}</div>` : ""}
              ${p.sizes ? `<div class="sizes">${esc(L.sizes || "Taglie disponibili")}: ${esc(p.sizes)}</div>` : ""}
              ${url ? `<a class="cta" href="${url}" target="_blank" rel="noopener">${esc(L.view || "Vedi su VENTIS")} ↗</a>` : ""}
              <!-- Wishlist (heart) button: to be added when Ventis provides the wishlist API -->
            </div>
          </div>
        </div>`;
  }
}

// Guard against defining twice (Vite HMR re-runs this module).
if (!customElements.get("ventis-product-card")) {
  customElements.define("ventis-product-card", VentisProductCard);
}
