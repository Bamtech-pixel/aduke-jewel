// src/pages/Checkout.jsx
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const PAYMENT_ACCOUNTS = [
  { bank: "Wema Bank", accountNumber: "0243897830", accountName: "Alabi Oluwadamilola" },
  { bank: "UBA", accountNumber: "2283546978", accountName: "Alabi Oluwadamilola" },
];

// ✅ barcode is checkout-only
const BARCODE_ADDON_PRICE = 2000;

export default function Checkout({ cart = [], setCart, currentUser }) {
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // pickup | delivery
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);

  // ✅ barcode add-on (NOT persistent)
  const [barcodeEnabled, setBarcodeEnabled] = useState(false);
  const [barcodeContent, setBarcodeContent] = useState("");

  const itemsTotal = useMemo(() => {
    return (cart || []).reduce((sum, it) => sum + Number(it.price || 0), 0);
  }, [cart]);

  const grandTotal = useMemo(() => {
    return Number(itemsTotal || 0) + (barcodeEnabled ? BARCODE_ADDON_PRICE : 0);
  }, [itemsTotal, barcodeEnabled]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied ✅");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  const makeWhatsappLink = () => {
    const lines = [];
    lines.push("Hello Aduke_Jewels 👋 I want to place an order.");
    lines.push("");
    lines.push("Items:");
    (cart || []).forEach((it, idx) => {
      lines.push(
        `${idx + 1}. ${it.name}${it.size ? ` (${it.size})` : ""} - ₦${Number(it.price || 0).toLocaleString()}`
      );
    });

    lines.push("");
    lines.push(`Items Total: ₦${Number(itemsTotal || 0).toLocaleString()}`);

    if (barcodeEnabled) {
      lines.push(`Memory Barcode: YES (+₦${BARCODE_ADDON_PRICE.toLocaleString()})`);
      if (barcodeContent.trim()) lines.push(`Barcode content: ${barcodeContent.trim()}`);
    } else {
      lines.push("Memory Barcode: NO");
    }

    lines.push(`Grand Total: ₦${Number(grandTotal || 0).toLocaleString()}`);
    lines.push(`Delivery method: ${deliveryMethod.toUpperCase()}`);
    if (note.trim()) lines.push(`Note: ${note.trim()}`);

    const msg = encodeURIComponent(lines.join("\n"));
    const phone = "2349019027395";
    return `https://wa.me/${phone}?text=${msg}`;
  };

  const placeOrder = async () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // ✅ Force login before placing orders (matches your Firestore rules)
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to continue.");
      navigate("/login");
      return;
    }

    setPlacing(true);
    try {
      const email =
        user?.email ||
        currentUser?.email ||
        currentUser?.user?.email ||
        "Guest";

      const docRef = await addDoc(collection(db, "orders"), {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        status: "PENDING_PAYMENT",

        userId: user.uid,
        userEmail: email,

        deliveryMethod,
        note: note.trim(),

        items: cart.map((it) => ({
          id: it.id,
          name: it.name,
          size: it.size || "",
          price: Number(it.price || 0),
          image: it.image || "",
        })),

        // ✅ split totals (makes admin verification clearer)
        totals: {
          itemsTotal: Number(itemsTotal || 0),
          barcodeAddon: barcodeEnabled ? BARCODE_ADDON_PRICE : 0,
          grandTotal: Number(grandTotal || 0),
        },

        // keep old field for existing admin UI compatibility
        total: Number(grandTotal || 0),

        barcode: {
          enabled: !!barcodeEnabled,
          price: barcodeEnabled ? BARCODE_ADDON_PRICE : 0,
          content: barcodeEnabled ? barcodeContent.trim() : "",
        },

        payment: {
          method: "BANK_TRANSFER",
          accounts: PAYMENT_ACCOUNTS,
        },
      });

      try {
        setCart?.([]);
      } catch {}

      // ✅ Your App route is /order-success (query-based)
      const qs = new URLSearchParams({
        orderId: docRef.id,
        amount: String(Number(grandTotal || 0)),
      }).toString();

      navigate(`/order-success?${qs}`);
    } catch (e) {
      console.error(e);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-3xl font-semibold">Checkout</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Choose how you want to pay and confirm your order.
          </p>
        </div>

        <Link
          to="/cart"
          className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          Back to Cart
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Method */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5">
            <h3 className="text-lg font-semibold mb-3">Delivery</h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod("pickup")}
                className={`px-4 py-3 rounded-xl border transition text-sm font-semibold ${
                  deliveryMethod === "pickup"
                    ? "border-[#d6b37c] bg-[#d6b37c]/15 text-[#8b6b2e] dark:text-[#f2e3c6]"
                    : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                Pick up
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod("delivery")}
                className={`px-4 py-3 rounded-xl border transition text-sm font-semibold ${
                  deliveryMethod === "delivery"
                    ? "border-[#d6b37c] bg-[#d6b37c]/15 text-[#8b6b2e] dark:text-[#f2e3c6]"
                    : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Order note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g. delivery instructions…"
                className="mt-2 w-full min-h-[110px] rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#d6b37c]/40"
              />
            </div>
          </div>

          {/* Memory Barcode add-on */}
          <div className="rounded-2xl border border-[#d6b37c]/40 bg-[#d6b37c]/10 p-5">
            <h3 className="text-lg font-semibold mb-2">Optional Add-on</h3>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={barcodeEnabled}
                onChange={(e) => setBarcodeEnabled(e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="font-semibold">
                  Add Memory Barcode Engraving (+₦{BARCODE_ADDON_PRICE.toLocaleString()})
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Adds a scannable barcode to your jewelry. Verification is still manual.
                </div>
              </div>
            </label>

            {barcodeEnabled ? (
              <div className="mt-4">
                <label className="text-sm font-medium">
                  What should the barcode open? (text or link)
                </label>
                <textarea
                  value={barcodeContent}
                  onChange={(e) => setBarcodeContent(e.target.value)}
                  placeholder="Paste a link, write text, or describe what you want it to open..."
                  className="mt-2 w-full min-h-[90px] rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#d6b37c]/40"
                />
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  If you prefer, you can also send the final details on WhatsApp after payment.
                </p>
              </div>
            ) : null}
          </div>

          {/* Bank Transfer */}
          <div className="rounded-2xl border border-[#d6b37c]/40 bg-[#d6b37c]/10 p-5">
            <h3 className="text-lg font-semibold mb-2">Pay on Web (Bank Transfer)</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Transfer the exact total to any account below, then click “Place Order”.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PAYMENT_ACCOUNTS.map((acc, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4"
                >
                  <div className="text-xs text-gray-600 dark:text-gray-400">Bank</div>
                  <div className="font-semibold">{acc.bank}</div>

                  <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">Account Number</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-lg tracking-wide">{acc.accountNumber}</div>
                    <button
                      type="button"
                      onClick={() => copy(acc.accountNumber)}
                      className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-sm"
                    >
                      Copy
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">Account Name</div>
                  <div className="font-medium">{acc.accountName}</div>

                  <button
                    type="button"
                    onClick={() => copy(`${acc.bank}\n${acc.accountNumber}\n${acc.accountName}`)}
                    className="mt-4 w-full px-4 py-2 rounded-xl border border-[#d6b37c] text-[#8b6b2e] dark:text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-black transition text-sm font-semibold"
                  >
                    Copy all details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp checkout */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5">
            <h3 className="text-lg font-semibold mb-2">Checkout on WhatsApp</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If you prefer, send your order to WhatsApp and we’ll confirm payment there.
            </p>

            <a
              href={makeWhatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition font-semibold"
            >
              Continue on WhatsApp
            </a>
          </div>
        </div>

        {/* RIGHT: summary */}
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5 h-fit">
          <h3 className="text-lg font-semibold">Order Summary</h3>

          <div className="mt-4 space-y-3">
            {(cart || []).map((it, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {it.name} {it.size ? <span className="text-gray-500">({it.size})</span> : null}
                  </div>
                </div>
                <div className="font-semibold whitespace-nowrap">
                  ₦{Number(it.price || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-black/10 dark:border-white/10 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Items Total</span>
              <span className="font-semibold">₦{Number(itemsTotal || 0).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Barcode Add-on</span>
              <span className="font-semibold">
                ₦{(barcodeEnabled ? BARCODE_ADDON_PRICE : 0).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
              <span className="text-gray-600 dark:text-gray-400">Grand Total</span>
              <span className="text-xl font-bold">₦{Number(grandTotal || 0).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={placing || cart.length === 0}
            className="mt-5 w-full px-6 py-3 rounded-xl bg-[#d6b37c] text-black font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
          >
            {placing ? "Placing order..." : "Place Order (after transfer)"}
          </button>

          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            After payment, your order will appear in your Profile and Admin can update its status.
          </p>
        </div>
      </div>
    </div>
  );
}