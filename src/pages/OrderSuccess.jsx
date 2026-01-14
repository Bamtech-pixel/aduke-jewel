import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const PAYMENT_ACCOUNTS = [
  { bank: "Wema Bank", accountNumber: "0243897830", accountName: "Alabi Oluwadamilola" },
  { bank: "UBA", accountNumber: "2283546978", accountName: "Alabi Oluwadamilola" },
];

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId") || "";

  const qrValue = useMemo(() => {
    return [
      "Aduke_Jewels Payment",
      `Order Code: ${orderId}`,
      "",
      ...PAYMENT_ACCOUNTS.map((a) => `${a.bank}: ${a.accountNumber} (${a.accountName})`),
      "",
      "Send payment receipt on WhatsApp: 09019027395",
    ].join("\n");
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="text-3xl font-bold mb-2">Order placed ✅</h1>
      <p className="text-gray-600 mb-8">
        Save your <b>Order Code</b>. You’ll use it to track status.
      </p>

      <div className="border rounded-2xl p-6 inline-block text-left w-full">
        <p className="text-sm text-gray-500">Order Code</p>
        <p className="text-xl font-bold break-all">{orderId}</p>

        <hr className="my-5" />

        <p className="font-semibold mb-3">Payment QR</p>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-white p-3 border rounded-xl">
            <QRCodeCanvas value={qrValue} size={220} />
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              Transfer to any account below and send your receipt on WhatsApp.
            </p>

            <div className="space-y-3">
              {PAYMENT_ACCOUNTS.map((a) => (
                <div key={a.bank} className="border rounded-xl p-3">
                  <p className="font-semibold">{a.bank}</p>
                  <p className="text-sm text-gray-700">{a.accountNumber}</p>
                  <p className="text-xs text-gray-500">{a.accountName}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              WhatsApp: <b>09019027395</b> · Email: <b>damilola1902@gmail.com</b>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <Link
            to={`/track?orderId=${encodeURIComponent(orderId)}`}
            className="flex-1 text-center border rounded-lg py-3 hover:bg-gray-50"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="flex-1 text-center bg-black text-white rounded-lg py-3 hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}