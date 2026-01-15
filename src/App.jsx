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
      const saved = localStorage.getItem(THEME_KEY);
      return saved === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  // persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // persist user
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  // apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement; // <html>
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const addToCart = (product) => setCart((prev) => [...prev, product]);
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
      </Routes>
    </Shell>
  );
}

function Shell({ children, cartCount, currentUser, onLogout, theme, setTheme }) {
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(null));
    } catch {}
    onLogout?.();
    navigate("/");
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans dark:bg-[#0b0b0d] dark:text-gray-100">
      {/* NAVBAR */}
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          {/* Logo + mini watch icon + champagne accent */}
          <Link to="/" className="flex items-center gap-3 group">
            <MiniWatchIcon />
            <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
              <span className="relative">
                Aduke
                <span className="absolute -top-2 -right-3 w-2 h-2 rounded-full bg-[#d6b37c] animate-pulse" />
              </span>
              <span className="text-gray-500 dark:text-gray-400">_Jewels</span>
            </h1>
          </Link>

          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link className="hover:text-black dark:hover:text-white" to="/bracelets">
              Bracelets
            </Link>
            <Link className="hover:text-black dark:hover:text-white" to="/necklaces">
              Necklaces
            </Link>
            <Link className="hover:text-black dark:hover:text-white" to="/watches">
              Watches
            </Link>
            <Link className="hover:text-black dark:hover:text-white" to="/sets">
              Sets
            </Link>

            <Link to="/cart" className="font-semibold hover:text-black dark:hover:text-white">
              Cart <span className="text-gray-500 dark:text-gray-400">({cartCount})</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 border border-black/15 dark:border-white/15 rounded hover:bg-black/5 dark:hover:bg-white/10 transition"
              title="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {/* Admin link (you can hide later) */}
            <Link
              to="/admin"
              className="px-3 py-2 border border-black/15 dark:border-white/15 rounded hover:bg-black/5 dark:hover:bg-white/10 transition"
              title="Admin"
            >
              Admin
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 border border-black/15 dark:border-white/15 rounded hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-black/15 dark:border-white/15 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
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
      <footer className="border-t border-black/10 dark:border-white/10 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500 dark:text-gray-400">
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

      <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
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
          className="px-10 py-3 border border-black/15 dark:border-white/15 rounded transition hover:bg-black/5 dark:hover:bg-white/10"
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

/**
 * Mini Watch Icon (original, simple, luxury)
 * - NOT a Cartier copy
 * - Works in light/dark
 */
function MiniWatchIcon() {
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-black/15 dark:border-white/15 group-hover:border-[#d6b37c]/70 transition">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="text-[#d6b37c]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* strap top */}
        <path
          d="M9 2.8c0-.44.36-.8.8-.8h4.4c.44 0 .8.36.8.8V5H9V2.8Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* strap bottom */}
        <path
          d="M9 21.2c0 .44.36.8.8.8h4.4c.44 0 .8-.36.8-.8V19H9v2.2Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* watch face */}
        <path
          d="M12 19a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        {/* hands */}
        <path
          d="M12 9.2v3.3l2.2 1.3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}