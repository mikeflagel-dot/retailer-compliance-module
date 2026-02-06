interface DocumentsLabelsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

type AggregationLevel = "po" | "carton" | "pallet" | "load";

const LEVEL_LABELS: Record<AggregationLevel, string> = {
  po: "Per Purchase Order (PO)",
  carton: "Per Carton",
  pallet: "Per Pallet",
  load: "Per Load / Shipment",
};

export function DocumentsLabelsStep({
  formData,
  updateFormData,
}: DocumentsLabelsStepProps) {
  const programType = formData.programType;

  const packingSlipConfigs =
    (formData.packingSlipConfigurations || []) as Array<{
      aggregationLevel?: AggregationLevel | "";
      copiesRequired?: number;
    }>;

  const setPackingSlipConfigs = (
    next: Array<{
      aggregationLevel?: AggregationLevel | "";
      copiesRequired?: number;
    }>,
  ) => updateFormData({ packingSlipConfigurations: next });

  const allowedLevels: AggregationLevel[] =
    programType === "dropship"
      ? ["po", "carton"]
      : ["po", "carton", "pallet", "load"];

  return (
    <div className="space-y-6">
      {/* ----------------------------- */}
      {/* Document Templates */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Document Templates
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Configure packing slip and label templates.
        </p>

        <div className="space-y-5">
          {/* Packing Slip */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Packing Slip Name
            </label>
            <input
              type="text"
              value={formData.packingSlipName || ""}
              onChange={(e) =>
                updateFormData({
                  packingSlipName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              placeholder="e.g., Standard Packing Slip"
            />
          </div>

          {/* ----------------------------- */}
          {/* GS1 Labels */}
          {/* ----------------------------- */}

          {/* B2B → Always Show */}
          {programType === "b2b" && (
            <>
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  GS1 Box Label Name
                </label>
                <input
                  type="text"
                  value={formData.gs1BoxLabelName || ""}
                  onChange={(e) =>
                    updateFormData({
                      gs1BoxLabelName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="e.g., GS1-128 Carton Label"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  GS1 Pallet Label Name
                </label>
                <input
                  type="text"
                  value={formData.gs1PalletLabelName || ""}
                  onChange={(e) =>
                    updateFormData({
                      gs1PalletLabelName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="e.g., GS1-128 SSCC Pallet Label"
                />
              </div>
            </>
          )}

          {/* Dropship → Hidden by Default, Override Allowed */}
          {programType === "dropship" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                GS1 carton and pallet labels are typically not
                required for Dropship programs.
              </p>

              {/* Advanced Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    formData.enableGs1LabelsForDropship || false
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;

                    updateFormData({
                      enableGs1LabelsForDropship: checked,
                      // ✅ Auto-wipe values when turned OFF
                      ...(checked
                        ? {}
                        : {
                            gs1BoxLabelName: "",
                            gs1PalletLabelName: "",
                          }),
                    });
                  }}
                />
                <label className="text-sm text-slate-700">
                  Enable GS1 Labels for Dropship (Advanced)
                </label>
              </div>

              {/* Show Fields Only If Enabled */}
              {formData.enableGs1LabelsForDropship && (
                <>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      GS1 Box Label Name
                    </label>
                    <input
                      type="text"
                      value={formData.gs1BoxLabelName || ""}
                      onChange={(e) =>
                        updateFormData({
                          gs1BoxLabelName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      GS1 Pallet Label Name
                    </label>
                    <input
                      type="text"
                      value={formData.gs1PalletLabelName || ""}
                      onChange={(e) =>
                        updateFormData({
                          gs1PalletLabelName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Shipping Label References */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Shipping Label References
        </h2>
        <p className="text-sm text-slate-600 mb-2">
          Optionally configure reference fields that appear on
          shipping labels.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-xs text-amber-800 mb-5">
          ⚠️ Carrier reference fields may have strict character
          limits. For example, FedEx Reference Numbers are
          typically limited to <b>30 characters</b>. Keep
          prefixes short to avoid label generation issues.
        </div>

        <div className="space-y-6">
          {/* Reference 1 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-slate-700">
                Shipping Label Reference 1{" "}
                <span className="text-slate-400">
                  (Optional)
                </span>
              </label>

              {!formData.enableShippingLabelRef1 && (
                <button
                  type="button"
                  onClick={() =>
                    updateFormData({
                      enableShippingLabelRef1: true,
                    })
                  }
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Add Reference 1
                </button>
              )}
            </div>

            {formData.enableShippingLabelRef1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={
                      formData.shippingLabelRef1Prefix || ""
                    }
                    onChange={(e) =>
                      updateFormData({
                        shippingLabelRef1Prefix: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    placeholder="Prefix (e.g., PO#)"
                  />

                  <select
                    value={
                      formData.shippingLabelRef1Value || ""
                    }
                    onChange={(e) => {
                      const newValue = e.target.value;

                      // Conflict: Ref2 cannot match Ref1
                      const ref2Conflicts =
                        formData.enableShippingLabelRef2 &&
                        formData.shippingLabelRef2Value ===
                          newValue;

                      updateFormData({
                        shippingLabelRef1Value: newValue,
                        ...(ref2Conflicts
                          ? {
                              enableShippingLabelRef2: false,
                              shippingLabelRef2Prefix: "",
                              shippingLabelRef2Value: "",
                            }
                          : {}),
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="customerTicketNumber">
                      Customer Ticket Number
                    </option>
                    <option value="purchaseOrderNumber">
                      Purchase Order Number
                    </option>
                  </select>
                </div>

                {/* Remove Ref1 only if Ref2 is NOT enabled */}
                {!formData.enableShippingLabelRef2 ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateFormData({
                        enableShippingLabelRef1: false,
                        shippingLabelRef1Prefix: "",
                        shippingLabelRef1Value: "",
                      })
                    }
                    className="text-xs text-slate-500 hover:underline"
                  >
                    Remove Reference 1
                  </button>
                ) : (
                  <p className="text-xs text-slate-400">
                    Remove Reference 2 before removing Reference
                    1.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Reference 2 */}
          {formData.enableShippingLabelRef1 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-700">
                  Shipping Label Reference 2{" "}
                  <span className="text-slate-400">
                    (Optional)
                  </span>
                </label>

                {!formData.enableShippingLabelRef2 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateFormData({
                        enableShippingLabelRef2: true,
                      })
                    }
                    className="text-xs text-blue-600 hover:underline"
                  >
                    + Add Reference 2
                  </button>
                )}
              </div>

              {formData.enableShippingLabelRef2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={
                        formData.shippingLabelRef2Prefix || ""
                      }
                      onChange={(e) =>
                        updateFormData({
                          shippingLabelRef2Prefix:
                            e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                      placeholder="Prefix (e.g., Ticket#)"
                    />

                    <select
                      value={
                        formData.shippingLabelRef2Value || ""
                      }
                      onChange={(e) =>
                        updateFormData({
                          shippingLabelRef2Value:
                            e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                    >
                      <option value="">Select...</option>

                      {formData.shippingLabelRef1Value !==
                        "customerTicketNumber" && (
                        <option value="customerTicketNumber">
                          Customer Ticket Number
                        </option>
                      )}

                      {formData.shippingLabelRef1Value !==
                        "purchaseOrderNumber" && (
                        <option value="purchaseOrderNumber">
                          Purchase Order Number
                        </option>
                      )}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateFormData({
                        enableShippingLabelRef2: false,
                        shippingLabelRef2Prefix: "",
                        shippingLabelRef2Value: "",
                      })
                    }
                    className="text-xs text-slate-500 hover:underline"
                  >
                    Remove Reference 2
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Packing Slip Copy Requirements */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Packing Slip Copy Requirements
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Specify how many packing slip copies must be printed
          at each aggregation level.
        </p>

        {/* Table Header */}
        <div className="grid grid-cols-3 gap-3 text-xs font-medium text-slate-500 mb-2 px-1">
          <div>Aggregation Level</div>
          <div>Copies Required</div>
          <div className="text-right">Action</div>
        </div>

        <div className="space-y-3">
          {packingSlipConfigs.map((rule, index) => {
            // levels used by other rows (to prevent duplicates)
            const usedByOthers = packingSlipConfigs
              .map((c, i) =>
                i === index ? null : c.aggregationLevel,
              )
              .filter(Boolean) as string[];

            return (
              <div
                key={index}
                className="grid grid-cols-3 gap-3 items-center bg-slate-50 border border-slate-200 rounded-lg p-3"
              >
                {/* Aggregation Level */}
                <select
                  value={rule.aggregationLevel || ""}
                  onChange={(e) => {
                    const next = [...packingSlipConfigs];
                    next[index] = {
                      ...rule,
                      aggregationLevel: e.target.value as any,
                    };
                    setPackingSlipConfigs(next);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">Select level...</option>

                  {allowedLevels.map((lvl) => {
                    const disabled =
                      usedByOthers.includes(lvl) &&
                      rule.aggregationLevel !== lvl;

                    return (
                      <option
                        key={lvl}
                        value={lvl}
                        disabled={disabled}
                      >
                        {LEVEL_LABELS[lvl]}
                        {disabled ? " (Already Used)" : ""}
                      </option>
                    );
                  })}
                </select>

                {/* Copies Required */}
                <input
                  type="number"
                  min={1}
                  value={rule.copiesRequired ?? 1}
                  onChange={(e) => {
                    const next = [...packingSlipConfigs];
                    next[index] = {
                      ...rule,
                      copiesRequired: Number(e.target.value),
                    };
                    setPackingSlipConfigs(next);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="e.g., 2"
                />

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => {
                    const next = [...packingSlipConfigs];
                    next.splice(index, 1);
                    setPackingSlipConfigs(next);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline text-right"
                >
                  Remove
                </button>
              </div>
            );
          })}

          {/* Add Requirement */}
          <button
            type="button"
            onClick={() => {
              const next = [
                ...packingSlipConfigs,
                { aggregationLevel: "", copiesRequired: 1 },
              ];
              setPackingSlipConfigs(next);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Packing Slip Requirement
          </button>

          {programType === "dropship" && (
            <p className="text-xs text-slate-500">
              Pallet and Load-level options are hidden for
              Dropship programs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}