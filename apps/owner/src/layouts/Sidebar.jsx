import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineCreditCard,
  HiOutlineCube,
  HiOutlineCollection,
  HiOutlineTruck,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";

const navSections = [
  {
    label: "Main",
    items: [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: HiOutlineViewGrid,
        badge: null,
      },
      {
        path: "/orders",
        label: "Orders",
        icon: HiOutlineClipboardList,
        badge: 3,
      },
      {
        path: "/payments",
        label: "Payments",
        icon: HiOutlineCreditCard,
        badge: 2,
      },
    ],
  },
  {
    label: "Shop",
    items: [
      {
        path: "/products",
        label: "Products",
        icon: HiOutlineCube,
        badge: null,
      },
      {
        path: "/categories",
        label: "Categories",
        icon: HiOutlineCollection,
        badge: null,
      },
    ],
  },
  {
    label: "Account",
    items: [
      { path: "/settings", label: "Settings", icon: HiOutlineCog, badge: null },
    ],
  },
];

export default function Sidebar({ collapsed, onClose }) {
  const initials = "OW";

  const handleLogout = () => {
    console.log("logout");
  };

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-100
      transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}
    >
      {/* Brand */}
      <div
        className={`flex items-center gap-3 border-b border-gray-100
        ${collapsed ? "p-3 justify-center" : "p-4"}`}
      >
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold">
          DS
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Demo Shop
            </p>
            <p className="text-xs text-gray-400">Owner account</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="mb-3">
            {!collapsed && (
              <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.label}
              </p>
            )}

            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl
                  text-sm transition-all duration-150
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }
                  ${collapsed ? "justify-center" : ""}`
                }
                title={collapsed ? item.label : ""}
              >
                {({ isActive }) => {
                  const Icon = item.icon;

                  return (
                    <>
                      <Icon
                        className={`text-lg ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />

                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>

                          {item.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className={`border-t border-gray-100 ${collapsed ? "p-2" : "p-3"}`}>
        {collapsed ? (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <HiOutlineLogout className="text-lg" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-semibold">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                Owner
              </p>
              <p className="text-xs text-gray-400 truncate">owner@email.com</p>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <HiOutlineLogout className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
