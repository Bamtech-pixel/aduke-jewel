// src/pages/Checkout.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // pickup | delivery
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Firebase user (REAL source of truth)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  const total = useMemo(() => {
    return (cart || []).reduce((sum, it) => sum + Number(it.price || 0), 0);
  }, [cart]);

  // Create a WhatsApp message (includes engraving/memory)
  const whatsappText = useMemo(() => {
    const lines = (cart || []).map((it, idx) => {
      const size = it.size ? ` (${it.size})` : "";
      const custom = it.customization
        ? ` | Engraving: ${it.customization.engraving || "-"} | Memory: ${
            it.customization.memory || "-"
          }`
        : "";
      return `${idx + 1}. ${it.name}${size} - ₦${Number(it.price || 0).toLocaleString()}${custom}`;
    });

    const delivery = `Delivery: ${deliveryMethod.toUpperCase()}`;
    const notes = note.trim() ? `Note: ${note.trim()}` : "";
    const t = `Total: ₦${Number(total || 0).toLocaleString()}`;

    return encodeURIComponent(
      [
        "Hello Aduke_Jewels, I want to place an order:",
        "",
        ...lines,
        "",
        delivery,
        notes,
        t,
      ]
        .filter(Boolean)
        .join("\n")
    );
  }, [cart, deliveryMethod, note, total]);

  const whatsappLink = `https://wa.me/2349019027395?text=${whatsappText}`;

  // WEB CHECKOUT = create order in Firestore and go to order-success page
  const payOnWeb = async () => {
    if (!user) {
      alert("Please login first to use Web Checkout.");
      navigate("/login");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const order = {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        userId: user.uid,
        userEmail: user.email || "",

        status: "PENDING_PAYMENT",
        deliveryMethod,
        note: note.trim(),

        items: cart.map((it) => ({
          id: it.id,
          name: it.name,
          size: it.size || "",
          price: Number(it.price || 0),
          image: it.image || "",
          customization: it.customization || null,
        })),

        total: Number(total || 0),
      };

      const ref = await addDoc(collection(db, "orders"), order);

      // Clear cart after creating order
      clearCart?.();
      navigate(`/order-success/${ref.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Checkout</h2>
          <p className="text-gray-600 mt-2">
            Choose WhatsApp checkout or pay on the website (transfer / barcode).
          </p>
        </div>

        <Link to="/cart" className="px-4 py-2 border rounded hover:bg-gray-50">
          Back to Cart
        </Link>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* LEFT: Options */}
        <div className="border rounded-2xl p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Order Options</h3>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Delivery method</label>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="w-full border rounded px-4 py-3 bg-white text-black"
            >
              <option value="pickup">Pick up</option>
              <option value="delivery">Delivery</option>
            </select>

            <label className="block text-sm font-medium mt-4">
              Note / Engraving Instructions (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.g. Name + memory line, delivery address, extra instructions..."
              className="w-full border rounded px-4 py-3 bg-white text-black min-h-[110px]"
            />

            <div className="mt-4 text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold">
                ₦{Number(total || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {/* WhatsApp checkout ALWAYS available */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-5 py-3 rounded-lg border border-black hover:bg-black hover:text-white transition font-semibold"
            >
              Checkout on WhatsApp
            </a>

            {/* Web checkout requires login */}
            <button
              onClick={payOnWeb}
              disabled={loading}
              className="w-full px-5 py-3 rounded-lg bg-black text-white hover:opacity-90 transition font-semibold disabled:opacity-60"
              type="button"
            >
              {loading ? "Creating order..." : "Pay on Website (Transfer / Barcode)"}
            </button>

            {!user ? (
              <p className="text-xs text-gray-500 text-center">
                You must be logged in to use Web Checkout.
              </p>
            ) : null}
          </div>
        </div>

        {/* RIGHT: Cart summary */}
        <div className="border rounded-2xl p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Your Items</h3>

          {!cart || cart.length === 0 ? (
            <div className="text-gray-600">Cart is empty.</div>
          ) : (
            <div className="space-y-3">
              {cart.map((it, idx) => (
                <div key={idx} className="flex items-center gap-3 border-b pb-3">
                  <div className="w-14 h-14 rounded bg-gray-100 overflow-hidden">
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {it.name} {it.size ? `(${it.size})` : ""}
                    </div>
                    <div className="text-sm text-gray-600">
                      ₦{Number(it.price || 0).toLocaleString()}
                    </div>

                    {it.customization?.engraving || it.customization?.memory ? (
                      <div className="text-xs text-gray-500 mt-1">
                        Engraving: {it.customization?.engraving || "-"} | Memory:{" "}
                        {it.customization?.memory || "-"}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm">
            Total:{" "}
            <span className="font-semibold">
              ₦{Number(total || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}