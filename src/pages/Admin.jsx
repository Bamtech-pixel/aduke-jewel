// src/pages/Admin.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

const ADMIN_PIN = "2505";
const ADMIN_EMAIL = "oluwaseunabidemi57@gmail.com";

const STATUS_OPTIONS = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "READY",
  "DELIVERED",
  "PICKED_UP",
  "CANCELLED",
];

export default function Admin() {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [pinOk, setPinOk] = useState(false);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const [qText, setQText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      if (!u) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  const isAdminEmail = useMemo(() => {
    if (!user?.email) return false;
    return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }, [user]);

  // Orders stream
  useEffect(() => {
    if (!user || !isAdminEmail || !pinOk) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(rows);
    });

    return () => unsub();
  }, [user, isAdminEmail, pinOk]);

  const filtered = useMemo(() => {
    const t = qText.trim().toLowerCase();

    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : o.status === statusFilter;

      const hay = [
        o.id,
        o.userEmail || "",
        o.deliveryMethod || "",
        o.status || "",
        ...(o.items || []).map((i) => i.name),
      ]
        .join(" ")
        .toLowerCase();

      const matchesText = !t ? true : hay.includes(t);

      return matchesStatus && matchesText;
    });
  }, [orders, qText, statusFilter]);

  const setStatus = async (orderId, nextStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: nextStatus,
        updatedAt: new Date(),
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  // PIN gate UI
  if (!user) return null;

  if (!isAdminEmail) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-3">Admin</h2>
        <p className="text-gray-600">
          This account is not allowed to access Admin.
        </p>
      </div>
    );
  }

  if (!pinOk) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-3">Admin Access</h2>
        <p className="text-gray-600 mb-6">
          Enter Admin PIN to continue.
        </p>

        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
          className="w-full border rounded px-4 py-3 mb-4"
          type="password"
        />
        <button
          onClick={() => setPinOk(pin === ADMIN_PIN)}
          className="w-full px-5 py-3 bg-black text-white rounded hover:opacity-90"
          type="button"
        >
          Continue
        </button>
      </div>
    );
  }

  // Main Admin UI
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold">Admin Orders</h2>
          <p className="text-gray-600">
            View and update customer orders status.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Search order id, email, item..."
            className="border rounded px-4 py-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="ALL">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border rounded p-10 text-center text-gray-600">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o.id} className="border rounded-lg p-5 bg-white">
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500">Order ID</div>
                  <div className="font-semibold">{o.id}</div>

                  <div className="mt-2 text-sm text-gray-600">
                    Email: <span className="font-medium">{o.userEmail || "Guest"}</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    Delivery:{" "}
                    <span className="font-medium">
                      {(o.deliveryMethod || "pickup").toUpperCase()}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    Total:{" "}
                    <span className="font-semibold">
                      ₦{Number(o.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[220px]">
                  <div className="text-sm text-gray-500">Status</div>
                  <select
                    value={o.status || "PENDING_PAYMENT"}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => navigator.clipboard.writeText(o.id)}
                    className="px-3 py-2 border rounded hover:bg-gray-50"
                    type="button"
                  >
                    Copy Order ID
                  </button>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="text-sm font-medium mb-2">Items</div>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  {(o.items || []).map((it, idx) => (
                    <div key={idx} className="flex justify-between gap-3">
                      <span>
                        {it.name}
                        {it.size ? ` (${it.size})` : ""}
                      </span>
                      <span className="font-medium">
                        ₦{Number(it.price || 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {o.note ? (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">
                      Customization / Memory Engraving Note
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap border rounded p-3 bg-gray-50">
                      {o.note}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}