// src/pages/Profile.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile fields stored in Firestore: users/{uid}
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [sendingReset, setSendingReset] = useState(false);

  // ✅ Auth guard (send user to login but remember where they wanted)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      if (!u) {
        navigate("/login", { state: { from: "/profile" } });
      }
    });
    return () => unsub();
  }, [navigate]);

  // Load user profile doc (users/{uid})
  useEffect(() => {
    const run = async () => {
      if (!user?.uid) return;

      setLoadingProfile(true);
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() || {};
          setFullName(data.fullName || "");
          setPhone(data.phone || "");
        } else {
          setFullName("");
          setPhone("");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProfile(false);
      }
    };

    run();
  }, [user]);

  // Orders stream
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    setLoadingOrders(true);

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(rows);
        setLoadingOrders(false);
      },
      (err) => {
        console.error(err);
        setOrders([]);
        setLoadingOrders(false);
      }
    );

    return () => unsub();
  }, [user]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    } finally {
      navigate("/");
    }
  };

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.email || "User";
  }, [user]);

  const saveProfile = async () => {
    if (!user?.uid) return;

    setSavingProfile(true);
    try {
      const ref = doc(db, "users", user.uid);

      await setDoc(
        ref,
        {
          uid: user.uid,
          email: user.email || "",
          fullName: fullName.trim(),
          phone: phone.trim(),
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Profile saved ✅");
    } catch (e) {
      console.error(e);
      alert("Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const resetPassword = async () => {
    if (!user?.email) {
      alert("No email found for this account.");
      return;
    }

    setSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert("Password reset email sent ✅ Check your inbox/spam.");
    } catch (e) {
      console.error(e);
      alert("Failed to send reset email.");
    } finally {
      setSendingReset(false);
    }
  };

  const orderSuccessLink = (order) => {
    const qs = new URLSearchParams({
      orderId: order?.id || "",
      amount: String(Number(order?.total || 0)),
    }).toString();

    return `/order-success?${qs}`;
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold">Profile</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Signed in as {displayName}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/cart"
            className="px-4 py-2 border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/10 transition"
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

      {/* ACCOUNT DETAILS */}
      <div className="border border-black/10 dark:border-white/10 rounded-2xl p-5 bg-white/70 dark:bg-white/5 backdrop-blur mb-8">
        <h3 className="text-xl font-semibold mb-1">Account Details</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Update your name and phone number. Password changes are done via reset email.
        </p>

        {loadingProfile ? (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Loading profile…
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Full name
              </div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="E.g. Alabi Oluwadamilola"
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#d6b37c]/40"
              />
            </div>

            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Phone number
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="E.g. 09019027395"
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#d6b37c]/40"
              />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="px-5 py-3 rounded-xl bg-[#d6b37c] text-black font-semibold hover:opacity-90 disabled:opacity-60"
                type="button"
              >
                {savingProfile ? "Saving…" : "Save profile"}
              </button>

              <button
                onClick={resetPassword}
                disabled={sendingReset}
                className="px-5 py-3 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition font-semibold disabled:opacity-60"
                type="button"
              >
                {sendingReset ? "Sending…" : "Reset password by email"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ORDERS */}
      <h3 className="text-xl font-semibold mb-3">Your Orders</h3>

      {loadingOrders ? (
        <div className="border border-black/10 dark:border-white/10 rounded p-10 text-center text-gray-600 dark:text-gray-400">
          Loading your orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-black/10 dark:border-white/10 rounded p-10 text-center text-gray-600 dark:text-gray-400">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
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
                    Status:{" "}
                    <span className="font-semibold text-black dark:text-white">
                      {(o.status || "PENDING_PAYMENT").replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total:{" "}
                    <span className="font-semibold text-black dark:text-white">
                      ₦{Number(o.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="min-w-[220px]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Delivery
                  </div>
                  <div className="font-medium">
                    {(o.deliveryMethod || "pickup").toUpperCase()}
                  </div>

                  <div className="mt-3">
                    <Link
                      className="inline-block px-4 py-2 border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/10 transition"
                      to={orderSuccessLink(o)}
                    >
                      View Order
                    </Link>
                  </div>
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
                    <div className="text-sm font-medium mb-1">Note</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap border border-black/10 dark:border-white/10 rounded p-3 bg-black/5 dark:bg-white/5">
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