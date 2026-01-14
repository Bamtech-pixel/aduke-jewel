import { useMemo, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";

const FLOW = [
  "Pending",
  "Confirmed",
  "Processing",
  "Ready for Pickup",
  "Out for Delivery",
  "Delivered",
  "Completed",
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function TrackOrder() {
  const query = useQuery();
  const prefill = query.get("orderId") || "";

  const [orderId, setOrderId] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const currentIndex = useMemo(() => {
    if (!result?.status) return -1;
    const idx = FLOW.indexOf(result.status);
    return idx === -1 ? 0 : idx;
  }, [result]);

  const fetchOrder = async () => {
    setError("");
    setResult(null);

    const id = orderId.trim();
    if (!id) {
      setError("Enter your Order Code.");
      return;
    }

    setLoading(true);
    try {
      const ref = doc(db, "orderPublic", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError("Order not found. Check the code and try again.");
        return;
      }

      setResult({ id: snap.id, ...snap.data() });
    } catch (e) {
      console.error(e);
      setError("Could not load tracking. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between gap-3 mb-8">
        <h1 className="text-3xl font-bold">Track Order</h1>
        <Link to="/" className="text-sm underline text-gray-600 hover:text-black">
          Back to Home
        </Link>
      </div>

      {/* INPUT CARD */}
      <div className="border rounded-2xl p-6 bg-white">
        <p className="text-sm text-gray-600 mb-4">
          Enter your <span className="font-semibold">Order Code</span> to see your order status.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 8H2K1D9..."
            className="flex-1 border rounded-lg p-3"
          />
          <button
            onClick={fetchOrder}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Track"}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 border border-red-200 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* SUMMARY */}
          <div className="border rounded-2xl p-6 bg-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500">Order Code</p>
                <p className="font-bold break-all">{result.id}</p>

                <p className="mt-3 text-sm text-gray-700">
                  <span className="font-semibold">Delivery:</span>{" "}
                  {result.deliveryType || "Pickup"}
                </p>

                {result.deliveryType === "Delivery" && result.address ? (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Address:</span> {result.address}
                  </p>
                ) : null}
              </div>

              <div className="text-left md:text-right">
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-2xl font-bold">{result.status || "Pending"}</p>
                {result.updatedAt ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Updated: {String(result.updatedAt)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="border rounded-2xl p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Progress</h2>

            <div className="space-y-3">
              {FLOW.map((step, i) => {
                const done = i <= currentIndex;
                const isCurrent = i === currentIndex;

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border ${
                        done ? "bg-black border-black" : "bg-white border-gray-300"
                      }`}
                      title={isCurrent ? "Current" : done ? "Done" : "Pending"}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          isCurrent
                            ? "font-semibold text-black"
                            : done
                            ? "text-gray-800"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs px-2 py-1 border rounded-full">
                        Current
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="font-semibold text-black mb-1">Need help?</p>
              <p>
                If your status is not updating or you want to confirm payment, send your receipt on WhatsApp.
              </p>
              <p className="mt-2">
                WhatsApp: <span className="font-semibold">09019027395</span> · Email:{" "}
                <span className="font-semibold">damilola1902@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}