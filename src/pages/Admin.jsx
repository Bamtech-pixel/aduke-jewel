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
  serverTimestamp,
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
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [qText, setQText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ✅ Auth guard (remember where user wanted)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      if (!u) {
        navigate("/login", { state: { from: "/admin" } });
      }
    });
    return () => unsub();
  }, [navigate]);

  const isAdminEmail = useMemo(() => {
    if (!user?.email) return false;
    return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }, [user]);

  // Orders stream (only after admin email + PIN)
  useEffect(() => {
    if (!user || !isAdminEmail || !pinOk) return;

    setLoadingOrders(true);

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(rows);
        setLoadingOrders(false);
      },
      () => {
        setOrders([]);
        setLoadingOrders(false);
      }
    );

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
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      alert("Order ID copied!");
    } catch {
      alert("Copy failed. (Browser blocked clipboard)");
    }
  };

  // Guard: wait for auth
  if (!user) return null;

  // Not admin email
  if (!isAdminEmail) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-3">Admin</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This account is not allowed to access Admin.
        </p>
      </div>
    );
  }

  // PIN gate
  if (!pinOk) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-3">Admin Access</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter Admin PIN to continue.
        </p>

        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
          className="w-full border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 mb-4 bg-white/70 dark:bg-white/5"
          type="password"
        />
        <button
          onClick={() => setPinOk(pin === ADMIN_PIN)}
          className="w-full px-5 py-3 bg-black text-white rounded-xl hover:opacity-90"
          type="button"
        >
          Continue
        </button>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          (For now this PIN is front-end protected. Later we can harden it with server rules.)
        </p>
      </div>
    );
  }

  // Main Admin UI
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold">Admin Orders</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and update customer orders status.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Search order id, email, item..."
            className="border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 bg-white/70 dark:bg-white/5"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 bg-white/70 dark:bg-white/5"
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

      {loadingOrders ? (
        <div className="border border-black/10 dark:border-white/10 rounded-2xl p-10 text-center text-gray-600 dark:text-gray-400 bg-white/70 dark:bg-white/5">
          Loading orders…
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-black/10 dark:border-white/10 rounded-2xl p-10 text-center text-gray-600 dark:text-gray-400 bg-white/70 dark:bg-white/5">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div
              key={o.id}
              className="border border-black/10 dark:border-white/10 rounded-2xl p-5 bg-white/70 dark:bg-white/5 backdrop-blur"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Order ID
                  </div>
                  <div className="font-semibold">{o.id}</div>

                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Email:{" "}
                    <span className="font-medium text-black dark:text-white">
                      {o.userEmail || "Guest"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Delivery:{" "}
                    <span className="font-medium text-black dark:text-white">
                      {(o.deliveryMethod || "pickup").toUpperCase()}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total:{" "}
                    <span className="font-semibold text-black dark:text-white">
                      ₦{Number(o.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[240px]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Status
                  </div>
                  <select
                    value={o.status || "PENDING_PAYMENT"}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className="border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 bg-white/70 dark:bg-white/5"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => copyId(o.id)}
                    className="px-3 py-2 border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition"
                    type="button"
                  >
                    Copy Order ID
                  </button>
                </div>
              </div>

              <div className="mt-4 border-t border-black/10 dark:border-white/10 pt-4">
                <div className="text-sm font-medium mb-2">Items</div>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  {(o.items || []).map((it, idx) => (
                    <div key={idx} className="flex justify-between gap-3">
                      <span className="text-gray-700 dark:text-gray-300">
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
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap border border-black/10 dark:border-white/10 rounded-xl p-3 bg-black/5 dark:bg-white/5">
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