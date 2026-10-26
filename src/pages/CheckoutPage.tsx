import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import StoreImage from "../components/StoreImage";
import { openChat } from "../lib/chat";
import {
  PRODUCT_SELECTED_EVENT,
  loadSelectedProduct,
} from "../lib/selectedProduct";

// "4242424242424242" → "4242 4242 4242 4242"
const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

// "1228" → "12/28"
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const emptyCard = { name: "", number: "", expiry: "", cvc: "" };

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted";
const inputClass =
  "mt-1 w-full rounded-none border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors hover:border-ink focus:border-brand focus:ring-2 focus:ring-brand/30";

/**
 * Mock checkout for the product the CES agent selected in chat (read from
 * localStorage). Nothing is charged and the card details never leave this
 * component's state.
 */
const CheckoutPage = () => {
  const [product, setProduct] = useState(loadSelectedProduct);
  const [card, setCard] = useState(emptyCard);
  const [paid, setPaid] = useState(false);

  // Follow the chat: the agent may pick another product from this page's own
  // chat widget (same-tab event) or from the tab that opened this one
  // (storage event).
  useEffect(() => {
    const reload = () => {
      setProduct(loadSelectedProduct());
      setPaid(false);
    };
    window.addEventListener(PRODUCT_SELECTED_EVENT, reload);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener(PRODUCT_SELECTED_EVENT, reload);
      window.removeEventListener("storage", reload);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCard(emptyCard);
    setPaid(true);
  };

  if (!product) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center animate-fade-in">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight">
          Nothing to check out yet
        </h1>
        <p className="mt-3 text-sm text-muted">
          Pick a piece with our stylist in chat and they'll send you a link to
          pay for it here.
        </p>
        <button
          type="button"
          onClick={openChat}
          className="mt-8 bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brand-light"
        >
          Open chat
        </button>
      </section>
    );
  }

  const details = [
    product.size && `Size ${product.size}`,
    product.color,
    product.sku && `SKU ${product.sku}`,
  ].filter(Boolean);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 md:py-16 animate-fade-in">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
        Checkout
      </h1>
      <p className="mt-2 bg-paper px-3 py-2 text-xs text-muted">
        Demo checkout: no payment is processed. Use any test card, e.g.{" "}
        <span className="font-mono text-ink">4242 4242 4242 4242</span>.
      </p>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        {/* Order summary */}
        <div className="border border-line p-5">
          <h2 className={labelClass}>Your order</h2>
          <div className="mt-4 flex gap-4">
            {product.imageUrl && (
              <StoreImage
                src={product.imageUrl}
                alt={product.name}
                label={product.name}
                className="aspect-[3/4] w-24 shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{product.name}</p>
              {details.length > 0 && (
                <p className="mt-1 text-xs text-muted">{details.join(" · ")}</p>
              )}
              {product.productUrl && (
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs text-brand-dark underline"
                >
                  View product
                </a>
              )}
            </div>
          </div>
          {product.price && (
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
              <span className={labelClass}>Total</span>
              <span className="text-lg font-semibold text-ink">
                {product.price}
              </span>
            </div>
          )}
        </div>

        {/* Mock card form, or the confirmation once "paid" */}
        {paid ? (
          <div className="border border-line p-5">
            <h2 className="text-lg font-extrabold uppercase tracking-tight">
              Payment received
            </h2>
            <p className="mt-2 text-sm text-muted">
              Thanks! Your order for {product.name} is confirmed. This was a
              demo, so no card was charged.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brand-light"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          // autoComplete="off" keeps browsers from filling in or saving real
          // card details on a mock form.
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <h2 className={labelClass}>Card details</h2>
            <label className="block">
              <span className={labelClass}>Name on card</span>
              <input
                required
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Card number</span>
              <input
                required
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                pattern="\d{4} \d{4} \d{4} \d{4}"
                title="16-digit card number"
                value={card.number}
                onChange={(e) =>
                  setCard({ ...card, number: formatCardNumber(e.target.value) })
                }
                className={`${inputClass} font-mono`}
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className={labelClass}>Expiry</span>
                <input
                  required
                  inputMode="numeric"
                  placeholder="MM/YY"
                  pattern="(0[1-9]|1[0-2])/\d{2}"
                  title="Expiry date as MM/YY"
                  value={card.expiry}
                  onChange={(e) =>
                    setCard({ ...card, expiry: formatExpiry(e.target.value) })
                  }
                  className={`${inputClass} font-mono`}
                />
              </label>
              <label className="block">
                <span className={labelClass}>CVC</span>
                <input
                  required
                  inputMode="numeric"
                  placeholder="123"
                  pattern="\d{3,4}"
                  title="3 or 4 digit security code"
                  value={card.cvc}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  className={`${inputClass} font-mono`}
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
            >
              {product.price ? `Pay ${product.price}` : "Pay"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default CheckoutPage;
