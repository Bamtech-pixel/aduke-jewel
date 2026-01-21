// src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Auth({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Return user to the page they wanted before login
  const from =
    (location.state && typeof location.state.from === "string" && location.state.from) ||
    "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userCred;
      if (mode === "login") {
        userCred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } else {
        userCred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      onLogin?.({
        uid: userCred.user.uid,
        email: userCred.user.email,
      });

      // ✅ Go back to the page user came from (checkout/profile/admin/etc.)
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-black/10 dark:border-white/10 rounded-2xl p-8 bg-white dark:bg-black">
        <h2 className="text-2xl font-semibold mb-2">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {mode === "login"
            ? "Login to continue"
            : "Sign up to track orders and checkout faster"}
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-4 py-3
                       bg-white text-black placeholder:text-gray-500
                       dark:bg-white dark:text-black dark:placeholder:text-gray-500"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-4 py-3
                       bg-white text-black placeholder:text-gray-500
                       dark:bg-white dark:text-black dark:placeholder:text-gray-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white
                       hover:opacity-90 transition disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-500">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-medium text-black dark:text-white underline"
                type="button"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-medium text-black dark:text-white underline"
                type="button"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}