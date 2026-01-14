import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const WHATSAPP_NUMBER = "09019027395";

export default function Cart({ cart = [], setCart }) {
  const navigate = useNavigate();

  const total = useMemo(() => {
    return (cart || []).reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1),
      0
    );
  }, [cart]);

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push("Hello Aduke_Jewels 👋");
    lines.push("I want to order the following items:");
    lines.push("");

    cart.forEach((it, idx) => {
      const name = it.name || "Item";
      const size = it.size ? ` (${it.size})` : "";
      const qty = it.qty ? ` x${it.qty}` : "";
      const price = Number(it.price || 0);
      lines.push(`${idx + 1}. ${name}${size}${qty} - ₦${price.toLocaleString()}`);
    });

    lines.push("");
    lines.push(`Total: ₦${Number(total || 0).toLocaleString()}`);
    lines.push("");
    lines.push("Pickup or Delivery?:");
    lines.push("Engraving text (if any):");
    lines.push("Memory barcode? (Yes/No):");

    return encodeURIComponent(lines.join("\n"));
  };

  const checkoutOnWhatsapp = () => {
    if (!cart?.length) return alert("Your cart is empty.");
    const msg = buildWhatsAppMessage();
    // Use international format helps sometimes, but your local works too:
    // const wa = "2349019027395";
    const wa = WHATSAPP_NUMBER;
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  };

  const checkoutOnWebsite = () => {
    if (!cart?.length) return alert("Your cart is empty.");
    navigate("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cart</h1>
        {cart?.length ? (
          <button
            onClick={clearCart}
            className="text-sm px-4 py-2 border rounded hover:bg-gray-50"
          >
            Clear cart
          </button>
        ) : null}
      </div>

      {!cart?.length ? (
        <div className="border rounded-2xl p-10 text-center">
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <Link
            to="/bracelets"
            className="inline-block px-8 py-3 bg-black text-white rounded hover:opacity-90"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((it, index) => (
              <div key={index} className="border rounded-2xl p-4 flex gap-4">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <p className="font-semibold">{it.name}</p>
                  <p className="text-sm text-gray-500">
                    {it.size ? it.size : "—"}
                    {it.qty ? ` · Qty: ${it.qty}` : ""}
                  </p>
                  <p className="mt-2 font-bold">
                    ₦{Number(it.price || 0).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(index)}
                  className="text-sm px-3 py-2 border rounded hover:bg-gray-50 h-fit"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="border rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>

            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">Total</p>
              <p className="text-2xl font-bold">
                ₦{Number(total || 0).toLocaleString()}
              </p>
            </div>

            <button
              onClick={checkoutOnWebsite}
              className="w-full py-3 rounded-lg bg-black text-white hover:opacity-90"
            >
              Checkout (Pay on Website)
            </button>

            <button
              onClick={checkoutOnWhatsapp}
              className="w-full py-3 rounded-lg border mt-3 hover:bg-gray-50"
            >
              Checkout on WhatsApp
            </button>

            <p className="text-xs text-gray-500 mt-4">
              Website checkout generates an Order Code + Payment QR and lets you track status.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}