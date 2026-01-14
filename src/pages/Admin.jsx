import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase";

const STATUS_OPTIONS = [
  "Pending",
  "Paid (Confirm)",
  "Ready",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];

const ADMIN_EMAIL = "oluwaseunabidemi57@gmail.com";
const ADMIN_PIN = "2505";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [pin, setPin] = useState("");
  const [pinOk, setPinOk] = useState(false);

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // Watch auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthReady(true);
      setPinOk(false);
      setPin("");
    });
    return () => unsub();
  }, []);

  const isAdminEmail = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Live orders (only after admin verified)
  useEffect(() => {
    if (!authReady) return;
    if (!user || !isAdminEmail || !pinOk) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        console.error(err);
        alert("Firestore error. Check console.");
      }
    );

    return () => unsub();
  }, [authReady, user, isAdminEmail, pinOk]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((o) => {
      const id = (o.id || "").toLowerCase();
      const status = (o.status || "").toLowerCase();
      const itemsText = (o.items || [])
        .map((it) => `${it.name || ""} ${it.size || ""}`.toLowerCase())
        .join(" ");
      return id.includes(q) || status.includes(q) || itemsText.includes(q);
    });
  }, [orders, search]);

  const logout = async () => {
    await signOut(auth);
  };

  const verifyPin = () => {
    if (pin === ADMIN_PIN) setPinOk(true);
    else alert("Wrong admin PIN.");
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus });
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  const copyOrder = async (o) => {
    const lines = [];
    lines.push(`Aduke_Jewels — Order`);
    lines.push(`Order ID: ${o.id}`);
    lines.push(`Status: ${o.status || "Pending"}`);
    lines.push("");

    lines.push("Items:");
    (o.items || []).forEach((it, i) => {
      const size = it.size ? ` (${it.size})` : "";
      const price = Number(it.price || 0);
      lines.push(`${i + 1}. ${it.name}${size} — ₦${price.toLocaleString()}`);
    });

    lines.push("");
    lines.push(`Total: ₦${Number(o.total || 0).toLocaleString()}`);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      alert("Copied ✅ Paste into WhatsApp.");
    } catch {
      alert("Copy failed (browser blocked clipboard).");
    }
  };

  // ---------- UI STATES ----------
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-lg mx-auto px-6 py-20">
          <h1 className="text-3xl font-bold mb-3">Admin</h1>
          <p className="text-gray-600">
            Please log in first. Then come back to <b>/admin</b>.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Only <b>{ADMIN_EMAIL}</b> can access Admin.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdminEmail) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-lg mx-auto px-6 py-20">
          <h1 className="text-3xl font-bold mb-3">Access denied</h1>
          <p className="text-gray-600">
            You are logged in as <b>{user.email}</b> but Admin requires:
          </p>
          <p className="mt-2">
            ✅ <b>{ADMIN_EMAIL}</b>
          </p>

          <button
            onClick={logout}
            className="mt-6 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!pinOk) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-md mx-auto px-6 py-20">
          <h1 className="text-3xl font-bold mb-2">Admin Verification</h1>
          <p className="text-sm text-gray-500 mb-6">
            Logged in as <b>{user.email}</b>. Enter Admin PIN.
          </p>

          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="Admin PIN"
            type="password"
          />

          <button
            onClick={verifyPin}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
          >
            Verify
          </button>

          <button
            onClick={logout}
            className="w-full mt-3 border py-3 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Admin Orders</h1>
            <p className="text-sm text-gray-500">
              Logged in as <b>{user.email}</b> · Total: <b>{orders.length}</b> ·
              Showing: <b>{filtered.length}</b>
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg p-3 w-full md:w-[360px]"
              placeholder="Search by order id / status / item name..."
            />
            <button
              onClick={logout}
              className="border rounded-lg px-4 py-3 hover:bg-gray-50"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border rounded-xl p-6 text-gray-600">
            No orders yet. Make a test order from the cart to confirm.
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((o) => (
              <div key={o.id} className="border rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="min-w-[260px]">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-xl font-bold break-all">{o.id}</p>

                    <p className="mt-3 text-sm text-gray-500">Status</p>
                    <p className="font-semibold">{o.status || "Pending"}</p>

                    <p className="mt-3 text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold">
                      ₦{Number(o.total || 0).toLocaleString()}
                    </p>

                    <button
                      onClick={() => copyOrder(o)}
                      className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Copy Order
                    </button>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-3">Items</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(o.items || []).map((it, idx) => (
                        <div
                          key={idx}
                          className="border rounded-xl p-3 flex gap-3 items-center"
                        >
                          {it.image ? (
                            <img
                              src={it.image}
                              alt={it.name}
                              className="w-14 h-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-gray-100" />
                          )}

                          <div className="flex-1">
                            <p className="font-medium">{it.name}</p>
                            {it.size ? (
                              <p className="text-xs text-gray-500">{it.size}</p>
                            ) : null}
                          </div>

                          <p className="font-semibold">
                            ₦{Number(it.price || 0).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-semibold mb-2">Change Status</p>
                      <select
                        value={o.status || "Pending"}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="w-full border rounded-lg p-3 bg-white"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <p className="text-xs text-gray-500 mt-2">
                        Tip: Set <b>Paid (Confirm)</b> after payment, then{" "}
                        <b>Ready</b> after engraving, then <b>Completed</b>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-12">
          Admin is secured by Firebase Auth (email allowlist) + PIN. Next: Firestore
          rules to block non-admin access.
        </p>
      </div>
    </div>
  );
}
