// src/pages/OrderSuccess.jsx
import { Link, useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";

const WHATSAPP_NUMBER = "09019027395";

// Bank details
const BANKS = [
  { bank: "Wema Bank", accountNumber: "0243897830", name: "Alabi Oluwadamilola" },
  { bank: "UBA", accountNumber: "2283546978", name: "Alabi Oluwadamilola" },
];

export default function OrderSuccess() {
  const { orderId = "" } = useParams();
  const { search } = useLocation();

  // amount comes from query: /order-success/:orderId?amount=45000
  const params = new URLSearchParams(search);
  const amountParam = params.get("amount") || "";
  const amount = Number(String(amountParam).replace(/[^\d]/g, "")) || 0;

  // QR payload: Order ID + Amount (manual verification)
  const qrPayload = useMemo(() => {
    const data = {
      brand: "Aduke_Jewels",
      orderId: orderId || "",
      amount: amount || 0,
      currency: "NGN",
      note: "Manual verification",
    };
    return JSON.stringify(data);
  }, [orderId, amount]);

  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push("Hello Aduke_Jewels 👋");
    lines.push("I have made payment for my order.");
    lines.push("");
    lines.push(`Order Code: ${orderId || "(not shown)"}`);
    if (amount) lines.push(`Amount: ₦${amount.toLocaleString()}`);
    lines.push("");
    lines.push("I am sending my payment receipt here.");
    lines.push("");
    lines.push("Pickup or Delivery?:");
    lines.push("If Delivery, Address:");
    lines.push("");
    lines.push("Engraving text (if any):");
    lines.push("Memory Barcode? (Yes/No):");
    lines.push("If Yes, send the picture/text you want the barcode to open:");
    return encodeURIComponent(lines.join("\n"));
  };

  const openWhatsApp = () => {
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied ✅");
    } catch {
      alert("Copy failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="border border-black/10 dark:border-white/10 rounded-2xl p-5 sm:p-8 bg-white dark:bg-black">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Order created ✅</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your order has been recorded. Use your Order Code to track progress.
        </p>

        {/* ORDER CODE */}
        <div className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-gray-50 dark:bg-white/5 mb-8">
          <p className="text-xs text-gray-500">Order Code</p>
          <p className="text-lg sm:text-xl font-bold break-all">{orderId || "—"}</p>

          {amount ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Amount: <span className="font-semibold">₦{amount.toLocaleString()}</span>
            </p>
          ) : null}

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => copyText(orderId)}
              className="px-6 py-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
              type="button"
            >
              Copy Order ID
            </button>

            <button
              onClick={openWhatsApp}
              className="px-6 py-3 rounded-lg bg-black text-white hover:opacity-90 text-center"
              type="button"
            >
              Send receipt on WhatsApp
            </button>
          </div>
        </div>

        {/* PAYMENT SECTION */}
        <h2 className="text-xl font-semibold mb-3">Payment (Bank Transfer)</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          Transfer to any account below, then send your receipt on WhatsApp.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {BANKS.map((b) => (
            <div
              key={b.accountNumber}
              className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-white/5"
            >
              <p className="text-sm font-semibold">{b.bank}</p>
              <p className="text-2xl font-bold mt-2">{b.accountNumber}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{b.name}</p>

              <button
                className="mt-4 px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-sm"
                type="button"
                onClick={() => copyText(`${b.bank}\n${b.accountNumber}\n${b.name}`)}
              >
                Copy account details
              </button>
            </div>
          ))}
        </div>

        {/* ORDER QR */}
        <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 bg-gray-50 dark:bg-white/5 mb-8">
          <h3 className="font-semibold mb-2">Order QR (for verification)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This QR encodes your <b>Order ID</b>
            {amount ? " and Amount" : ""}. Show it to admin for fast manual verification.
          </p>

          {!orderId ? (
            <div className="text-gray-500 text-sm">No Order ID found.</div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-white p-4 rounded-xl border border-black/10">
                <QRCodeCanvas value={qrPayload} size={220} includeMargin />
              </div>

              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-2">QR payload</div>
                <div className="text-sm break-words border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-black">
                  {qrPayload}
                </div>

                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => copyText(qrPayload)}
                    className="px-5 py-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                  >
                    Copy QR payload
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        `Order: ${orderId}${amount ? ` | Amount: ₦${amount.toLocaleString()}` : ""}`
                      )
                    }
                    className="px-5 py-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                  >
                    Copy summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-black/10 dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Continue shopping</h3>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="px-6 py-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-center"
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="px-6 py-3 rounded-lg bg-black text-white hover:opacity-90 text-center"
            >
              View Cart
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            WhatsApp: 09019027395 · Email: damilola1902@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}