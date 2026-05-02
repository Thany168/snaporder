import { useState } from "react";
import Button from "../../components/ui/Button";

export default function Settings() {
  const [shop, setShop] = useState({
    name: "Demo Shop",
    description: "Best shop in town",
    telegram_chat_id: "111111111",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setShop((s) => ({ ...s, [key]: val }));

  const handleLogo = (file) => {
    set("logo", file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400">
          Manage your shop details and preferences
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shop Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">
              Shop information
            </h2>

            {/* Logo */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-3">
                Shop logo
              </label>

              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden border bg-gray-50 flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Logo</span>
                  )}
                </div>

                {/* Upload */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleLogo(e.target.files?.[0])}
                  />
                  <div className="px-4 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                    Upload logo
                  </div>
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Shop name
              </label>
              <input
                type="text"
                value={shop.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={shop.description}
                onChange={(e) => set("description", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none"
              />
            </div>
          </div>

          {/* Telegram */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">
              Telegram notifications
            </h2>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Telegram Chat ID
              </label>
              <input
                type="text"
                value={shop.telegram_chat_id}
                onChange={(e) => set("telegram_chat_id", e.target.value)}
                placeholder="e.g. 123456789"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Send /start to @userinfobot to get your chat ID
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-700 mb-1">
                How it works
              </p>
              <p className="text-xs text-blue-600 leading-relaxed">
                You’ll receive order notifications instantly on Telegram with
                action buttons to confirm or reject orders.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Subscription */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Subscription
            </h2>

            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-3">
              Pro plan
            </span>

            <p className="text-xs text-gray-400 mb-4">
              Expires: April 13, 2027
            </p>

            <button className="w-full text-sm py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
              Manage plan
            </button>
          </div>

          {/* Save Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <Button variant="primary" className="w-full" onClick={handleSave}>
              Save changes
            </Button>

            {saved && (
              <p className="text-xs text-green-600 mt-3 text-center font-medium">
                ✓ Changes saved successfully
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
