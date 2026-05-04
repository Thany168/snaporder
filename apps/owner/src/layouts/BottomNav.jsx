import { NavLink } from "react-router-dom";

const items = [
  { path: "/dashboard", label: "Home", icon: "▦" },
  { path: "/orders", label: "Orders", icon: "📋" },
  { path: "/products", label: "Products", icon: "📦" },
  { path: "/payments", label: "Payments", icon: "💳" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t
      border-gray-100 flex z-20 lg:hidden"
    >
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs
            transition-colors ${isActive ? "text-blue-600" : "text-gray-400"}`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
