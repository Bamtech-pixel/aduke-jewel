import { Link, useLocation } from "react-router-dom";

const WHATSAPP_NUMBER = "09019027395";

// Your bank details
const BANKS = [
  { bank: "Wema Bank", accountNumber: "0243897830", name: "Alabi Oluwadamilola" },
  { bank: "UBA", accountNumber: "2283546978", name: "Alabi Oluwadamilola" },
];

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function OrderSuccess() {
  const query = useQuery();
  const orderId = query.get("orderId") || "";

  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push("Hello Aduke_Jewels 👋");
    lines.push("I have made payment for my order.");
    lines.push("");
    lines.push(`Order Code: ${orderId || "(not shown)"}`);
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="border rounded-2xl p-8 bg-white">
        <h1 className="text-3xl font-bold mb-2">Order created ✅</h1>
        <p className="text-gray-600 mb-8">
          Your order has been recorded. Use your Order Code to track progress.
        </p>

        {/* ORDER CODE */}
        <div className="border rounded-xl p-5 bg-gray-50 mb-8">
          <p className="text-xs text-gray-500">Order Code</p>
          <p className="text-xl font-bold break-all">{orderId || "—"}</p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link
              to={orderId ? `/track?orderId=${encodeURIComponent(orderId)}` : "/track"}
              className="px-6 py-3 rounded-lg bg-black text-white hover:opacity-90 text-center"
            >
              Track Order
            </Link>

            <button
              onClick={openWhatsApp}
              className="px-6 py-3 rounded-lg border hover:bg-gray-50"
            >
              Send receipt on WhatsApp
            </button>
          </div>
        </div>

        {/* PAYMENT SECTION */}
        <h2 className="text-xl font-semibold mb-3">Payment (Bank Transfer)</h2>
        <p className="text-sm text-gray-600 mb-5">
          Transfer to any account below, then send your receipt on WhatsApp.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {BANKS.map((b) => (
            <div key={b.accountNumber} className="border rounded-xl p-5">
              <p className="text-sm font-semibold">{b.bank}</p>
              <p className="text-2xl font-bold mt-2">{b.accountNumber}</p>
              <p className="text-sm text-gray-600 mt-1">{b.name}</p>
            </div>
          ))}
        </div>

        {/* QR CODE (placeholder) */}
        <div className="border rounded-xl p-6 bg-gray-50 mb-8">
          <h3 className="font-semibold mb-2">Payment QR (optional)</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have a QR image for payment later, we can show it here. For now,
            bank transfer works perfectly.
          </p>

          <div className="w-full max-w-sm aspect-square bg-white border rounded-xl flex items-center justify-center text-gray-400">
            QR Code Placeholder
          </div>
        </div>

        {/* CUSTOMIZATION INFO */}
        <div className="border rounded-xl p-6">
          <h3 className="font-semibold mb-2">Customization & Memory Barcode</h3>
          <p className="text-sm text-gray-600">
            Want engraving (names, dates, words) or a <span className="font-semibold">Memory Barcode</span> on your jewelry?
            After payment, message us on WhatsApp with:
          </p>

          <ul className="list-disc pl-5 text-sm text-gray-700 mt-4 space-y-2">
            <li>Your <span className="font-semibold">Order Code</span></li>
            <li>The exact <span className="font-semibold">engraving text</span></li>
            <li>
              If you want a Memory Barcode: send the{" "}
              <span className="font-semibold">picture/text/link</span> you want the barcode to open
            </li>
          </ul>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={openWhatsApp}
              className="px-6 py-3 rounded-lg bg-black text-white hover:opacity-90"
            >
              Message on WhatsApp
            </button>
            <Link
              to="/"
              className="px-6 py-3 rounded-lg border hover:bg-gray-50 text-center"
            >
              Continue shopping
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