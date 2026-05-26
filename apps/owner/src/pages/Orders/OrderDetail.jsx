import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { MdOutlinePayments } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { useOrder, useDeliveryStaff } from "../../hooks/useOrders";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    order,
    loading,
    error,
    actionLoading,
    actionError,
    confirm,
    reject,
    assign,
  } = useOrder(id);
  const { staff, loading: staffLoading, load: loadStaff } = useDeliveryStaff();

  const [showReject, setShowReject] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  // Load delivery staff when the modal opens
  useEffect(() => {
    if (showAssign) loadStaff();
  }, [showAssign, loadStaff]);

  const handleConfirm = async () => {
    await confirm();
  };

  const handleReject = async () => {
    await reject(rejectReason);
    setShowReject(false);
    setRejectReason("");
  };

  const handleAssign = async () => {
    await assign(selectedStaff);
    setShowAssign(false);
    setSelectedStaff("");
  };

  /* ── Loading / Error states ── */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-100 rounded-lg" />
        <div className="h-48 bg-gray-100 rounded-xl" />
        <div className="h-32 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-2 text-sm text-blue-600 underline"
        >
          ← Back to orders
        </button>
      </div>
    );
  }

  if (!order) return null;

  const timeline = [
    { label: "Order placed", done: true, time: order.created_at },
    {
      label: "Payment verified",
      done: !["pending"].includes(order.status),
      time: order.confirmed_at ?? "—",
    },
    {
      label: "Assigned delivery",
      done: ["delivering", "delivered"].includes(order.status),
      time: order.delivery?.assigned_at ?? "—",
    },
    {
      label: "Delivered",
      done: order.status === "delivered",
      time: order.delivered_at ?? "—",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/orders")}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← Orders
        </button>
        <span className="text-gray-200">/</span>
        <h1 className="text-sm font-medium text-gray-900">Order #{order.id}</h1>
        <Badge status={order.status} />
      </div>

      {/* Action error banner */}
      {actionError && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left — main info */}
        <div className="md:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-xl">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-900">Order items</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="flex-1">
                    {/* API returns product_name; fall back to product.name */}
                    <p className="text-sm text-gray-900">
                      {item.product_name ?? item.product?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      ${Number(item.unit_price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${Number(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="text-sm font-semibold text-gray-900">
                ${Number(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-100 rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-900">Payment</h2>
              <Badge status={order.payment?.status ?? "pending"} />
            </div>
            <div className="p-5">
              {order.payment?.screenshot_url ? (
                <img
                  src={order.payment.screenshot_url}
                  alt="Payment screenshot"
                  className="w-full rounded-lg border border-gray-100"
                />
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-8
                  bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
                >
                  <p className="text-2xl mb-2">
                    <MdOutlinePayments />
                  </p>
                  <p className="text-sm text-gray-400">
                    No screenshot uploaded yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {order.status === "pending" && (
            <div className="flex gap-3">
              <Button
                variant="success"
                className="flex-1"
                onClick={handleConfirm}
                disabled={actionLoading}
              >
                <GiConfirmed />
                {actionLoading ? "Confirming…" : "Confirm Payment"}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => setShowReject(true)}
                disabled={actionLoading}
              >
                <RxCross2 />
                Reject
              </Button>
            </div>
          )}

          {order.status === "confirmed" && (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setShowAssign(true)}
              disabled={actionLoading}
            >
              {actionLoading ? "Assigning…" : "Assign Delivery Staff"}
            </Button>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Customer info */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Customer</h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-sm text-gray-900">{order.customer_name}</p>
              </div>
              {order.customer_telegram_id && (
                <div>
                  <p className="text-xs text-gray-400">Telegram</p>
                  <p className="text-sm text-blue-600">
                    {order.customer_telegram_id}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-900">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Delivery location</p>
                <p className="text-sm text-gray-900">
                  {order.delivery_location}
                </p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-xs text-gray-400">Notes</p>
                  <p className="text-sm text-gray-900">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery staff (if assigned) */}
          {order.user && (
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h2 className="text-sm font-medium text-gray-900 mb-3">
                Delivery staff
              </h2>
              <p className="text-sm text-gray-900">{order.user.name}</p>
              {order.user.telegram && (
                <p className="text-xs text-blue-600">{order.user.telegram}</p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center
                    flex-shrink-0 mt-0.5 text-xs ${
                      step.done
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {step.done ? "✓" : "○"}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${step.done ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        open={showReject}
        onClose={() => setShowReject(false)}
        title="Reject order"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowReject(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={actionLoading}
            >
              {actionLoading ? "Rejecting…" : "Reject order"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Are you sure you want to reject order #{order.id}? The customer will
            be notified via Telegram.
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Reason (optional)
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Payment screenshot unclear..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                text-sm outline-none focus:border-blue-400 resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Assign Delivery Modal */}
      <Modal
        open={showAssign}
        onClose={() => setShowAssign(false)}
        title="Assign delivery staff"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAssign(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              disabled={!selectedStaff || actionLoading}
            >
              {actionLoading ? "Assigning…" : "Assign"}
            </Button>
          </>
        }
      >
        {staffLoading ? (
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {staff.map((s) => (
              <label
                key={s.id}
                className={`flex items-center gap-3 p-3 rounded-xl border
                  cursor-pointer transition-colors ${
                    selectedStaff === s.id
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="staff"
                  value={s.id}
                  checked={selectedStaff === s.id}
                  onChange={() => setSelectedStaff(s.id)}
                  className="accent-blue-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  {s.telegram && (
                    <p className="text-xs text-gray-400">{s.telegram}</p>
                  )}
                </div>
              </label>
            ))}
            {staff.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No delivery staff available
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
