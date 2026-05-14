import { useState, useEffect, useRef } from "react";
import client from "../../api/client";
import Button from "../../components/ui/Button";
import {
  HiOutlineCamera,
  HiOutlineCheck,
  HiOutlineExclamation,
} from "react-icons/hi";

function getOwner() {
  try {
    return JSON.parse(localStorage.getItem("owner")) ?? {};
  } catch {
    return {};
  }
}
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) ?? {};
  } catch {
    return {};
  }
}

function Section({ title, description, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5
        text-sm outline-none focus:border-blue-400 focus:ring-2
        focus:ring-blue-50 transition"
      {...props}
    />
  );
}

function Toast({ type, message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const styles =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-red-50 border-red-200 text-red-700";

  const Icon = type === "success" ? HiOutlineCheck : HiOutlineExclamation;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2
      border px-4 py-3 rounded-xl shadow-lg text-sm ${styles}`}
    >
      <Icon className="text-lg" />
      {message}
    </div>
  );
}

export default function Settings() {
  const cachedOwner = getOwner();
  const cachedUser = getUser();

  const [shop, setShop] = useState({
    shop_name: cachedOwner.shop_name ?? "",
    shop_description: cachedOwner.shop_description ?? "",
    telegram_chat_id: cachedOwner.telegram_chat_id ?? "",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(cachedOwner.logo_url ?? null);
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }
  const [pwError, setPwError] = useState("");

  const fileRef = useRef();

  useEffect(() => {
    client
      .get("/owner/profile")
      .then((res) => {
        const o = res.data;
        setShop({
          shop_name: o.shop_name ?? "",
          shop_description: o.shop_description ?? "",
          telegram_chat_id: o.telegram_chat_id ?? "",
        });
        setLogoPreview(o.logo_url ?? null);
        localStorage.setItem("owner", JSON.stringify(o));
      })
      .catch(() => {}); // silently use cache if endpoint not ready
  }, []);

  const set = (k, v) => setShop((s) => ({ ...s, [k]: v }));
  const setPw = (k, v) => setPassword((p) => ({ ...p, [k]: v }));
  const notify = (type, message) => setToast({ type, message });

  const handleLogo = (file) => {
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("shop_name", shop.shop_name);
      fd.append("shop_description", shop.shop_description);
      fd.append("telegram_chat_id", shop.telegram_chat_id);
      if (logoFile) fd.append("logo", logoFile);

      const res = await client.post("/owner/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("owner", JSON.stringify(res.data));
      setLogoPreview(res.data.logo_url ?? logoPreview);
      setLogoFile(null);
      window.dispatchEvent(new Event("storage"));
      notify("success", "Settings saved successfully.");
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Failed to save settings.";
      notify("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError("");

    if (!password.current || !password.new || !password.confirm) {
      setPwError("All password fields are required.");
      return;
    }
    if (password.new !== password.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    if (password.new.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    try {
      await client.post("/owner/change-password", {
        current_password: password.current,
        password: password.new,
        password_confirmation: password.confirm,
      });
      setPassword({ current: "", new: "", confirm: "" });
      notify("success", "Password changed successfully.");
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Failed to change password.";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400">
          Manage your shop details and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Shop Info */}
          <Section
            title="Shop information"
            description="This info appears on your public shop page."
          >
            {/* Logo */}
            <Field label="Shop logo">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden border
                    bg-gray-50 flex items-center justify-center"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-300 text-xs">No Logo</span>
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-2xl
                      flex items-center justify-center opacity-0
                      group-hover:opacity-100 transition"
                  >
                    <HiOutlineCamera className="text-white text-xl" />
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 border rounded-xl text-sm text-gray-600
                      hover:bg-gray-50 transition"
                  >
                    Upload logo
                  </button>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, WEBP · max 2MB
                  </p>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleLogo(e.target.files?.[0])}
                />
              </div>
            </Field>

            {/* Shop Name */}
            <Field label="Shop name">
              <Input
                value={shop.shop_name}
                onChange={(e) => set("shop_name", e.target.value)}
                placeholder="My Shop"
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                rows={3}
                value={shop.shop_description}
                onChange={(e) => set("shop_description", e.target.value)}
                placeholder="Tell customers about your shop…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                  text-sm outline-none focus:border-blue-400 focus:ring-2
                  focus:ring-blue-50 transition resize-none"
              />
            </Field>
          </Section>

          {/* Telegram */}
          <Section title="Telegram notifications">
            <Field
              label="Telegram Chat ID"
              hint="Send /start to @userinfobot on Telegram to get your chat ID."
            >
              <Input
                value={shop.telegram_chat_id}
                onChange={(e) => set("telegram_chat_id", e.target.value)}
                placeholder="e.g. 123456789"
              />
            </Field>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-700 mb-1">
                How it works
              </p>
              <p className="text-xs text-blue-600 leading-relaxed">
                You'll receive order notifications instantly on Telegram with
                action buttons to confirm or reject orders.
              </p>
            </div>
          </Section>

          {/* Change Password */}
          <Section
            title="Change password"
            description="Use a strong password of at least 8 characters."
          >
            <Field label="Current password">
              <Input
                type="password"
                value={password.current}
                onChange={(e) => setPw("current", e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <Field label="New password">
              <Input
                type="password"
                value={password.new}
                onChange={(e) => setPw("new", e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <Field label="Confirm new password">
              <Input
                type="password"
                value={password.confirm}
                onChange={(e) => setPw("confirm", e.target.value)}
                placeholder="••••••••"
              />
            </Field>

            {pwError && (
              <p
                className="text-xs text-red-500 bg-red-50 border border-red-200
                rounded-xl px-3 py-2"
              >
                {pwError}
              </p>
            )}

            <Button
              onClick={handleChangePassword}
              disabled={pwLoading}
              className="px-4 py-2 rounded-xl bg-gray-800 text-white text-sm
                hover:bg-gray-900 transition disabled:opacity-50"
            >
              {pwLoading ? "Updating…" : "Update password"}
            </Button>
          </Section>
        </div>

        <div className="space-y-6">
          {/* Account info */}
          <Section title="Account">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-800">
                  {cachedUser.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Company Code</p>
                <p className="text-sm font-medium text-gray-800">
                  {cachedUser.company_code || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-800">
                  {cachedUser.phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <span
                  className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700
                  text-xs font-medium rounded-full capitalize"
                >
                  {cachedUser.role || "owner"}
                </span>
              </div>
            </div>
          </Section>

          {/* Subscription */}
          <Section title="Subscription">
            <span
              className="inline-block px-3 py-1 bg-blue-50 text-blue-700
              text-xs font-medium rounded-full"
            >
              Pro plan
            </span>
            <p className="text-xs text-gray-400 mt-2">
              Expires: April 13, 2027
            </p>
            <button
              className="w-full mt-3 text-sm py-2 rounded-xl border
              border-gray-200 hover:bg-gray-50 transition"
            >
              Manage plan
            </button>
          </Section>

          {/* Save */}
          <Section title="Save changes">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm
                font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </Section>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}
