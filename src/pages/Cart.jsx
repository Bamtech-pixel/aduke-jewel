import { Link } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  const total = (cart || []).reduce((sum, item) => sum + (item.price || 0), 0);

  const removeItem = (id) => {
    setCart((prev) => prev.filter((x, i) => (x.id || i) !== id));
  };

  const clearCart = () => setCart([]);

  const formatMoney = (n) => {
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `₦${n}`;
    }
  };

  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push("Hello Aduke_Jewels, I want to order:");
    lines.push("");

    (cart || []).forEach((item, idx) => {
      const name = item?.name || "Item";
      const size = item?.size ? ` (${item.size})` : "";
      const price = item?.price ? ` - ₦${item.price}` : "";
      lines.push(`${idx + 1}. ${name}${size}${price}`);

      const engr = item?.customization?.engraving?.trim();
      const mem = item?.customization?.memory?.trim();

      if (engr) lines.push(`   • Engraving: ${engr}`);
      if (mem) lines.push(`   • Memory/QR: ${mem}`);

      lines.push("");
    });

    lines.push(`Total: ${formatMoney(total)}`);
    lines.push("");
    lines.push("Delivery or Pickup? Please confirm.");
    return encodeURIComponent(lines.join("\n"));
  };

  const whatsappNumber = "2349019027395"; // Nigeria format without leading 0
  const waLink = `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold text-white">Cart</h2>
        <Link
          to="/bracelets"
          className="text-sm text-[#d6b37c] hover:underline"
        >
          Continue shopping →
        </Link>
      </div>

      {!cart || cart.length === 0 ? (
        <div className="mt-10 border border-white/10 rounded-xl p-8 bg-white/5">
          <p className="text-gray-300">Your cart is empty.</p>
          <Link
            to="/bracelets"
            className="inline-block mt-4 px-6 py-2 rounded bg-white text-black hover:bg-[#d6b37c] transition"
          >
            Shop Bracelets
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4">
            {cart.map((item, index) => {
              const key = item.id ? item.id + "-" + index : index;
              const engr = item?.customization?.engraving?.trim();
              const mem = item?.customization?.memory?.trim();

              return (
                <div
                  key={key}
                  className="border border-white/10 rounded-xl p-5 bg-white/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {item.name}
                        {item.size ? (
                          <span className="text-gray-400 font-normal">
                            {" "}
                            ({item.size})
                          </span>
                        ) : null}
                      </div>

                      <div className="text-sm text-gray-300 mt-1">
                        {formatMoney(item.price || 0)}
                      </div>

                      {(engr || mem) && (
                        <div className="mt-3 text-sm text-gray-300">
                          {engr && (
                            <div>
                              <span className="text-gray-400">Engraving:</span>{" "}
                              {engr}
                            </div>
                          )}
                          {mem && (
                            <div className="break-words">
                              <span className="text-gray-400">Memory/QR:</span>{" "}
                              {mem}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(item.id || index)}
                      className="px-3 py-2 border border-white/15 rounded hover:bg-white hover:text-black transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 border border-white/10 rounded-xl p-6 bg-black">
            <div className="flex items-center justify-between">
              <div className="text-gray-300">Total</div>
              <div className="text-xl font-semibold text-white">
                {formatMoney(total)}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded bg-white text-black hover:bg-[#d6b37c] transition font-semibold"
              >
                Checkout on WhatsApp
              </a>

              <button
                onClick={clearCart}
                className="px-6 py-3 rounded border border-white/15 text-white hover:bg-white/10 transition"
              >
                Clear cart
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Your engraving notes will be included automatically in the WhatsApp message.
            </p>
          </div>
        </>
      )}
    </div>
  );
}