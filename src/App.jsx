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

  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "dark" // luxury default
  );

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    const html = document.documentElement;
    theme === "dark"
      ? html.classList.add("dark")
      : html.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const addToCart = (p) => setCart((prev) => [...prev, p]);
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
        <Route path="/login" element={<Auth onLogin={setCurrentUser} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Shell>
  );
}

function Shell({ children, cartCount, currentUser, onLogout, theme, setTheme }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const logout = () => {
    onLogout?.();
    navigate("/");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-black/70 border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3" onClick={closeMobile}>
            <MiniWatchIcon />
            <div className="leading-tight">
              <div className="text-lg sm:text-xl font-semibold tracking-wide flex items-center gap-2">
                <span className="relative">
                  Aduke
                  <span className="absolute -top-2 -right-3 w-2 h-2 rounded-full bg-[#d6b37c] animate-pulse" />
                </span>
                <span className="text-gray-500 dark:text-gray-400">_Jewels</span>
              </div>
              <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                True black luxury ✦ champagne gold
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link to="/bracelets">Bracelets</Link>
            <Link to="/necklaces">Necklaces</Link>
            <Link to="/watches">Watches</Link>
            <Link to="/sets">Sets</Link>

            <Link
              to="/cart"
              className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              Cart <span className="text-gray-500 dark:text-gray-400">({cartCount})</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
              type="button"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-lg border border-[#d6b37c] text-[#8b6b2e] dark:text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-black transition"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg border border-[#d6b37c] text-[#8b6b2e] dark:text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-black transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/cart"
              className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10"
              onClick={closeMobile}
            >
              <span className="text-sm font-semibold">Cart</span>{" "}
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({cartCount})
              </span>
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10"
              type="button"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-black/10 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3 text-sm font-medium">
              <Link to="/bracelets" onClick={closeMobile} className="py-2">
                Bracelets
              </Link>
              <Link to="/necklaces" onClick={closeMobile} className="py-2">
                Necklaces
              </Link>
              <Link to="/watches" onClick={closeMobile} className="py-2">
                Watches
              </Link>
              <Link to="/sets" onClick={closeMobile} className="py-2">
                Sets
              </Link>

              <div className="h-px bg-black/10 dark:bg-white/10 my-2" />

              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10"
                type="button"
              >
                Switch to {theme === "dark" ? "Light" : "Dark"} Theme
              </button>

              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMobile}
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      closeMobile();
                      logout();
                    }}
                    className="px-4 py-3 rounded-xl border border-[#d6b37c] text-[#8b6b2e] dark:text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-black transition"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="px-4 py-3 rounded-xl border border-[#d6b37c] text-[#8b6b2e] dark:text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-black transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Page body */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer className="border-t border-black/10 dark:border-white/10 py-10 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Aduke_Jewels · WhatsApp 09019027395 · Email
          damilola1902@gmail.com
        </div>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full border border-[#d6b37c]/50 text-[#8b6b2e] dark:text-[#f2e3c6] bg-[#d6b37c]/10">
          ✦ Personalized engraving available
        </p>

        <h2 className="mt-6 text-3xl sm:text-5xl font-semibold leading-tight">
          Jewelry For Every Journey
        </h2>

        <p className="mt-5 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Personalized bracelets, necklaces, watches, and engraved pieces crafted
          to hold memories, meaning, and elegance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/bracelets"
            className="px-10 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
          >
            Shop Now
          </Link>
          <Link
            to="/cart"
            className="px-10 py-3 rounded-xl border border-[#d6b37c] text-[#8b6b2e] dark:text-[#f2e3c6] hover:bg-[#d6b37c] hover:text-black transition"
          >
            View Cart
          </Link>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="h-[2px] w-20 bg-[#d6b37c]" />
        </div>
      </div>

      {/* Quick category cards */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <Cat to="/bracelets" title="Bracelets" />
        <Cat to="/necklaces" title="Necklaces" />
        <Cat to="/watches" title="Watches" />
        <Cat to="/sets" title="Sets" />
      </div>
    </section>
  );
}

function Cat({ to, title }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-4 sm:p-6 text-center hover:shadow-sm transition"
    >
      <div className="text-xs text-gray-500 dark:text-gray-400">Shop</div>
      <div className="mt-1 font-semibold">{title}</div>
    </Link>
  );
}

function MiniWatchIcon() {
  return (
    <span className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5">
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