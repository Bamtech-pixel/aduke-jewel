// src/pages/Profile.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      if (!u) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(rows);
    });

    return () => unsub();
  }, [user]);

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.email || "User";
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold">Profile</h2>
          <p className="text-gray-600">Signed in as {displayName}</p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/cart"
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Go to Cart
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 bg-black text-white rounded hover:opacity-90"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">Your Orders</h3>

      {orders.length === 0 ? (
        <div className="border rounded p-10 text-center text-gray-600">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border rounded-lg p-5 bg-white">
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500">Order ID</div>
                  <div className="font-semibold">{o.id}</div>

                  <div className="mt-2 text-sm text-gray-600">
                    Status:{" "}
                    <span className="font-semibold">
                      {(o.status || "PENDING_PAYMENT").replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    Total:{" "}
                    <span className="font-semibold">
                      ₦{Number(o.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="min-w-[220px]">
                  <div className="text-sm text-gray-500">Delivery</div>
                  <div className="font-medium">
                    {(o.deliveryMethod || "pickup").toUpperCase()}
                  </div>

                  <div className="mt-3">
                    <Link
                      className="inline-block px-4 py-2 border rounded hover:bg-gray-50"
                      to={`/order-success/${o.id}`}
                    >
                      View Order
                    </Link>
                  </div>
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
                    <div className="text-sm font-medium mb-1">Note</div>
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