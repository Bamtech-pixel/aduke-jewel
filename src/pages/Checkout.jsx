import { useMemo, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const PAYMENT_ACCOUNTS = [
  { bank: "Wema Bank", accountNumber: "0243897830", accountName: "Alabi Oluwadamilola" },
  { bank: "UBA", accountNumber: "2283546978", accountName: "Alabi Oluwadamilola" },
];

export default function Checkout({ cartItems = [], clearCart }) {
  const navigate = useNavigate();

  const total = useMemo(() => {
    return (cartItems || []).reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1), 0);
  }, [cartItems]);

  const [deliveryType, setDeliveryType] = useState("Pickup"); // Pickup | Delivery
  const [fullName, setFullName] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [address, setAddress] = useState("");

  const [engravingText, setEngravingText] = useState("");
  const [memoryBarcode, setMemoryBarcode] = useState(false);
  const [memoryDetails, setMemoryDetails] = useState("");

  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!cartItems?.length) return alert("Your cart is empty.");
    if (!fullName.trim()) return alert("Please enter your full name.");
    if (!whatsApp.trim()) return alert("Please enter your WhatsApp number.");
    if (deliveryType === "Delivery" && !address.trim()) return alert("Please enter delivery address.");

    setLoading(true);
    try {
      const orderPayload = {
        createdAt: serverTimestamp(),
        status: "Pending",
        customer: { fullName: fullName.trim(), whatsApp: whatsApp.trim() },
        deliveryType,
        address: deliveryType === "Delivery" ? address.trim() : "",
        engravingText: engravingText.trim(),
        memoryBarcode,
        memoryDetails: memoryBarcode ? memoryDetails.trim() : "",
        payment: { method: "Bank Transfer", accounts: PAYMENT_ACCOUNTS },
        items: cartItems.map((it) => ({
          id: it.id || "",
          name: it.name || "",
          size: it.size || "",
          image: it.image || "",
          price: Number(it.price || 0),
          qty: Number(it.qty || 1),
        })),
        total: Number(total || 0),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderPayload);

      await setDoc(doc(db, "orderPublic", orderRef.id), {
        createdAt: serverTimestamp(),
        status: "Pending",
        total: Number(total || 0),
        deliveryType,
      });

      clearCart?.();
      navigate(`/order-success?orderId=${encodeURIComponent(orderRef.id)}`);
    } catch (e) {
      console.error(e);
      alert("Failed to place order. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">
        After placing order, you’ll get an <b>Order Code</b> + <b>Payment QR</b>. You can track delivery status later.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>

          <label className="text-sm text-gray-600">Full Name</label>
          <input className="w-full border rounded-lg p-3 mb-4 mt-1"
            value={fullName} onChange={(e) => setFullName(e.target.value)} />

          <label className="text-sm text-gray-600">WhatsApp Number</label>
          <input className="w-full border rounded-lg p-3 mb-4 mt-1"
            value={whatsApp} onChange={(e) => setWhatsApp(e.target.value)} />

          <label className="text-sm text-gray-600">Pickup or Delivery</label>
          <select className="w-full border rounded-lg p-3 mb-4 mt-1 bg-white"
            value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
            <option>Pickup</option>
            <option>Delivery</option>
          </select>

          {deliveryType === "Delivery" ? (
            <>
              <label className="text-sm text-gray-600">Delivery Address</label>
              <textarea className="w-full border rounded-lg p-3 mb-4 mt-1"
                value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
            </>
          ) : null}

          <hr className="my-6" />

          <h3 className="text-lg font-semibold mb-3">Customization</h3>

          <label className="text-sm text-gray-600">Engraving text (optional)</label>
          <input className="w-full border rounded-lg p-3 mb-4 mt-1"
            value={engravingText} onChange={(e) => setEngravingText(e.target.value)} />

          <div className="flex items-center gap-3 mb-3">
            <input type="checkbox" checked={memoryBarcode} onChange={(e) => setMemoryBarcode(e.target.checked)} />
            <p className="text-sm">
              Add <b>Memory Barcode</b> (links to text/photo you want)
            </p>
          </div>

          {memoryBarcode ? (
            <>
              <label className="text-sm text-gray-600">Memory details</label>
              <input className="w-full border rounded-lg p-3 mb-2 mt-1"
                value={memoryDetails} onChange={(e) => setMemoryDetails(e.target.value)} />
              <p className="text-xs text-gray-500">
                After payment, send the photo/text to us on WhatsApp.
              </p>
            </>
          ) : null}
        </div>

        <div className="border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3">
            {(cartItems || []).map((it, idx) => (
              <div key={idx} className="flex gap-3 items-center border rounded-xl p-3">
                <img src={it.image} alt={it.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-xs text-gray-500">
                    {it.size ? it.size : ""} {it.qty ? `· Qty: ${it.qty}` : ""}
                  </p>
                </div>
                <p className="font-semibold">₦{Number(it.price || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-600">Total</p>
            <p className="text-2xl font-bold">₦{Number(total || 0).toLocaleString()}</p>
          </div>

          <button disabled={loading} onClick={placeOrder}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-60">
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}