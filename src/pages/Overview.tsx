import { useState, useEffect } from "react";
import { supabase } from "../supabase";

interface Expense {
  amount: number;
  category: string;
  date: string;
}

interface Budget {
  category: string;
  limit_amount: number;
}

function Overview() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const [{ data: expenseData }, { data: budgetData }] = await Promise.all([
      supabase.from("expenses").select("*").gte("date", firstDay),
      supabase.from("budgets").select("*"),
    ]);

    if (expenseData) setExpenses(expenseData);
    if (budgetData) setBudgets(budgetData);
    setLoading(false);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit_amount, 0);
  const remaining = totalBudget - totalSpent;

  const spentByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const biggestCategory = Object.entries(spentByCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Total spent
          </div>
          <div className="text-2xl font-semibold text-gray-900">
            ${totalSpent.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">this month</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Remaining
          </div>
          <div
            className={`text-2xl font-semibold ${
              remaining < 0 ? "text-red-500" : "text-green-600"
            }`}
          >
            ${remaining.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            of ${totalBudget} budget
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Biggest spend
          </div>
          <div className="text-2xl font-semibold text-gray-900">
            {biggestCategory ? biggestCategory[0] : "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {biggestCategory
              ? `$${biggestCategory[1].toFixed(2)}`
              : "No expenses yet"}
          </div>
        </div>
      </div>

      {/* Budget progress */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-medium text-gray-900 mb-4">Budget by category</h2>
        {budgets.length === 0 ? (
          <div className="text-sm text-gray-400">No budgets set yet.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {budgets.map((budget) => {
              const spent = spentByCategory[budget.category] || 0;
              const percent = Math.min(
                (spent / budget.limit_amount) * 100,
                100
              );
              const over = spent > budget.limit_amount;

              return (
                <div key={budget.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">
                      {budget.category}
                    </span>
                    <span className={over ? "text-red-500" : "text-gray-400"}>
                      ${spent.toFixed(2)} / ${budget.limit_amount}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        over
                          ? "bg-red-500"
                          : percent > 80
                          ? "bg-amber-400"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Overview;
