import React, { useEffect, useState } from "react";
import axios from "axios";

const MainAppContainer = () => {
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🚀 THE CRITICAL TELEGRAM WEBAPP PARAMETER PARSER ENGINE
    let storeId = null;

    if (window.Telegram?.WebApp?.initDataUnsafe) {
      const tgData = window.Telegram.WebApp.initDataUnsafe;
      
      // Telegram injects "?startapp=38" directly into the start_param string!
      if (tgData.start_param) {
        storeId = tgData.start_param;
        console.log("🎯 Found store ID via Telegram SDK:", storeId);
      }
    }

    // 🔄 FALLBACK 1: If Telegram SDK isn't ready, try reading standard web query strings (for browser testing)
    if (!storeId) {
      const queryParams = new URLSearchParams(window.location.search);
      storeId = queryParams.get("startapp") || queryParams.get("tgWebAppStartParam");
    }

    // 🔄 FALLBACK 2: Check if an old store ID is saved in localStorage so the screen doesn't crash
    if (!storeId) {
      storeId = localStorage.getItem("cached_store_id");
    }

    if (!storeId) {
      setError("No store reference profile found. Open via your custom Telegram link!");
      return;
    }

    // 🌟 SAVE INTENT: Keep track of the active shop ID cleanly so it doesn't default to old profiles
    localStorage.setItem("cached_store_id", storeId);

    // Fetch the target shop parameters from your Laravel backend API endpoint
    const fetchTenantShop = async () => {
      try {
        const baseApiUrl = "https://stinging-unknowing-dry.ngrok-free.dev/api"; // or your live domain link
        const response = await axios.get(`${baseApiUrl}/shops/profile/${storeId}`);
        setStoreData(response.data);
      } catch (err) {
        console.error("Backend failed to load tenant shop registry: ", err);
        setError("Bot application profile configuration mismatch.");
      }
    };

    fetchTenantShop();
  }, []);

  if (error) return <div className="text-white bg-slate-900 min-h-screen flex items-center justify-center font-bold p-4 text-center">{error}</div>;
  if (!storeData) return <div className="text-indigo-400 bg-slate-900 min-h-screen flex items-center justify-center font-bold tracking-widest animate-pulse">LOADING PHUMYERNG...</div>;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Your standard dynamic menu layout workspace goes here */}
      <h1>Welcome to {storeData.shop_name}</h1>
    </div>
  );
};

export default MainAppContainer;