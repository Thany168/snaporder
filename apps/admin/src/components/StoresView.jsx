import React from "react";

const StoresView = ({ owners, toggleStatus, setIsModalOpen }) => {
  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">All Owner Shop Portals</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          + New Owner
        </button>
      </div>

      <div className="overflow-hidden">
        {/* TABLE HEADERS */}
        <div className="grid grid-cols-7 items-center bg-slate-50/70 p-4 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <div>Shop Details</div>
          <div>Company Code</div>
          <div>Owner Phone</div>
          <div>Owner Email</div>
          <div>Plan Type</div>
          {/* Centered header label */}
          <div className="text-center">Telegram Token</div> 
          <div className="text-center">Status</div>
        </div>

        {/* DATA ROWS LOOPER */}
        <div className="divide-y divide-slate-100">
          {!owners || owners.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              No store portals registered yet.
            </div>
          ) : (
            owners.map((owner, index) => {
              const shopName = owner?.shop_name || "Unnamed Shop";
              const companyCode = owner?.user?.company_code || `LEGACY-${owner?.id || index}`;
              const phoneNum = owner?.user?.phone || "N/A";
              const emailAddr = owner?.user?.email || "No Email";
              const planType = owner?.subscription?.plan || "trial";
              const activeStatus = owner?.status || "active";
              
              // Extract the target key securely from your Laravel backend model
              const verificationToken = owner?.telegram_verification_token;

              return (
                <div
                  key={owner?.id || index}
                  className="grid grid-cols-7 items-center p-4 text-slate-600 hover:bg-slate-50/80 transition-all text-sm font-medium"
                >
                  {/* 1. Shop Details */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold uppercase shrink-0">
                      {shopName.charAt(0)}
                    </div>
                    <div className="font-bold text-slate-900 truncate">{shopName}</div>
                  </div>

                  {/* 2. Company Code */}
                  <div>
                    <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold tracking-wider">
                      {companyCode}
                    </span>
                  </div>

                  {/* 3. Phone */}
                  <div className="text-slate-700 font-semibold">{phoneNum}</div>

                  {/* 4. Email */}
                  <div className="text-slate-500 text-xs truncate pr-2">{emailAddr}</div>

                  {/* 5. Plan Badge Type */}
                  <div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase ${
                      planType === "pro" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                      planType === "basic" ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-slate-100 text-slate-600"
                    }`}>
                      {planType}
                    </span>
                  </div>

                  {/* 🌟 6. REFACTORED: HIDDEN RAW STRINGS - SHOWS CLEAN ACTION BUTTONS */}
                  <div className="flex justify-center">
                    {verificationToken ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents clicking the row from triggering other actions
                          
                          // Formats the output string cleanly: "/setup PHUM-XXXX-XXXX"
                          const setupCommandStr = `/setup ${verificationToken}`;
                          navigator.clipboard.writeText(setupCommandStr);
                          
                          // Change button styles instantly to indicate copy success
                          const btn = e.currentTarget;
                          btn.innerText = "Copied! ✨";
                          btn.className = "text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold transition-all shadow-md shadow-emerald-100 scale-95 select-none";
                          
                          // Restores standard display state after 1.5 seconds
                          setTimeout(() => {
                            btn.innerText = "Copy Command 📋";
                            btn.className = "text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer block w-max select-none";
                          }, 1500);
                        }}
                        className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer block w-max select-none"
                        title="Click to copy the automated telegram setup command directly"
                      >
                        Copy feed 📋
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl inline-flex items-center gap-1 select-none">
                        Linked ✅
                      </span>
                    )}
                  </div>

                  {/* 7. Status Action Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggleStatus(owner)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 ${
                        String(activeStatus).toLowerCase() === "active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      {activeStatus}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default StoresView;