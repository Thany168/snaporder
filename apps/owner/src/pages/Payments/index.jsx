import { useState, useEffect } from "react";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

const FILTERS = ["all", "pending", "verified", "rejected"];

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🚀 Environment configuration: points straight to your backend API gateway
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  // 🚀 Step 1: Fetch live checkout entries dynamically on component mount
  useEffect(() => {
    const fetchLivePayments = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${BASE_URL}/owner/payments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            // Attaches active admin/owner credentials securely from local storage
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Adapt cleanly to direct arrays or wrapped collection structures
        if (Array.isArray(data)) {
          setPayments(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setPayments(data.data);
        }
      } catch (error) {
        console.error("❌ Failed to load live shop records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivePayments();
  }, [BASE_URL]);

  // 🚀 Step 2: Handle data filtering dynamically matching database attributes
  const filtered = payments.filter((p) => {
    if (filter === "all") return true;
    const orderStatus = p.status || p.order?.status || "pending";
    return orderStatus.toLowerCase() === filter.toLowerCase();
  });

  // 🚀 Step 3: Compute live counters from the real dataset array rows
  const counts = {
    pending: payments.filter((p) => {
      const s = p.status || p.order?.status || "pending";
      return s.toLowerCase() === "pending";
    }).length,
    verified: payments.filter((p) => {
      const s = p.status || p.order?.status || "";
      return s.toLowerCase() === "verified" || s.toLowerCase() === "confirmed";
    }).length,
    rejected: payments.filter((p) => {
      const s = p.status || p.order?.status || "";
      return s.toLowerCase() === "rejected";
    }).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400 font-medium animate-pulse">
        ⏳ Loading active transaction registers from database...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dynamic Summary Analytics Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", count: counts.pending, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Verified", count: counts.verified, color: "text-green-600", bg: "bg-green-50" },
          { label: "Rejected", count: counts.rejected, color: "text-red-500", bg: "bg-red-50" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border border-transparent rounded-xl p-4 text-center cursor-pointer hover:scale-[1.01] transition-transform`}
            onClick={() => setFilter(s.label.toLowerCase())}
          >
            <p className={`text-2xl font-semibold ${s.color}`}>{s.count}</p>
            <p className={`text-xs ${s.color} opacity-80 mt-0.5`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs Controller */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Data Table Grid View */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {["Order", "Customer", "Amount", "Status", "Date", "Verification"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-gray-400">
                  📭 No active store records match this status filter.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const displayId = p.order_id || p.id;
                const customerName = p.customer_name || p.customer || p.order?.customer_name || "Guest Customer";
                const totalBill = parseFloat(p.amount || p.total_amount || p.order?.total_amount || 0);
                const currentStatus = p.status || p.order?.status || "pending";
                const displayDate = p.created_at ? new Date(p.created_at).toLocaleString() : p.date || "N/A";

                return (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">#{displayId}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{customerName}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">${totalBill.toFixed(2)}</td>
                    <td className="px-5 py-3.5"><Badge status={currentStatus.toLowerCase()} /></td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{displayDate}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelected(p)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        {p.screenshot || p.screenshot_path || p.screenshot_url ? "View Receipt" : "Quick View"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Overlay Drawer Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Order Details — Entry ID #${selected?.order_id || selected?.id}`}
        footer={
          <Button variant="outline" onClick={() => setSelected(null)}>
            Close Overview
          </Button>
        }
      >
        {selected?.screenshot || selected?.screenshot_url || selected?.screenshot_path ? (
          <img
            src={selected.screenshot || selected.screenshot_url || `${BASE_URL.replace('/api', '')}/storage/${selected.screenshot_path}`}
            alt="Payment Receipt Attachment"
            className="w-full rounded-xl object-contain max-h-[450px]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-4xl mb-2">🛒</p>
            <p className="text-sm font-semibold text-gray-700">Telegram Direct Checkout Stream</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs text-center px-4">
              This order bypassed manual banking image uploads and pushed its data straight to your Telegram group alert stream.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}