import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";

export default function TrackOrder() {
  const [params] = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("orderId") || "");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const lookup = async () => {
    if (!orderId.trim()) return alert("Enter Order Code");
    setLoading(true);
    setData(null);
    try {
      const ref = doc(db, "orderPublic", orderId.trim());
      const snap = await getDoc(ref);
      if (!snap.exists()) return alert("Order not found. Check the code.");
      setData({ id: snap.id, ...snap.data() });
    } catch (e) {
      console.error(e);
      alert("Failed to check status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Track Order</h1>
      <p className="text-gray-600 mb-6">Enter your Order Code to see status.</p>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-3"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Paste order code here..."
        />
        <button
          onClick={lookup}
          disabled={loading}
          className="px-5 py-3 bg-black text-white rounded-lg hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {data ? (
        <div className="mt-8 border rounded-2xl p-6">
          <p className="text-sm text-gray-500">Order Code</p>
          <p className="font-bold break-all">{data.id}</p>

          <p className="mt-4 text-sm text-gray-500">Status</p>
          <p className="text-xl font-bold">{data.status || "Pending"}</p>

          <p className="mt-4 text-sm text-gray-500">Delivery Type</p>
          <p className="font-semibold">{data.deliveryType || "Pickup"}</p>

          <p className="mt-4 text-sm text-gray-500">Total</p>
          <p className="font-semibold">₦{Number(data.total || 0).toLocaleString()}</p>
        </div>
      ) : null}
    </div>
  );
}