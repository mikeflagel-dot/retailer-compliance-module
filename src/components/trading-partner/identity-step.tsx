import { AlertCircle } from "lucide-react";

interface IdentityStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  retailerPrograms: any[];
}

export function IdentityStep({
  formData,
  updateFormData,
  retailerPrograms,
}: IdentityStepProps) {
  /** -----------------------------
   * Generate Trading Partner ID
   * ------------------------------ */
  const generateTradingPartnerId = (
    programType: string,
    retailer: string,
    merchant: string,
  ) => {
    if (!programType || !retailer || !merchant) return "";
    return `${programType}-${retailer}-${merchant}SB`;
  };

  /** -----------------------------
   * Handle Program Selection
   * ------------------------------ */
  const handleProgramSelect = (programId: string) => {
    const selected = retailerPrograms.find(
      (p) => p.id === programId,
    );

    if (!selected) return;

    const retailer = selected.data.retailerName;
    const programType = selected.data.programType;

    const newId = generateTradingPartnerId(
      programType,
      retailer,
      formData.merchant,
    );

    updateFormData({
      retailerProgramId: programId,
      retailer,
      programType,
      tradingPartnerId: newId,
    });
  };

  /** -----------------------------
   * Handle Merchant Change
   * ------------------------------ */
  const handleMerchantChange = (value: string) => {
    const newId = generateTradingPartnerId(
      formData.programType,
      formData.retailer,
      value,
    );

    updateFormData({
      merchant: value,
      tradingPartnerId: newId,
    });
  };

  /** -----------------------------
   * Duplicate Check (Simulated)
   * ------------------------------ */
  const isDuplicateId =
    formData.tradingPartnerId === "ACME_WALMART_001";

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Trading Partner Information
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Select a Retailer Program and define the merchant
          relationship.
        </p>

        <div className="space-y-5">
          {/* Retailer Program */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Retailer Program{" "}
              <span className="text-red-500">*</span>
            </label>

            <select
              value={formData.retailerProgramId || ""}
              onChange={(e) =>
                handleProgramSelect(e.target.value)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="">Select a program...</option>
              {retailerPrograms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.data.programName}
                </option>
              ))}
            </select>
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Merchant <span className="text-red-500">*</span>
            </label>

            <select
              value={formData.merchant || ""}
              onChange={(e) =>
                handleMerchantChange(e.target.value)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="">Select a merchant...</option>
              <option value="Acme Corp">Acme Corp</option>
              <option value="Globex Industries">
                Globex Industries
              </option>
              <option value="Initech">Initech</option>
              <option value="Hooli">Hooli</option>
            </select>
          </div>

          {/* Trading Partner ID */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Trading Partner ID{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={formData.tradingPartnerId || ""}
              readOnly
              className={`w-full px-3 py-2 border rounded text-sm bg-slate-50 ${
                isDuplicateId
                  ? "border-amber-500"
                  : "border-slate-300"
              }`}
            />

            {isDuplicateId && (
              <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Similar Trading Partner ID already exists.
                </p>
              </div>
            )}
          </div>

          {/* Merchant GS1 Prefix */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Merchant GS1 Prefix
            </label>

            <input
              type="text"
              value={formData.merchantGs1Prefix || ""}
              onChange={(e) =>
                updateFormData({
                  merchantGs1Prefix: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              placeholder="e.g., 1234567"
            />
          </div>

          {/* Merchant ISA */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Merchant ISA{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={formData.merchantIsa || ""}
              onChange={(e) =>
                updateFormData({
                  merchantIsa: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              placeholder="e.g., MERCHANTISA01"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
