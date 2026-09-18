import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const CATEGORIES = [
  "Groceries",
  "Dining out",
  "Transport",
  "Shopping",
  "Subscriptions",
  "Health",
  "Entertainment",
  "Other",
];

interface Budget {
  id: string;
  category: string;
  limit_amount: number;
}

function Budget() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Groceries");
  const [limit, setLimit] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const { data } = await supabase
      .from("budgets")
      .select("*")
      .order("category");
    if (data) setBudgets(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!limit) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if budget for this category already exists
    const existing = budgets.find((b) => b.category === category);

    if (existing) {
      await supabase
        .from("budgets")
        .update({ limit_amount: parseFloat(limit) })
        .eq("id", existing.id);
    } else {
      await supabase.from("budgets").insert({
        user_id: user?.id,
        category,
        limit_amount: parseFloat(limit),
      });
    }

    setLimit("");
    setSaving(false);
    fetchBudgets();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("budgets").delete().eq("id", id);
    fetchBudgets();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Budget</h1>

      {/* Add/update form */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
        <h2 className="font-medium text-gray-900 mb-4">Set budget limit</h2>
        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Monthly limit ($)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 w-48"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Budget list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {budgets.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No budgets set yet.
          </div>
        ) : (
          budgets.map((budget) => (
            <div
              key={budget.id}
              className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0"
            >
              <div className="text-sm font-medium text-gray-900">
                {budget.category}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-900">
                  ${budget.limit_amount}/mo
                </span>
                <button
                  onClick={() => handleDelete(budget.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Budget;
