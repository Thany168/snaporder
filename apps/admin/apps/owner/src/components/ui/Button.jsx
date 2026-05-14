export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    ghost: "text-gray-500 hover:bg-gray-100",
    outline: "border border-gray-200 text-gray-600 hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
