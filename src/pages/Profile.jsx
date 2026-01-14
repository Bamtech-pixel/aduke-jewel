import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);

    try {
      localStorage.setItem("aduke_current_user_v1", JSON.stringify(null));
    } catch {}

    onLogout?.();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold mb-3">Profile</h2>
        <p className="text-gray-600">
          You’re not logged in.{" "}
          <Link to="/login" className="underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    );
  }

  const isAdmin = (user.email || "").toLowerCase() === "oluwaseunabidemi57@gmail.com";

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-semibold mb-3">Your Profile</h2>
      <p className="text-gray-700">
        Logged in as: <b>{user.email}</b>
      </p>

      {isAdmin ? (
        <p className="mt-4">
          <Link to="/admin" className="underline font-semibold">
            Go to Admin Dashboard →
          </Link>
        </p>
      ) : null}

      <button
        onClick={logout}
        className="mt-8 px-5 py-3 border rounded-lg hover:bg-gray-50"
      >
        Logout
      </button>
    </div>
  );
}
