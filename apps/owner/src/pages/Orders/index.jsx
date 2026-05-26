import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import { useOrders } from "../../hooks/useOrders";

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
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const { orders, loading, error, refetch } = useOrders({ filter, search });

  // Debounce: only update `search` on Enter or clear
  const handleSearchKey = (e) => {
    if (e.key === "Enter") setSearch(searchInput);
  };

  const handleClear = () => {
    setFilter("all");
    setSearchInput("");
    setSearch("");
  };

  // Count per status from the current full list (approximation — replace with
  // server-provided counts if your API returns them)
  const countByStatus = FILTERS.reduce((acc, f) => {
    if (f !== "all") acc[f] = orders.filter((o) => o.status === f).length;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or order ID… (press Enter)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKey}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5
            text-sm outline-none focus:border-blue-400 transition-colors"
        />
        <button
          onClick={handleClear}
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
              <span className="ml-1 opacity-70">{countByStatus[f] ?? 0}</span>
            )}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div
          className="bg-red-50 border border-red-100 text-red-600 text-sm
          px-4 py-3 rounded-xl flex items-center justify-between"
        >
          <span>No order</span>
          <button onClick={refetch} className="text-xs underline ml-4">
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Table — desktop */}
      {!loading && (
        <div className="hidden md:block bg-white border border-gray-100 rounded-xl overflow-hidden">
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
                    className="px-5 py-3 text-left text-xs font-medium text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-gray-900">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.customer_phone}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">
                    {/* items_count comes from withCount() on the API resource */}
                    {order.items_count ?? order.items?.length ?? "—"} items
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {order.created_at}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs text-blue-600">View →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No orders found
            </div>
          )}
        </div>
      )}

      {/* Cards — mobile */}
      {!loading && (
        <div className="md:hidden space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-white border border-gray-100 rounded-xl p-4
                cursor-pointer active:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    #{order.id} · {order.customer_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.created_at}
                  </p>
                </div>
                <Badge status={order.status} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {order.items_count ?? order.items?.length ?? "—"} items
                </p>
                <p className="text-sm font-medium text-gray-900">
                  ${Number(order.total_amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
