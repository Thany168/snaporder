import { useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineLink,
  HiOutlinePlus,
} from "react-icons/hi";

const pageTitles = {
  "/dashboard": { title: "Dashboard", crumb: "Home / Overview" },
  "/orders": { title: "Orders", crumb: "Home / Orders" },
  "/payments": { title: "Payments", crumb: "Home / Payments" },
  "/products": { title: "Products", crumb: "Shop / Products" },
  "/categories": { title: "Categories", crumb: "Shop / Categories" },
  "/delivery": { title: "Delivery", crumb: "Shop / Delivery" },
  "/settings": { title: "Settings", crumb: "Account / Settings" },
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const current = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path),
  );

  const { title = "Dashboard", crumb = "" } = current?.[1] ?? {};

  return (
    <header
      className="flex items-center justify-between px-4 lg:px-6
      h-14 bg-white border-b border-gray-100 flex-shrink-0"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100
          text-gray-500 transition"
        >
          <HiOutlineMenu className="text-lg" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">{crumb}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <button
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5
          border border-gray-200 rounded-lg text-xs text-gray-600
          hover:bg-gray-50 transition"
        >
          <HiOutlineLink className="text-sm" />
          Shop link
        </button>

        <button
          onClick={() => navigate("/products/new")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600
          text-white rounded-lg text-xs font-medium hover:bg-blue-700
          transition shadow-sm"
        >
          <HiOutlinePlus className="text-sm" />
          Product
        </button>

        <button
          className="relative w-9 h-9 flex items-center justify-center
          border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <HiOutlineBell className="text-lg text-gray-600" />

          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full
            bg-red-500"
          />
        </button>
      </div>
    </header>
  );
}
