import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../../components/ui/Badge";

const ORDERS = [
  {
    id: 1024,
    customer: "Test Customer",
    phone: "012345678",
    location: "123 Main St",
    status: "pending",
    total: 11.0,
    items: 3,
    time: "2026-04-13 10:00",
  },
  {
    id: 1023,
    customer: "Sokha Chan",
    phone: "011222333",
    location: "456 River Rd",
    status: "confirmed",
    total: 7.5,
    items: 2,
    time: "2026-04-13 09:45",
  },
  {
    id: 1022,
    customer: "Dara Pich",
    phone: "015666777",
    location: "789 Lake Ave",
    status: "delivering",
    total: 5.0,
    items: 1,
    time: "2026-04-13 09:00",
  },
  {
    id: 1021,
    customer: "Maly Keo",
    phone: "016888999",
    location: "321 Hill Rd",
    status: "delivered",
    total: 3.0,
    items: 1,
    time: "2026-04-13 08:30",
  },
  {
    id: 1020,
    customer: "Piseth Rith",
    phone: "017111222",
    location: "654 Park Ln",
    status: "rejected",
    total: 8.5,
    items: 2,
    time: "2026-04-13 08:00",
  },
  {
    id: 1019,
    customer: "Channary Sok",
    phone: "018333444",
    location: "987 Rose St",
    status: "delivered",
    total: 6.5,
    items: 2,
    time: "2026-04-12 17:00",
  },
];

const FILTERS = [
  "all",
  "pending",
  "confirmed",
  "delivering",
  "delivered",
  "rejected",
];

export default function Orders() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = ORDERS.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5
            text-sm outline-none focus:border-blue-400 transition-colors"
        />
        <button
          onClick={() => {
            setFilter("all");
            setSearch("");
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm
            text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          Clear
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs
              font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            {f}
            {f !== "all" && (
              <span className="ml-1 opacity-70">
                {ORDERS.filter((o) => o.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table — desktop */}
      <div
        className="hidden md:block bg-white border border-gray-100
        rounded-xl overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Order",
                "Customer",
                "Items",
                "Total",
                "Status",
                "Time",
                "",
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
            {filtered.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-gray-900">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.phone}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
                  {order.items} items
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-5 py-3.5">
                  <Badge status={order.status} />
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-400">
                  {order.time}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-xs text-blue-600">View →</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No orders found
          </div>
        )}
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="bg-white border border-gray-100 rounded-xl p-4
              cursor-pointer active:bg-gray-50"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  #{order.id} · {order.customer}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{order.time}</p>
              </div>
              <Badge status={order.status} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{order.items} items</p>
              <p className="text-sm font-medium text-gray-900">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
