import { useState } from "react";
import { supabase } from "../supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setError("Check your email to confirm your account");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          SmartSpend
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Track your spending with AI insights
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
