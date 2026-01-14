import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Bracelets from "./pages/Bracelets";
import Necklaces from "./pages/Necklaces";
import Watches from "./pages/Watches";
import Sets from "./pages/Sets";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

// ✅ NEW PAGES
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";

const CART_KEY = "aduke_cart_v1";
const CURRENT_USER_KEY = "aduke_current_user_v1";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const clearCart = () => setCart([]);
  const cartCount = useMemo(() => cart.length, [cart]);

  return (
    <Shell
      cartCount={cartCount}
      currentUser={currentUser}
      onLogout={() => setCurrentUser(null)}
    >
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/bracelets" element={<Bracelets addToCart={addToCart} />} />
        <Route path="/necklaces" element={<Necklaces addToCart={addToCart} />} />
        <Route path="/watches" element={<Watches addToCart={addToCart} />} />
        <Route path="/sets" element={<Sets addToCart={addToCart} />} />

        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

        {/* ✅ NEW ROUTES */}
        <Route
          path="/checkout"
          element={<Checkout cartItems={cart} clearCart={clearCart} />}
        />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track" element={<TrackOrder />} />

        <Route path="/login" element={<Auth onLogin={(u) => setCurrentUser(u)} />} />
        <Route path="/profile" element={<Profile onLogout={() => setCurrentUser(null)} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Shell>
  );
}

function Shell({ children, cartCount, currentUser, onLogout }) {
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(null));
    } catch {}
    onLogout?.();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-wide">
            Aduke<span className="text-gray-500">_Jewels</span>
          </h1>

          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link to="/bracelets">Bracelets</Link>
            <Link to="/necklaces">Necklaces</Link>
            <Link to="/watches">Watches</Link>
            <Link to="/sets">Sets</Link>

            <Link to="/cart" className="font-semibold">
              Cart <span className="text-gray-500">({cartCount})</span>
            </Link>

            {/* Admin Link (hidden in plain sight, you can remove it later) */}
            <Link
              to="/admin"
              className="px-3 py-2 border rounded hover:bg-gray-50"
              title="Admin"
            >
              Admin
            </Link>

            {currentUser ? (
              <>
                <Link to="/profile" className="px-4 py-2 border rounded">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 border rounded hover:bg-black hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border border-[#d6b37c] rounded hover:bg-[#d6b37c] hover:text-white transition"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}

function Home() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h2 className="text-4xl md:text-5xl font-semibold mb-6">
        Jewelry For Every Journey
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        Personalized bracelets, necklaces, watches, and engraved pieces crafted
        to hold memories, meaning, and elegance.
      </p>

      <div className="flex justify-center gap-5">
        <Link
          to="/bracelets"
          className="px-10 py-3 bg-black text-white rounded hover:opacity-90"
        >
          Shop Now
        </Link>

        {/* Optional quick access */}
        <Link
          to="/track"
          className="px-10 py-3 border rounded hover:bg-gray-50"
        >
          Track Order
        </Link>
      </div>
    </section>
  );
}