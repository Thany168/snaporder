import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useCart } from "../hooks/useCart";

// Components
import ProductList from "./ProductList";
import Checkout from "../pages/Checkout";

const ShopMainView = () => {
  const { cart, addToCart, totalAmount, clearCart } = useCart();
  const [view, setView] = useState("shop");
  const tg = window.Telegram?.WebApp;

  const [categories, setCategories] = useState([]);
  const [owner, setOwner] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentShopId, setCurrentShopId] = useState(null);

  // 🎨 DYNAMIC BRAND COLORS: Pulling from owner portal settings with standard fallbacks
  const primaryColor = owner?.brand_color || "#2563eb"; // Default Blue-600
  const lightBgColor = owner?.brand_color
    ? `${owner.brand_color}15`
    : "#dbeafe"; // Tinted background for badges

  // 🌐 BASE PATH FORMATTER: Turns database path fragments into real absolute URLs
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600";
    
    // 🎯 FIX: Force secure HTTPS wrapper protocol for your shop logo/cover ngrok paths
    let securePath = imagePath;
    if (securePath.startsWith("http://")) {
        securePath = securePath.replace("http://", "https://");
    }
    
    if (securePath.startsWith("https://")) {
        return securePath;
    }
    
    const backendRoot = api.defaults.baseURL?.replace("/api", "") || "https://stinging-unknowing-dry.ngrok-free.dev";
    return `${backendRoot.replace("http://", "https://")}/${securePath.replace(/^\//, "")}`;
  };

  // 🚀 STEP 1: PURE STATE EXTRACTOR FUNCTION
  const getLiveParamId = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tgParam = tg?.initDataUnsafe?.start_param;
    const urlParam =
      urlParams.get("startapp") || urlParams.get("tgWebAppStartParam");

    return tgParam || urlParam || null;
  }, [tg]);

  // 🚀 STEP 2: RE-ROUTE WATCHER ENGINE
  useEffect(() => {
    const checkLinkSwitch = () => {
      const activeLinkId = getLiveParamId();

      if (activeLinkId && activeLinkId !== currentShopId) {
        console.log(
          `🔄 LINK SWITCH DETECTED! Changing from ${currentShopId} to ${activeLinkId}`,
        );
        setCurrentShopId(activeLinkId);
        localStorage.setItem("phumyerng_active_shop_id", activeLinkId);
      } else if (!currentShopId) {
        const fallbackId =
          localStorage.getItem("phumyerng_active_shop_id") || "1";
        setCurrentShopId(fallbackId);
      }
    };

    checkLinkSwitch();

    if (tg) {
      tg.onEvent("mainButtonClicked", checkLinkSwitch);
      window.addEventListener("focus", checkLinkSwitch);
    }

    return () => {
      if (tg) tg.offEvent("mainButtonClicked", checkLinkSwitch);
      window.removeEventListener("focus", checkLinkSwitch);
    };
  }, [currentShopId, getLiveParamId, tg]);

  // 🚀 STEP 3: DATA FETCH TRIGGER PIPELINE
  useEffect(() => {
    if (!currentShopId) return;

    const loadShopData = async () => {
      try {
        setLoading(true);
        const isTelegram = !!tg?.initData;

        let authResponse;
        if (isTelegram) {
          authResponse = await api.post("/auth/telegram", {
            init_data: tg.initData,
          });
        } else {
          authResponse = await api.post("/auth/telegram/dev", {
            telegram_id: "1282406422",
            name: "Sokheng Dev",
            role: "owner",
          });
        }
        setUser(authResponse.data.user);
        localStorage.setItem("token", authResponse.data.token);

        let targetId = currentShopId;

        if (targetId === "1" && authResponse.data.owner_id) {
          targetId = authResponse.data.owner_id;
          setCurrentShopId(targetId);
        }

        console.log(
          "🔥 Triggering fresh API payload requests for Shop ID:",
          targetId,
        );

        const [productsRes, ownerRes] = await Promise.all([
          api.get(`/shop/${targetId}/products`),
          api.get(`/shop/${targetId}`),
        ]);

        setCategories(productsRes.data);
        setOwner(ownerRes.data);
      } catch (error) {
        console.error("API Loader Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadShopData();
  }, [currentShopId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderTopColor: primaryColor }}
        ></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 🖼️ HIGH-END DYNAMIC BRAND HEADER */}
      <header className="relative bg-white shadow-sm border-b border-gray-100">
        {/* Store Cover Image Banner */}
        <div className="w-full h-32 bg-gray-200 overflow-hidden relative">
          <img
            src={getFullImageUrl(owner?.cover_url)}
            alt="Shop Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Profile Avatar & Info Row Overlay */}
        {/* 🎯 FIXED: Clean HTML structural elements nesting layout layout */}
        <div className="p-4 flex items-end -mt-12 relative z-10 px-4 w-full justify-between">
          <div className="flex items-end flex-1 min-w-0">
            {/* Profile Avatar Container Box */}
            <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-md border border-gray-100 overflow-hidden flex-shrink-0">
              <img
                src={getFullImageUrl(owner?.logo_url)}
                alt="Shop Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600";
                }}
              />
            </div>

            {/* Shop Meta Details Block */}
            <div className="ml-3 mb-1 flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white leading-tight drop-shadow-md line-clamp-1">
                {owner?.shop_name || "Loading Shop..."}
              </h1>
              <p className="text-xs text-gray-500 line-clamp-1 mt-3 font-medium">
                {owner?.shop_description || "Welcome to our digital storefront!"}
              </p>
            </div>
          </div>

          {/* Customer Dynamic Badge Pill */}
          <span
            style={{ backgroundColor: lightBgColor, color: primaryColor }}
            className="text-xs px-3 py-1.5 rounded-full font-bold flex-shrink-0 self-center mt-6 transition-all ml-2"
          >
            Hi, {user?.name?.split(" ")[0] || "Guest"}
          </span>
        </div>
      </header>

      {view === "shop" ? (
        <>
          {/* Search Field Integration */}
          <div className="p-2 px-4 mt-3">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white shadow-sm transition-all"
              style={{ "--tw-focus-border-color": primaryColor }}
              onFocus={(e) => (e.target.style.borderColor = primaryColor)}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              onChange={async (e) => {
                const q = e.target.value;
                const res = await api.get(
                  `/shop/${currentShopId}/products?search=${q}`,
                );
                setCategories(res.data);
              }}
            />
          </div>

          {/* 💤 AUTOMATION UPGRADE: Store Open/Closed Notice Banner */}
          {owner?.is_open === false && (
            <div className="mx-4 mt-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center shadow-sm">
              <span className="text-xl">💤</span>
              <h4 className="text-sm font-bold text-amber-800 mt-1">
                Store is Closed
              </h4>
              <p className="text-[11px] text-amber-600 mt-0.5">
                The merchant is currently not accepting automated checkout orders.
              </p>
            </div>
          )}

          <div className="p-2">
            <div className="flex justify-between items-center px-2 mb-3 mt-1">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                Store Menu
              </h2>
              <span className="text-[10px] bg-gray-200/70 text-gray-500 px-2 py-0.5 rounded-md font-bold">
                ID: {owner?.id}
              </span>
            </div>

            {/* NESTED CATEGORY LOOP RENDERING BLOCK */}
            {categories.length === 0 ? (
              <div className="text-center text-gray-400 py-12 text-sm font-medium">
                No items available at this time.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="mb-6">
                  {category.products && category.products.length > 0 && (
                    <>
                      {/* Category Heading themed dynamically */}
                      <h3
                        style={{ color: primaryColor }}
                        className="text-xs font-black px-2 mb-2.5 uppercase tracking-wider"
                      >
                        {category.name}
                      </h3>

                      {/* LAYOUT UPGRADE: Passing configuration down to ProductList */}
                      <ProductList
                        products={category.products}
                        onAdd={addToCart}
                        layoutType={owner?.layout_type || "list"}
                        primaryColor={primaryColor}
                      />
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* 🎨 DYNAMIC BUTTON: Checkout launcher banner */}
          {cart.length > 0 && (
            <div className="fixed bottom-0 w-full p-4 bg-white border-t border-gray-100 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.08)] z-20">
              <button
                onClick={() => setView("checkout")}
                style={{ backgroundColor: primaryColor }}
                className="w-full text-white py-4 rounded-2xl font-bold flex justify-between px-6 transition-all shadow-md active:scale-[0.99]"
              >
                <span className="tracking-wide">
                  View My Cart ({cart.length})
                </span>
                <span className="font-extrabold">
                  ${totalAmount.toFixed(2)}
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="p-4">
          <button
            onClick={() => setView("shop")}
            style={{ color: primaryColor }}
            className="mb-6 flex items-center font-bold text-sm transition-all active:translate-x-[-2px]"
          >
            <span className="mr-2 text-xl">←</span> Back to Shop Menu
          </button>

          <h2 className="text-2xl font-black mb-5 text-gray-900 tracking-tight">
            Complete Your Order
          </h2>

          <Checkout
            cartItems={cart}
            totalAmount={totalAmount}
            ownerId={owner?.id}
            clearCart={clearCart}
            primaryColor={primaryColor}
            onSuccess={() => {
              localStorage.removeItem("shopping_cart");
              clearCart();

              setTimeout(() => {
                if (tg) {
                  tg.showAlert("🛒 Order Sent Successfully to Telegram Group!");
                } else {
                  alert("🛒 Order Sent Successfully to Telegram Group!");
                }
                window.location.reload();
              }, 100);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ShopMainView;