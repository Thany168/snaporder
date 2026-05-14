import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { MdOutlinePayments } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";

const ORDER = {
  id: 1024,
  customer: "Test Customer",
  telegram: "@testcustomer",
  phone: "012345678",
  location: "123 Main Street, Phnom Penh",
  status: "pending",
  total: 11.0,
  created_at: "2026-04-13 10:00",
  items: [
    { id: 1, name: "Iced Coffee", qty: 2, price: 3.5, subtotal: 7.0 },
    { id: 2, name: "Spring Rolls", qty: 1, price: 3.0, subtotal: 3.0 },
    { id: 3, name: "Lemon Tea", qty: 1, price: 1.0, subtotal: 1.0 },
  ],
  payment: {
    status: "pending",
    screenshot_url: null,
  },
};

const DELIVERY_STAFF = [
  { id: 1, name: "Delivery Staff 1", telegram: "@deliverystaff1" },
  { id: 2, name: "Delivery Staff 2", telegram: "@deliverystaff2" },
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(ORDER);
  const [showReject, setShowReject] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  const handleConfirm = () => {
    setOrder((o) => ({ ...o, status: "confirmed" }));
  };

  const handleReject = () => {
    setOrder((o) => ({ ...o, status: "rejected" }));
    setShowReject(false);
  };

  const handleAssign = () => {
    setOrder((o) => ({ ...o, status: "delivering" }));
    setShowAssign(false);
  };

  const timeline = [
    { label: "Order placed", done: true, time: "10:00" },
    {
      label: "Payment verified",
      done: order.status !== "pending",
      time: "10:05",
    },
    {
      label: "Assigned delivery",
      done: ["delivering", "delivered"].includes(order.status),
      time: "10:10",
    },
    { label: "Delivered", done: order.status === "delivered", time: "—" },
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left — main info */}
        <div className="md:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-xl">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-900">Order items</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      ${item.price.toFixed(2)} × {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="flex justify-between px-5 py-3 border-t
              border-gray-100 bg-gray-50 rounded-b-xl"
            >
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="text-sm font-semibold text-gray-900">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment screenshot */}
          <div className="bg-white border border-gray-100 rounded-xl">
            <div
              className="flex items-center justify-between px-5 py-4
              border-b border-gray-100"
            >
              <h2 className="text-sm font-medium text-gray-900">Payment</h2>
              <Badge status={order.payment.status} />
            </div>
            <div className="p-5">
              {order.payment.screenshot_url ? (
                <img
                  src={order.payment.screenshot_url}
                  alt="Payment screenshot"
                  className="w-full rounded-lg border border-gray-100"
                />
              ) : (
                <div
                  className="flex flex-col items-center justify-center
                  py-8 bg-gray-50 rounded-xl border-2 border-dashed
                  border-gray-200"
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
              >
                <GiConfirmed className="flex items-center " />
                Confirm Payment
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => setShowReject(true)}
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
            >
              Assign Delivery Staff
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Customer</h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-sm text-gray-900">{order.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Telegram</p>
                <p className="text-sm text-blue-600">{order.telegram}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-900">{order.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Delivery location</p>
                <p className="text-sm text-gray-900">{order.location}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center
                    justify-center flex-shrink-0 mt-0.5 text-xs ${
                      step.done
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {step.done ? "✓" : "○"}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${
                        step.done ? "text-gray-900" : "text-gray-400"
                      }`}
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
            <Button variant="danger" onClick={handleReject}>
              Reject order
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
              disabled={!selectedStaff}
            >
              Assign
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          {DELIVERY_STAFF.map((staff) => (
            <label
              key={staff.id}
              className={`flex items-center gap-3 p-3 rounded-xl border
                cursor-pointer transition-colors ${
                  selectedStaff === staff.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name="staff"
                value={staff.id}
                checked={selectedStaff === staff.id}
                onChange={() => setSelectedStaff(staff.id)}
                className="accent-blue-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {staff.name}
                </p>
                <p className="text-xs text-gray-400">{staff.telegram}</p>
              </div>
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
}
