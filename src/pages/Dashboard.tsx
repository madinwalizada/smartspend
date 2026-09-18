import { useState } from "react";
import { supabase } from "../supabase";
import Expenses from "./Expenses";
import Budget from "./Budget";
import { Routes, Route, useNavigate } from "react-router-dom";

function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "expenses", label: "Expenses", icon: "🧾" },
    { id: "budget", label: "Budget", icon: "💰" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-6 px-3 fixed top-0 left-0 bottom-0">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            S
          </div>
          <span className="font-semibold text-gray-900">SmartSpend</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full
                ${
                  active === item.id
                    ? "bg-green-50 text-green-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-52 flex-1 p-8">
        {active === "dashboard" && (
          <div className="text-gray-900 font-semibold text-xl">
            Dashboard — coming soon
          </div>
        )}
        {active === "expenses" && (
          <div className="text-gray-900 font-semibold text-xl">
            {active === "expenses" && <Expenses />}
          </div>
        )}
        {active === "budget" && (
          <div className="text-gray-900 font-semibold text-xl">
            {active === "budget" && <Budget />}
          </div>
        )}
        {active === "analytics" && (
          <div className="text-gray-900 font-semibold text-xl">
            Analytics — coming soon
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
