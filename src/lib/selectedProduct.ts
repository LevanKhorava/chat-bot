// The product the shopper settled on in chat. The CES agent hands it over
// through the "select_product" client-side tool (see ChatWidget); we keep it in
// localStorage so the checkout page, which the agent's link opens in a new tab,
// can read it.

// Must not start with "chat-messenger": the SDK removes every key with that
// prefix from storage when a chat session ends or restarts.
const STORAGE_KEY = "cx-selected-product";

// Fired on window every time the agent selects a product. `detail` is the
// SelectedProduct.
export const PRODUCT_SELECTED_EVENT = "cx-product-selected";

// Mirrors the tool's parameter schema in the CES app. The values come from the
// Ventis catalogue, not typed by the model. Every arg the agent sends is
// stored, so extra fields survive even if they aren't listed here.
export type SelectedProduct = {
  id?: string;
  // Per-size product code the real Ventis cart uses.
  sku?: string;
  name: string;
  price?: string;
  imageUrl?: string;
  productUrl?: string;
  size?: string;
  color?: string;
  selectedAt: string;
};

export function saveSelectedProduct(
  args: Record<string, unknown>,
): SelectedProduct {
  const product = {
    ...args,
    selectedAt: new Date().toISOString(),
  } as SelectedProduct;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(product));
  window.dispatchEvent(
    new CustomEvent(PRODUCT_SELECTED_EVENT, { detail: product }),
  );
  return product;
}

export function loadSelectedProduct(): SelectedProduct | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SelectedProduct) : null;
  } catch {
    return null;
  }
}
