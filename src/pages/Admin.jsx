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

const STATUSES = [
  "Pending",            // awaiting payment proof
  "Confirmed",          // payment confirmed
  "Processing",         // engraving/customization ongoing
  "Ready for Pickup",   // for pickup orders
  "Out for Delivery",   // for delivery orders
  "Delivered",          // delivered
  "Completed",          // closed/finished
];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 🔐 auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // ✅ Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      // newest first if createdAt exists
      data.sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });

      setOrders(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && pinVerified) fetchOrders();
  }, [user, pinVerified]);

  // 🔑 Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // extra guard (optional)
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setError("Only the admin email can login here.");
        return;
      }

      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      console.error(err);
      setError("Invalid login details.");
    }
  };

  // 🔐 PIN verify
  const verifyPin = () => {
    setError("");
    if (pin === ADMIN_PIN) setPinVerified(true);
    else setError("Incorrect admin PIN.");
  };

  // 🔄 Update status in BOTH orders + orderPublic
  const updateStatus = async (orderId, nextStatus, deliveryType) => {
    setError("");
    try {
      // Update private order doc
      await updateDoc(doc(db, "orders", orderId), {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });

      // Update public tracking doc
      await updateDoc(doc(db, "orderPublic", orderId), {
        status: nextStatus,
        deliveryType: deliveryType || "",
        updatedAt: new Date().toISOString(),
      });

      await fetchOrders();
    } catch (e) {
      console.error(e);
      setError("Failed to update order status. Check Firestore rules.");
    }
  };

  // 🚪 Logout
  const logout = async () => {
    await signOut(auth);
    setPinVerified(false);
    setPin("");
  };

  // -------- UI STATES --------

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow w-full max-w-sm"
        >
          <h