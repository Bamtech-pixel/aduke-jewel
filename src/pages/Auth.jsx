import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Auth({ onLogin }) {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      onLogin?.(res.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h2 className="text-3xl font-semibold mb-6">
        {isSignup ? "Create Account" : "Login"}
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-4 py-3"
        />

        <input
          type="password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-4 py-3"
        />

        {error && (
          <div className="text-sm text-red-600 border border-red-200 p-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full px-5 py-3 bg-black text-white rounded hover:opacity-90"
        >
          {isSignup ? "Sign up" : "Login"}
        </button>
      </form>

      <div className="mt-6 text-sm text-center">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setIsSignup(false)}
              className="underline"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button
              onClick={() => setIsSignup(true)}
              className="underline"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}