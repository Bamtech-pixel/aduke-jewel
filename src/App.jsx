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
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";

const CART_KEY = "aduke_cart_v1";
const CURRENT_USER_KEY = "aduke_current_user_v1";
const THEME_KEY = "aduke_theme_v1"; // "light" | "dark"

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

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch {
      return "light";
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

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    // apply to document for consistent styling
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const addToCart = (product) =>
    setCart((prev) => [...prev, { ...product, qty: product.qty || 1 }]);

  const cartCount = useMemo(() => cart.length, [cart]);

  return (
    <Shell
      cartCount={cartCount}
      currentUser={currentUser}
      onLogout={() => setCurrentUser(null)}
      theme={theme}
      setTheme={setTheme}
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

        {/* Website checkout flow */}
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track" element={<TrackOrder />} />
      </Routes>
    </Shell>
  );
}

function Shell({ children, cartCount, currentUser, onLogout, theme, setTheme }) {
  const navigate = useNavigate();

  const logout = () => {
    onLogout?.();
    navigate("/");
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen bg-[#fbf7f0] text-gray-900 dark:bg-[#0b0b0c] dark:text-gray-100">
      {/* NAVBAR */}
      <header className="border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            {/* subtle "watch dot" */}
            <span className="w-2.5 h-2.5 rounded-full bg-champagne-500 shadow-sm" />
            <h1 className="text-2xl font-semibold tracking-wide">
              Aduke<span className="text-gray-500 dark:text-gray-400">_Jewels</span>
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link className="hover:text-champagne-700" to="/bracelets">
              Bracelets
            </Link>
            <Link className="hover:text-champagne-700" to="/necklaces">
              Necklaces
            </Link>
            <Link className="hover:text-champagne-700" to="/watches">
              Watches
            </Link>
            <Link className="hover:text-champagne-700" to="/sets">
              Sets
            </Link>

            <Link to="/cart" className="font-semibold hover:text-champagne-700">
              Cart <span className="text-gray-500 dark:text-gray-400">({cartCount})</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              title="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg border border-champagne-500 text-champagne-800 dark:text-champagne-200 hover:bg-champagne-500 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-champagne-500 text-champagne-800 dark:text-champagne-200 hover:bg-champagne-500 hover:text-white transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile quick actions */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <Link
              to="/cart"
              className="px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg"
            >
              🛒 {cartCount}
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            Aduke_Jewels
          </p>
          <p className="mt-2">
            WhatsApp: <span className="font-medium">09019027395</span> · Email:{" "}
            <span className="font-medium">damilola1902@gmail.com</span>
          </p>
          <p className="mt-4 text-xs">
            © {new Date().getFullYear()} Aduke_Jewels. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 text-center">
      <p className="text-sm tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400">
        Unisex · Engraving · Memory Barcode
      </p>

      <h2 className="mt-5 text-4xl md:text-6xl font-semibold leading-tight">
        Jewelry For Every Journey
      </h2>

      <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Personalized bracelets, necklaces, watches, and engraved pieces crafted
        to hold memories, meaning, and elegance — with optional Memory Barcode
        engraving that can open your picture or text.
      </p>

      <div className="mt-10 flex justify-center gap-4 flex-wrap">
        <Link
          to="/bracelets"
          className="px-10 py-3 rounded-lg bg-black text-white hover:opacity-90"
        >
          Shop Bracelets
        </Link>
        <Link
          to="/watches"
          className="px-10 py-3 rounded-lg border border-champagne-500 text-champagne-800 dark:text-champagne-200 hover:bg-champagne-500 hover:text-white transition"
        >
          Shop Watches
        </Link>
        <Link
          to="/track"
          className="px-10 py-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
        >
          Track Order
        </Link>
      </div>

      {/* Category preview cards */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-left">
        {[
          { title: "Bracelets", to: "/bracelets" },
          { title: "Necklaces", to: "/necklaces" },
          { title: "Watches", to: "/watches" },
          { title: "Sets & Combos", to: "/sets" },
        ].map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="group border border-black/10 dark:border-white/10 rounded-2xl p-6 bg-white/70 dark:bg-white/5 backdrop-blur hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{c.title}</p>
              <span className="text-champagne-600 group-hover:text-champagne-800 transition">
                →
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Explore premium engraved pieces with clean, luxury finishing.
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}