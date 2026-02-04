import { useState } from "react";
import { loginUser, registerUser } from "../auth";

function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      if (isRegister) {
        await registerUser(email, password);
      }
      await loginUser(email, password);
      onAuth();
    } catch (err) {
      setError(err.message || "Auth failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-slate-800 p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isRegister ? "Create account" : "Login"}
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-2">{error}</p>
        )}

        <input
          className="w-full mb-2 p-2 rounded bg-slate-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 rounded bg-slate-700"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          {isRegister ? "Sign up" : "Login"}
        </button>

        <p
          className="text-sm text-center mt-4 cursor-pointer text-blue-400"
          onClick={() => setIsRegister((p) => !p)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "No account? Sign up"}
        </p>
      </div>
    </div>
  );
}

export default Auth;
