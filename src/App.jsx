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

  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  const addToCart = (product) => setCart((prev) => [...prev, product]);
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
      {/* NAVBAR */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          {/* Logo with champagne accent (luxury vibe) */}
          <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
            <span className="relative">
              Aduke
              <span className="absolute -top-2 -right-3 w-2 h-2 rounded-full bg-[#d6b37c] animate-pulse" />
            </span>
            <span className="text-gray-500">_Jewels</span>
          </h1>

          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link className="hover:text-black" to="/bracelets">
              Bracelets
            </Link>
            <Link className="hover:text-black" to="/necklaces">
              Necklaces
            </Link>
            <Link className="hover:text-black" to="/watches">
              Watches
            </Link>
            <Link className="hover:text-black" to="/sets">
              Sets
            </Link>

            <Link to="/cart" className="font-semibold hover:text-black">
              Cart <span className="text-gray-500">({cartCount})</span>
            </Link>

            {/* Admin link (you can hide later) */}
            <Link
              to="/admin"
              className="px-3 py-2 border rounded hover:bg-gray-50"
              title="Admin"
            >
              Admin
            </Link>

            {currentUser ? (
              <>
                <Link to="/profile" className="px-4 py-2 border rounded hover:bg-gray-50">
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
                className="px-4 py-2 border border-[#d6b37c] rounded hover:bg-[#d6b37c] hover:text-black transition"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {children}

      {/* FOOTER */}
      <footer className="border-t py-10 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Aduke_Jewels. All rights reserved.</p>
          <p className="mt-2">
            WhatsApp: 09019027395 · Email: damilola1902@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28 text-center animate-fadeIn">
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
          className="px-10 py-3 bg-black text-white rounded transition hover:bg-[#d6b37c] hover:text-black"
        >
          Shop Now
        </Link>

        <Link
          to="/profile"
          className="px-10 py-3 border rounded transition hover:bg-gray-50"
        >
          Track Orders
        </Link>
      </div>

      {/* Subtle champagne divider */}
      <div className="mt-14 flex justify-center">
        <div className="h-[2px] w-24 rounded bg-[#d6b37c]/70" />
      </div>
    </section>
  );
}