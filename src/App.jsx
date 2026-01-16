import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

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

  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "dark"
  );

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

  const addToCart = (product) =>
    setCart((prev) => [...prev, product]);

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
            <Checkout
              cart={cart}
              setCart={setCart}
              currentUser={currentUser}
            />
          }
        />

        <Route
          path="/order-success/:orderId"
          element={<OrderSuccess />}
        />

        <Route path="/login" element={<Auth onLogin={setCurrentUser} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Shell>
  );
}

/* =========================
   SHELL (NAV + FOOTER)
   ========================= */

function Shell({ children, cartCount, currentUser, onLogout, theme, setTheme }) {
  const navigate = useNavigate();
  const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="font-semibold text-lg">
            Aduke<span className="text-gray-500">_Jewels</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link to="/bracelets">Bracelets</Link>
            <Link to="/necklaces">Necklaces</Link>
            <Link to="/watches">Watches</Link>
            <Link to="/sets">Sets</Link>

            <Link to="/cart">
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
              <button
                onClick={() => {
                  onLogout();
                  navigate("/");
                }}
                className="px-3 py-1 border rounded"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="px-3 py-1 border rounded">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-black/10 dark:border-white/10 py-8 mt-16 text-center text-sm text-gray-500">
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
    <section className="max-w-6xl mx-auto px-6 py-24 text-center">
      <h2 className="text-4xl md:text-5xl font-semibold mb-6">
        Jewelry For Every Journey
      </h2>

      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
        Personalized bracelets, necklaces, watches, and engraved pieces
        crafted to hold memories, meaning, and elegance.
      </p>

      <Link
        to="/bracelets"
        className="px-10 py-3 bg-black text-white rounded hover:opacity-90"
      >
        Shop Now
      </Link>
    </section>
  );
}