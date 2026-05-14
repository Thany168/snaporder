import { useState } from "react";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

const PAYMENTS = [
  {
    id: 1,
    order_id: 1024,
    customer: "Test Customer",
    amount: 11.0,
    status: "pending",
    date: "2026-04-13 10:00",
    screenshot: null,
  },
  {
    id: 2,
    order_id: 1023,
    customer: "Sokha Chan",
    amount: 7.5,
    status: "verified",
    date: "2026-04-13 09:45",
    screenshot: null,
  },
  {
    id: 3,
    order_id: 1022,
    customer: "Dara Pich",
    amount: 5.0,
    status: "verified",
    date: "2026-04-13 09:00",
    screenshot: null,
  },
  {
    id: 4,
    order_id: 1021,
    customer: "Maly Keo",
    amount: 3.0,
    status: "rejected",
    date: "2026-04-13 08:30",
    screenshot: null,
  },
];

const FILTERS = ["all", "pending", "verified", "rejected"];

export default function Payments() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = PAYMENTS.filter(
    (p) => filter === "all" || p.status === filter,
  );

  const counts = {
    pending: PAYMENTS.filter((p) => p.status === "pending").length,
    verified: PAYMENTS.filter((p) => p.status === "verified").length,
    rejected: PAYMENTS.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Pending",
            count: counts.pending,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            label: "Verified",
            count: counts.verified,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Rejected",
            count: counts.rejected,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border border-transparent rounded-xl p-4
              text-center cursor-pointer`}
            onClick={() => setFilter(s.label.toLowerCase())}
          >
            <p className={`text-2xl font-semibold ${s.color}`}>{s.count}</p>
            <p className={`text-xs ${s.color} opacity-80 mt-0.5`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium
              capitalize transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Order",
                "Customer",
                "Amount",
                "Status",
                "Date",
                "Screenshot",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-medium
                  text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                  #{p.order_id}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-700">
                  {p.customer}
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                  ${p.amount.toFixed(2)}
                </td>
                <td className="px-5 py-3.5">
                  <Badge status={p.status} />
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{p.date}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => setSelected(p)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {p.screenshot ? "View" : "No file"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Screenshot Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Payment — Order #${selected?.order_id}`}
        footer={
          <Button variant="outline" onClick={() => setSelected(null)}>
            Close
          </Button>
        }
      >
        {selected?.screenshot ? (
          <img
            src={selected.screenshot}
            alt="Payment"
            className="w-full rounded-xl"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center py-10
            bg-gray-50 rounded-xl"
          >
            <p className="text-3xl mb-2">🧾</p>
            <p className="text-sm text-gray-400">No screenshot uploaded</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
