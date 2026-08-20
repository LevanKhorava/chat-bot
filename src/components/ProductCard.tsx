import { openChat } from "../lib/chat";
import StoreImage from "./StoreImage";
import type { Product } from "../data/catalog";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group flex flex-col">
      <div className="relative">
        <StoreImage
          src={product.image}
          alt={product.name}
          label={product.name}
          className="aspect-[3/4]"
        />
        {product.badge && (
          <span className="absolute left-0 top-0 bg-sale px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-sm font-medium text-ink">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ink">{product.price}</span>
          {product.wasPrice && (
            <span className="text-xs text-muted line-through">
              {product.wasPrice}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={openChat}
          className="mt-3 border border-ink bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Order in chat
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
