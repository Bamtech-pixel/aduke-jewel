import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";

import Bracelets from "./pages/Bracelets";
import Necklaces from "./pages/Necklaces";
import Watches from "./pages/Watches";
import Sets from "./pages/Sets";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

const CART_KEY = "aduke_cart_v1";
const CURRENT_USER_KEY = "aduke_current_user_v1";
const THEME_KEY = "aduke_theme_v1";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "dark";
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);
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

        <Route
          path="/checkout"
          element={
            <Checkout cart={cart} setCart={setCart} currentUser={currentUser} />
          }
        />

        {/* ✅ Query-based OrderSuccess (matches your current OrderSuccess.jsx) */}
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/login" element={<Auth onLogin={setCurrentUser} />} />

        {/* ✅ Require login for Profile/Admin pages */}
        <Route
          path="/profile"
          element={currentUser ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={currentUser ? <Admin /> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Shell>
  );
}

/* =========================
   SHELL (NAV + FOOTER)
   ========================= */

function Shell({ children, cartCount, currentUser, onLogout, theme, setTheme }) {
  const navigate = useNavigate();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="font-semibold text-lg">
            Aduke<span className="text-gray-500">_Jewels</span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link to="/bracelets" className="hidden sm:inline">
              Bracelets
            </Link>
            <Link to="/necklaces" className="hidden sm:inline">
              Necklaces
            </Link>
            <Link to="/watches" className="hidden sm:inline">
              Watches
            </Link>
            <Link to="/sets" className="hidden sm:inline">
              Sets
            </Link>

            <Link to="/cart" className="px-3 py-1 border rounded">
              Cart ({cartCount})
            </Link>

            <button
              onClick={toggleTheme}
              className="px-3 py-1 border rounded"
              type="button"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {currentUser ? (
              <>
                <Link to="/profile" className="px-3 py-1 border rounded">
                  Profile
                </Link>
                <Link to="/admin" className="px-3 py-1 border rounded">
                  Admin
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    navigate("/");
                  }}
                  className="px-3 py-1 border rounded"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1 border rounded">
                Login
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile quick links */}
        <div className="sm:hidden border-t border-black/10 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto text-sm">
            <Link
              to="/bracelets"
              className="px-3 py-1 border rounded whitespace-nowrap"
            >
              Bracelets
            </Link>
            <Link
              to="/necklaces"
              className="px-3 py-1 border rounded whitespace-nowrap"
            >
              Necklaces
            </Link>
            <Link
              to="/watches"
              className="px-3 py-1 border rounded whitespace-nowrap"
            >
              Watches
            </Link>
            <Link
              to="/sets"
              className="px-3 py-1 border rounded whitespace-nowrap"
            >
              Sets
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-black/10 dark:border-white/10 py-8 mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Aduke_Jewels · WhatsApp 09019027395
      </footer>
    </div>
  );
}

/* =========================
   HOME
   ========================= */

function Home() {
  return (
    <section className="relative overflow-hidden">
      {/* Dark base + champagne glow + subtle pattern */}
      <div className="absolute inset-0 bg-[#0b0b0c]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#d6b37c]/25 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(#d6b37c_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* Optional hero image (only if it exists) */}
      <div
        className="absolute inset-0 opacity-20 bg-center bg-cover"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        <p className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full border border-[#d6b37c]/50 text-[#f2e3c6] bg-[#d6b37c]/10">
          ✦ Personalized engraving available
        </p>

        <h2 className="mt-6 text-3xl sm:text-5xl font-semibold leading-tight text-white">
          Jewelry For Every Journey
        </h2>

        <p className="mt-5 text-gray-200/80 max-w-2xl mx-auto text-sm sm:text-base">
          Personalized bracelets, necklaces, watches, and engraved pieces crafted
          to hold memories, meaning, and elegance.
        </p>

        {/* BOTH buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/bracelets"
            className="px-10 py-3 rounded-xl bg-white text-black hover:bg-[#d6b37c] transition font-semibold"
          >
            Shop Now
          </Link>

          <Link
            to="/cart"
            className="px-10 py-3 rounded-xl border border-[#d6b37c] text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-black transition font-semibold"
          >
            View Cart
          </Link>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="h-[2px] w-20 bg-[#d6b37c]" />
        </div>
      </div>
    </section>
  );
}