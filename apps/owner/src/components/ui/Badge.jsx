const variants = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  assigning: "bg-purple-50 text-purple-700 border border-purple-200",
  delivering: "bg-orange-50 text-orange-700 border border-orange-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  active: "bg-green-50 text-green-700 border border-green-200",
  suspended: "bg-red-50 text-red-600 border border-red-200",
  verified: "bg-green-50 text-green-700 border border-green-200",
};

const labels = {
  pending: "Pending",
  confirmed: "Confirmed",
  rejected: "Rejected",
  assigning: "Preparing",
  delivering: "On the way",
  delivered: "Delivered",
  active: "Active",
  suspended: "Suspended",
  verified: "Verified",
};

export default function Badge({ status }) {
  const cls =
    variants[status] ?? "bg-gray-50 text-gray-600 border border-gray-200";
  const label = labels[status] ?? status;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full
      text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
