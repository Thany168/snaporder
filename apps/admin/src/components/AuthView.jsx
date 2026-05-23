import React, { useState } from "react";
import axios from "axios";

const AuthView = ({ onAuthSuccess }) => {
  const [authStep, setAuthStep] = useState("password"); // "password" or "otp"
  const [loginCredentials, setLoginCredentials] = useState({ email: "", password: "" });
  const [otpCode, setOtpCode] = useState("");
  const [loginError, setLoginError] = useState("");

  const baseApiUrl = "https://stinging-unknowing-dry.ngrok-free.dev/api/admin";

  // Handle Password Submission Step
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await axios.post(`${baseApiUrl}/login`, loginCredentials, {
        headers: { "Content-Type": "application/json", Accept: "application/json" }
      });

      if (response.data.status === "requires_otp") {
        setAuthStep("otp");
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  // Handle OTP Submission Step
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await axios.post(`${baseApiUrl}/verify-otp`, {
        email: loginCredentials.email,
        code: otpCode
      }, {
        headers: { "Content-Type": "application/json", Accept: "application/json" }
      });

      const { token, user } = response.data;
      
      // Pass token and profile context back up to App.jsx core state mapper
      onAuthSuccess(token, user);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Incorrect code. Use 111111.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FD] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-slate-700 animate-in fade-in duration-200">
        {/* Brand Header Display */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">P</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">PhumYerng Admin</span>
        </div>

        {authStep === "password" ? (
          /* FORM PHASE A: PASSWORD VALIDATION INPUTS */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <h2 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sign In Context</h2>
            {loginError && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600">{loginError}</div>}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <input type="email" required placeholder="admin@phumyerng.com" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={loginCredentials.email} onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <input type="password" required placeholder="••••••••" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={loginCredentials.password} onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all mt-2">Next Step →</button>
          </form>
        ) : (
          /* FORM PHASE B: OTP SECURITY CODE SCREEN VERIFICATION */
          <form onSubmit={handleOtpSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <h2 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Security Verification</h2>
            <p className="text-xs text-center text-slate-400 mb-4">A security code has been dispatched to {loginCredentials.email}</p>
            {loginError && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600">{loginError}</div>}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                <span>Enter OTP Code</span>
                <span className="text-indigo-600 lowercase font-mono">Test code: 111111</span>
              </label>
              <input type="text" maxLength={6} required placeholder="000000" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl tracking-[1em] text-center font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500/20" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all mt-2">Verify & Unlock Panel 🔓</button>
            <button type="button" onClick={() => setAuthStep("password")} className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 mt-2 block transition-all">← Back to Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthView;