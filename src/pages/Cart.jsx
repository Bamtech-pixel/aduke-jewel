import { useMemo, useState } from "react";
import QRCode from "react-qr-code";

const CART_KEY = "aduke_cart_v1";
const USERS_KEY = "aduke_users_v1";
const CURRENT_USER_KEY = "aduke_current_user_v1";

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function Cart({ cart, setCart }) {
  const total = cart.reduce((sum, i) => sum + i.price, 0);

  const WHATSAPP_NUMBER = "2349019027395";
  const BUSINESS_NAME = "Aduke_Jewels";

  const ACCOUNTS = [
    { bank: "Wema Bank", accountNumber: "0243897830", accountName: "Alabi Oluwadamilola" },
    { bank: "UBA", accountNumber: "2283546978", accountName: "Alabi Oluwadamilola" },
  ];

  const [deliveryType, setDeliveryType] = useState("Delivery");
  const [address, setAddress] = useState("");
  const [engravingText, setEngravingText] = useState("");
  const [memoryBarcode, setMemoryBarcode] = useState(false);
  const [memoryDetails, setMemoryDetails] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const orderCode = useMemo(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return (
      "AJ-" +
      Array.from({ length: 6 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("")
    );
  }, []);

  const saveOrderToUser = () => {
    const current = read(CURRENT_USER_KEY, null);
    if (!current) return;

    const users = read(USERS_KEY, []);
    const userIndex = users.findIndex((u) => u.id === current.id);
    if (userIndex === -1) return;

    const order = {
      orderCode,
      date: new Date().toISOString(),
      items: cart,
      total,
      deliveryType,
      address: deliveryType === "Delivery" ? address : "",
      engravingText,
      memoryBarcode,
      memoryDetails,
      status: "Pending",
    };

    users[userIndex].orders = users[userIndex].orders || [];
    users[userIndex].orders.unshift(order);

    write(USERS_KEY, users);
  };

  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push(`Hello ${BUSINESS_NAME} 👋`);
    lines.push(`Order Code: ${orderCode}`);
    lines.push("");

    cart.forEach((item, i) => {
      const size = item.size ? ` (${item.size})` : "";
      lines.push(`${i + 1}. ${item.name}${size} — ₦${item.price.toLocaleString()}`);
    });

    lines.push("");
    lines.push(`Total: ₦${total.toLocaleString()}`);
    lines.push(`Delivery: ${deliveryType}`);
    if (deliveryType === "Delivery") lines.push(`Address: ${address}`);

    if (engravingText) {
      lines.push("");
      lines.push(`Engraving: ${engravingText}`);
    }

    if (memoryBarcode) {
      lines.push("");
      lines.push("Memory Barcode: YES");
      if (memoryDetails) lines.push(`Details: ${memoryDetails}`);
    }

    lines.push("");
    lines.push("Payment Accounts:");
    ACCOUNTS.forEach((a) =>
      lines.push(`${a.bank}: ${a.accountNumber} (${a.accountName})`)
    );

    return lines.join("\n");
  };

  const checkout = () => {
    if (!cart.length) return;
    saveOrderToUser();
    setShowReceipt(true);
    write(CART_KEY, cart);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`,
      "_blank"
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {cart.map((item, i) => (
        <div key={i} className="flex gap-4 border p-4 rounded mb-3">
          <img src={item.image} className="w-20 h-20 rounded object-cover" />
          <div className="flex-1">
            <p className="font-semibold">{item.name}</p>
            {item.size && <p className="text-sm text-gray-500">{item.size}</p>}
            <p>₦{item.price.toLocaleString()}</p>
          </div>
        </div>
      ))}

      <div className="mt-6 space-y-3">
        <select
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>Delivery</option>
          <option>Pickup</option>
        </select>

        {deliveryType === "Delivery" && (
          <textarea
            placeholder="Delivery address"
            className="w-full border p-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}

        <textarea
          placeholder="Engraving text (optional)"
          className="w-full border p-2 rounded"
          value={engravingText}
          onChange={(e) => setEngravingText(e.target.value)}
        />

        <label className="flex gap-2 items-center text-sm">
          <input
            type="checkbox"
            checked={memoryBarcode}
            onChange={(e) => setMemoryBarcode(e.target.checked)}
          />
          Add Memory Barcode
        </label>

        {memoryBarcode && (
          <textarea
            placeholder="Memory barcode details"
            className="w-full border p-2 rounded"
            value={memoryDetails}
            onChange={(e) => setMemoryDetails(e.target.value)}
          />
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">₦{total.toLocaleString()}</p>
        <button
          onClick={checkout}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Checkout on WhatsApp
        </button>
      </div>

      {showReceipt && (
        <div className="mt-10 border p-6 rounded">
          <p className="font-semibold mb-3">Order Receipt</p>
          <QRCode value={orderCode} size={180} />
          <p className="mt-2 text-sm">Order Code: {orderCode}</p>
        </div>
      )}
    </div>
  );
}
