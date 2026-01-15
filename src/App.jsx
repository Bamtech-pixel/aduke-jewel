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
      {/* Inline “safe” styles for subtle animation + champagne glow */}
      <style>{`
        @keyframes adukeFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes adukeGlow {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(214,179,124,0)); }
          50% { filter: drop-shadow(0 10px 22px rgba(214,179,124,0.22)); }
        }
      `}</style>

      <header className="border-b bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            {/* “Cartier panther vibe” alternative: a tiny watch mark that gently glows */}
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border"
              style={{ borderColor: "#e8d6b8" }}
              title="Aduke_Jewels"
            >
              <WatchMark />
            </span>

            <h1 className="text-2xl font-semibold tracking-wide">
              Aduke<span className="text-gray-500">_Jewels</span>
            </h1>

            {/* Champagne accent underline */}
            <span
              className="hidden sm:inline-block h-[2px] w-10 rounded-full"
              style={{ background: "#d6b37c" }}
            />
          </Link>

          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link className="hover:opacity-80" to="/bracelets">Bracelets</Link>
            <Link className="hover:opacity-80" to="/necklaces">Necklaces</Link>
            <Link className="hover:opacity-80" to="/watches">Watches</Link>
            <Link className="hover:opacity-80" to="/sets">Sets</Link>

            <Link to="/cart" className="font-semibold hover:opacity-80">
              Cart <span className="text-gray-500">({cartCount})</span>
            </Link>

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
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border rounded transition"
                style={{
                  borderColor: "#d6b37c",
                  color: "#111827",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d6b37c";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#111827";
                }}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t py-10 mt-20">
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
    <main className="relative overflow-hidden">
      {/* Soft champagne glow background (safe, no dependencies) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 400px at 50% 0%, rgba(214,179,124,0.22), rgba(255,255,255,0) 60%), linear-gradient(#ffffff, #ffffff)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Top micro badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white/70 backdrop-blur"
          style={{ borderColor: "#e8d6b8", animation: "adukeFadeUp 700ms ease both" }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: "#d6b37c" }}
          />
          <span className="text-xs tracking-wide text-gray-700">
            Engrave memories • Barcode jewelry • Unisex
          </span>
        </div>

        <h2
          className="mt-8 text-4xl md:text-6xl font-semibold"
          style={{ animation: "adukeFadeUp 900ms ease 120ms both" }}
        >
          Jewelry For Every Journey
        </h2>

        <p
          className="mt-6 text-gray-600 max-w-2xl mx-auto"
          style={{ animation: "adukeFadeUp 900ms ease 220ms both" }}
        >
          Personalized bracelets, necklaces, watches, and engraved pieces crafted
          to hold memories, meaning, and elegance.
        </p>

        <div
          className="mt-10 flex justify-center gap-4 flex-wrap"
          style={{ animation: "adukeFadeUp 900ms ease 320ms both" }}
        >
          <Link
            to="/bracelets"
            className="px-10 py-3 rounded text-white hover:opacity-95"
            style={{ background: "#111827" }}
          >
            Shop Now
          </Link>

          <a
            href="https://wa.me/2349019027395?text=Hi%20Aduke_Jewels%2C%20I%20want%20to%20customize%20a%20jewelry%20piece."
            target="_blank"
            rel="noreferrer"
            className="px-10 py-3 rounded border hover:bg-white"
            style={{ borderColor: "#d6b37c" }}
          >
            Customize Jewelry
          </a>
        </div>

        {/* “Luxury card row” like clean brand feel */}
        <div
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
          style={{ animation: "adukeFadeUp 900ms ease 420ms both" }}
        >
          <FeatureCard
            title="Barcode Jewelry"
            desc="Link your piece to a memory: a photo, message, or page."
          />
          <FeatureCard
            title="Pickup or Delivery"
            desc="Choose what’s easiest. Track your order status after checkout."
          />
          <FeatureCard
            title="Clean Finishing"
            desc="Engraving designed to last — smooth edges and premium feel."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div
      className="border rounded-xl p-5 bg-white/80 backdrop-blur"
      style={{ borderColor: "#efe2cc" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: "#d6b37c" }}
        />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function WatchMark() {
  // tiny watch icon (SVG) — safe & lightweight
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "adukeGlow 2.8s ease-in-out infinite" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 4.5h6M9 19.5h6"
        stroke="#d6b37c"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="7"
        y="6.5"
        width="10"
        height="11"
        rx="3"
        stroke="#111827"
        strokeWidth="1.6"
      />
      <path
        d="M12 10v3l2 1"
        stroke="#111827"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}