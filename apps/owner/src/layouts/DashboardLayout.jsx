import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const update = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsTablet(window.innerWidth >= 768);
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (isTablet) setSidebarOpen(false);
  }, [isTablet]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop + Tablet sidebar */}
      {isTablet && <Sidebar collapsed={!isDesktop} />}

      {/* Mobile drawer */}
      {!isTablet && (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-20"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            className={`fixed inset-y-0 left-0 z-30 transition-transform
            duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar collapsed={false} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-16 lg:pb-6">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Mobile bottom nav */}
      {!isTablet && <BottomNav />}
    </div>
  );
}
