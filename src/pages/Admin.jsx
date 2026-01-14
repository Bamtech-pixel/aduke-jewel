import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const ADMIN_EMAIL = "oluwaseunabidemi57@gmail.com";
const ADMIN_PIN = "2505";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // 🔐 Listen for auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // 📦 Fetch orders
  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(data);
  };

  useEffect(() => {
    if (user && pinVerified) {
      fetchOrders();
    }
  }, [user, pinVerified]);

  // 🔑 Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid login details");
    }
  };

  // 🔐 PIN check
  const verifyPin = () => {
    if (pin === ADMIN_PIN) {
      setPinVerified(true);
    } else {
      setError("Incorrect admin PIN");
    }
  };

  // 🔄 Update order status
  const updateStatus = async (orderId, status) => {
    const ref = doc(db, "orders", orderId);
    await updateDoc(ref, { status });
    fetchOrders();
  };

  // 🚪 Logout
  const logout = async () => {
    await signOut(auth);
    setPinVerified(false);
    setPin("");
  };

  // ❌ Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Admin Login
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <input
            type="email"
            placeholder="Admin email"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-black text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  // 🔐 PIN screen
  if (!pinVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-center">
            Enter Admin PIN
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <input
            type="password"
            placeholder="Admin PIN"
            className="w-full border p-2 mb-4 rounded"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <button
            onClick={verifyPin}
            className="w-full bg-black text-white py-2 rounded"
          >
            Verify PIN
          </button>

          <button
            onClick={logout}
            className="w-full mt-4 text-sm text-gray-500"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ✅ ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="text-sm text-red-600"
        >
          Logout
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded shadow"
            >
              <p className="font-semibold">
                Order ID: {order.id}
              </p>
              <p>Email: {order.email}</p>
              <p>Total: ₦{order.total}</p>
              <p>Status: {order.status}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() =>
                    updateStatus(order.id, "Processing")
                  }
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                >
                  Processing
                </button>

                <button
                  onClick={() =>
                    updateStatus(order.id, "Completed")
                  }
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}