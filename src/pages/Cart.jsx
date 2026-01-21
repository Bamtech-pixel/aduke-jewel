// src/pages/Cart.jsx
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const total = useMemo(() => {
    return (cart || []).reduce((sum, p) => sum + Number(p.price || 0), 0);
  }, [cart]);

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const waMessage = useMemo(() => {
    const items = (cart || [])
      .map((p, i) => {
        const size = p.size ? ` (${p.size})` : "";
        const engr = p.customization?.engraving
          ? ` | Engraving: ${p.customization.engraving}`
          : "";
        const mem = p.customization?.memory
          ? ` | Memory: ${p.customization.memory}`
          : "";
        return `${i + 1}. ${p.name}${size} - ₦${Number(p.price || 0).toLocaleString()}${engr}${mem}`;
      })
      .join("\n");

    return `Hello Aduke_Jewels 👋\n\nI want to order:\n${items}\n\nTOTAL: ₦${Number(total).toLocaleString()}\n\nPlease confirm payment + delivery/pickup.`;
  }, [cart, total]);

  const whatsappUrl = useMemo(() => {
    // Nigeria number: 09019027395 -> international: 2349019027395
    const phone = "2349019027395";
    return `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
  }, [waMessage]);

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-semibold mb-3">Cart</h2>
        <div className="border border-black/10 dark:border-white/10 rounded-2xl p-10 text-center text-gray-600 dark:text-gray-400 bg-white/70 dark:bg-white/5 backdrop-blur">
          Your cart is empty.
          <div className="mt-5">
            <Link
              to="/bracelets"
              className="inline-block px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
            >
              Shop Bracelets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-semibold">Cart</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review your items and checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition text-sm"
          type="button"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((p, idx) => (
            <div
              key={`${p.id || p.name}-${idx}`}
              className="border border-black/10 dark:border-white/10 rounded-2xl p-5 bg-white/70 dark:bg-white/5 backdrop-blur"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 shrink-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">
                        {p.name} {p.size ? <span className="text-gray-500">({p.size})</span> : null}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        ₦{Number(p.price || 0).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(idx)}
                      className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition text-sm"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>

                  {(p.customization?.engraving || p.customization?.memory) && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      {p.customization?.engraving ? (
                        <div>Engraving: <span className="font-medium">{p.customization.engraving}</span></div>
                      ) : null}
                      {p.customization?.memory ? (
                        <div>Memory: <span className="font-medium">{p.customization.memory}</span></div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border border-black/10 dark:border-white/10 rounded-2xl p-6 bg-white/70 dark:bg-white/5 backdrop-blur h-fit">
          <div className="text-lg font-semibold">Order Summary</div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>₦{Number(total).toLocaleString()}</span>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {/* PAY ON WEB */}
            <button
              onClick={() => navigate("/checkout")}
              className="px-5 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition font-semibold"
              type="button"
            >
              Pay on Web
            </button>

            {/* WHATSAPP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-center px-5 py-3 rounded-xl border border-[#d6b37c] text-[#8b6b2e] dark:text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-black transition font-semibold"
            >
              Checkout on WhatsApp
            </a>

            <p className="text-xs text-gray-600 dark:text-gray-400">
              If you want engraving that holds memory, include it during product selection — it will appear on your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}