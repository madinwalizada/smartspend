import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <Routes>
      <Route
        path="/login"
        element={!session ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/*"
        element={session ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
