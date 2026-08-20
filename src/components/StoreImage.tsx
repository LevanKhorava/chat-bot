import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  label?: string;
  className?: string;
};

/**
 * A clothing image with a branded gradient fallback. If the remote image fails
 * to load, we reveal a teal→ink gradient tile with the item label so the layout
 * always looks intentional (never a broken-image icon).
 */
const StoreImage = ({ src, alt, label, className = "" }: Props) => {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-brand-dark via-ink to-ink ${className}`}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          {label ?? alt}
        </div>
      )}
    </div>
  );
};

export default StoreImage;
