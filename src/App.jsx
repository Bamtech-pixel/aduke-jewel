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
const THEME_KEY = "aduke_theme_v1";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "dark";
    } catch {
      return "dark";
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
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const addToCart = (p) => setCart((prev) => [...prev, p]);
  const cartCount = useMemo(() => cart.length, [cart]);

  return (
    <Shell
      cartCount={cartCount}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      theme={theme}
      setTheme={setTheme}
    >
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/bracelets"
          element={<Bracelets addToCart={addToCart} />}
        />
        <Route
          path="/necklaces"
          element={<Necklaces addToCart={addToCart} />}
        />
        <Route path="/watches" element={<Watches addToCart={addToCart} />} />
        <Route path="/sets" element={<Sets addToCart={addToCart} />} />

        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

        <Route path="/login" element={<Auth onLogin={setCurrentUser} />} />

        <Route
          path="/profile"
          element={
            <Profile currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
          }
        />

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Shell>
  );
}

function Shell({
  children,
  cartCount,
  currentUser,
  setCurrentUser,
  theme,
  setTheme,
}) {
  const navigate = useNavigate();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const logout = () => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(null));
    } catch {}
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      {/* NAVBAR */}
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
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
            <Link to="/bracelets" className="hover:text-[#d6b37c] transition">
              Bracelets
            </Link>
            <Link to="/necklaces" className="hover:text-[#d6b37c] transition">
              Necklaces
            </Link>
            <Link to="/watches" className="hover:text-[#d6b37c] transition">
              Watches
            </Link>
            <Link to="/sets" className="hover:text-[#d6b37c] transition">
              Sets
            </Link>

            <Link to="/cart" className="hover:text-[#d6b37c] transition">
              Cart <span className="text-gray-400">({cartCount})</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="px-3 py-2 border border-black/10 dark:border-white/20 rounded hover:bg-black/5 dark:hover:bg-white/10 transition"
              title="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 border border-black/10 dark:border-white/20 rounded hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="px-4 py-2 border border-black/10 dark:border-white/20 rounded hover:bg-white hover:text-black transition"
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
          © {new Date().getFullYear()} Aduke_Jewels · WhatsApp 09019027395 ·
          Email damilola1902@gmail.com
        </div>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28 text-center">
      <h2 className="text-4xl md:text-5xl font-semibold mb-6">
        Jewelry For Every Journey
      </h2>

      <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
        Personalized bracelets, necklaces, watches, and engraved pieces crafted
        to hold memories, meaning, and elegance.
      </p>

      <Link
        to="/bracelets"
        className="px-12 py-3 bg-white text-black rounded hover:bg-[#d6b37c] transition"
      >
        Shop Now
      </Link>

      <div className="mt-16 flex justify-center">
        <div className="h-[2px] w-24 bg-[#d6b37c]" />
      </div>
    </section>
  );
}

function MiniWatchIcon() {
  return (
    <span className="w-9 h-9 flex items-center justify-center rounded-full border border-black/10 dark:border-white/20">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="6.5" stroke="#d6b37c" strokeWidth="1.6" />
        <path
          d="M12 9v3l2 1"
          stroke="#d6b37c"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}