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

interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
}

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (data) setExpenses(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!amount) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("expenses").insert({
      user_id: user?.id,
      amount: parseFloat(amount),
      category,
      note,
      date,
    });

    setAmount("");
    setNote("");
    setShowForm(false);
    setSaving(false);
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("expenses").delete().eq("id", id);
    fetchExpenses();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Expenses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          + Add expense
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-medium text-gray-900 mb-4">New expense</h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
            />
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
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Expenses list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No expenses yet. Add your first one.
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {expense.category}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {expense.note || "—"} · {expense.date}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-900">
                  ${expense.amount}
                </span>
                <button
                  onClick={() => handleDelete(expense.id)}
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

export default Expenses;
