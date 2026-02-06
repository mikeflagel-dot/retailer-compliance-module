interface OverviewStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function OverviewStep({
  formData,
  updateFormData,
}: OverviewStepProps) {
  /** -----------------------------
   * Handle Program Type Change
   * Clears irrelevant fields automatically
   * ------------------------------ */
  const handleProgramTypeChange = (newType: string) => {
    // Always update programType first
    const updates: any = {
      programType: newType,
    };

    // If switching to Dropship...
    if (newType === "dropship") {
      // If override is NOT enabled, clear GS1 label fields
      updates.enableGs1LabelsForDropship = false;
      updates.gs1BoxLabelName = "";
      updates.gs1PalletLabelName = "";
    }

    updateFormData(updates);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-lg text-slate-900 mb-1">Program Overview</h2>
        <p className="text-sm text-slate-600">
          Define the retailer program identity details.
        </p>
      </div>

      {/* Retailer Name */}
      <div>
        <label className="block text-sm text-slate-700 mb-2">
          Retailer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.retailerName || ""}
          onChange={(e) =>
            updateFormData({
              retailerName: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          placeholder="e.g., Target"
        />
      </div>

      {/* Program Type */}
      <div>
        <label className="block text-sm text-slate-700 mb-2">
          Program Type <span className="text-red-500">*</span>
        </label>

        <select
          value={formData.programType || ""}
          onChange={(e) => handleProgramTypeChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
        >
          <option value="">Select program type...</option>
          <option value="b2b">B2B (Retail Distribution)</option>
          <option value="dropship">Dropship (DTC Parcel Orders)</option>
        </select>

        <p className="text-xs text-slate-500 mt-2">
          Program Type determines which packing and labeling rules apply.
        </p>
      </div>

      {/* Program Name */}
      <div>
        <label className="block text-sm text-slate-700 mb-2">
          Program Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.programName || ""}
          onChange={(e) =>
            updateFormData({
              programName: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          placeholder="e.g., Target B2B"
        />
      </div>

      {/* Program Code */}
      <div>
        <label className="block text-sm text-slate-700 mb-2">
          Program Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.programCode || ""}
          onChange={(e) =>
            updateFormData({
              programCode: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          placeholder="e.g., TGTB2B"
        />
      </div>
    </div>
  );
}
