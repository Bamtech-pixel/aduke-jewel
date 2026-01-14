import { useState } from "react";

export default function ProductCard({ product, onAdd }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="group border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur hover:shadow-sm transition">
        {/* Image */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative w-full aspect-square overflow-hidden bg-black/5 dark:bg-white/5"
          title="Click to zoom"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
            <div className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded-full border border-white/30 text-white bg-black/40">
              Zoom
            </div>
          </div>
        </button>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold leading-snug">{product.name}</p>
            {product.size ? (
              <span className="text-[11px] px-2 py-1 rounded-full border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400">
                {product.size}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-lg font-bold">
              ₦{Number(product.price || 0).toLocaleString()}
            </p>

            <button
              onClick={() => onAdd?.(product)}
              className="px-4 py-2 rounded-lg border border-[#d6b37c] text-[#8b6b2e] dark:text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-white transition text-sm font-semibold"
            >
              Add to Cart
            </button>
          </div>

          {product.note ? (
            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
              {product.note}
            </p>
          ) : null}
        </div>
      </div>

      {/* Zoom Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-3xl w-full bg-white dark:bg-[#0b0b0c] rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 dark:border-white/10">
              <p className="text-sm font-semibold">
                {product.name} {product.size ? `(${product.size})` : ""}
              </p>
              <button
                className="text-sm px-3 py-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="p-4">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-h-[70vh] object-contain rounded-xl bg-black/5 dark:bg-white/5"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}