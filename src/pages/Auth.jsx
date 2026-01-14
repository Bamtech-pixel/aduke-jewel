import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      let userCred;

      if (mode === "signup") {
        userCred = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCred = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = {
        uid: userCred.user.uid,
        email: userCred.user.email,
      };

      // keep local app state working
      try {
        localStorage.setItem("aduke_current_user_v1", JSON.stringify(user));
      } catch {}

      onLogin?.(user);

      // ✅ If it's the admin email, go to admin page
      if ((user.email || "").toLowerCase() === "oluwaseunabidemi57@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);

      const msg =
        err?.code === "auth/wrong-password" ? "Wrong password." :
        err?.code === "auth/user-not-found" ? "No account found with this email." :
        err?.code === "auth/email-already-in-use" ? "Email already in use. Try Login." :
        err?.code === "auth/weak-password" ? "Password should be at least 6 characters." :
        "Login failed. Try again.";

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-2">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Use your email & password. (Admin uses the same login.)
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="mt-1 w-full border rounded-lg p-3"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              className="mt-1 w-full border rounded-lg p-3"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-60"
            type="submit"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                className="font-semibold underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="font-semibold underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>

        <p className="mt-8 text-xs text-gray-500">
          If you’re the admin, login with <b>oluwaseunabidemi57@gmail.com</b>,
          then go to <b>/admin</b> and enter PIN <b>2505</b>.
        </p>
      </div>
    </div>
  );
}
