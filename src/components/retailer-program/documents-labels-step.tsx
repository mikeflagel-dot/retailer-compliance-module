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

type PackingSlipConfig = {
  aggregationLevel?: AggregationLevel | "";
  copiesRequired?: number;
};

export function DocumentsLabelsStep({
  formData,
  updateFormData,
}: DocumentsLabelsStepProps) {
  const programType = formData.programType;

  const packingSlipConfigs: PackingSlipConfig[] =
    formData.packingSlipConfigurations || [];

  const setPackingSlipConfigs = (next: PackingSlipConfig[]) =>
    updateFormData({ packingSlipConfigurations: next });

  const allowedLevels: AggregationLevel[] =
    programType === "dropship"
      ? ["po", "carton"]
      : ["po", "carton", "pallet", "load"];

  return (
    <div className="space-y-6">
      {/* ============================= */}
      {/* Document Templates */}
      {/* ============================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">Document Templates</h2>
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
                updateFormData({ packingSlipName: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          {/* GS1 Labels */}
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
                    updateFormData({ gs1BoxLabelName: e.target.value })
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
                    updateFormData({ gs1PalletLabelName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </>
          )}

          {programType === "dropship" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                GS1 carton and pallet labels are typically not required for
                Dropship programs.
              </p>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.enableGs1LabelsForDropship || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateFormData({
                      enableGs1LabelsForDropship: checked,
                      ...(checked
                        ? {}
                        : { gs1BoxLabelName: "", gs1PalletLabelName: "" }),
                    });
                  }}
                />
                <span className="text-sm text-slate-700">
                  Enable GS1 Labels for Dropship (Advanced)
                </span>
              </label>

              {formData.enableGs1LabelsForDropship && (
                <>
                  <input
                    type="text"
                    value={formData.gs1BoxLabelName || ""}
                    onChange={(e) =>
                      updateFormData({ gs1BoxLabelName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={formData.gs1PalletLabelName || ""}
                    onChange={(e) =>
                      updateFormData({ gs1PalletLabelName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* ============================= */}
      {/* Shipping Label References */}
      {/* ============================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Shipping Label References
        </h2>
        <p className="text-sm text-slate-600 mb-2">
          Optionally configure reference fields that appear on shipping labels.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-xs text-amber-800 mb-5">
          ⚠️ Carrier reference fields may have strict character limits (often
          ~30 characters). Keep prefixes short.
        </div>

        <div className="space-y-6">
          {/* Reference 1 */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-slate-700">
                Shipping Label Reference 1
              </label>
              {!formData.enableShippingLabelRef1 && (
                <button
                  onClick={() =>
                    updateFormData({ enableShippingLabelRef1: true })
                  }
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Add Reference 1
                </button>
              )}
            </div>

            {formData.enableShippingLabelRef1 && (
              <div className="space-y-3">
                <input
                  value={formData.shippingLabelRef1Prefix || ""}
                  onChange={(e) =>
                    updateFormData({
                      shippingLabelRef1Prefix: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="Prefix"
                />

                <select
                  value={formData.shippingLabelRef1Value || ""}
                  onChange={(e) =>
                    updateFormData({
                      shippingLabelRef1Value: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">Select…</option>
                  <option value="purchaseOrderNumber">
                    Purchase Order Number
                  </option>
                  <option value="customerTicketNumber">
                    Customer Ticket Number
                  </option>
                </select>

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
                    Remove Reference 2 before removing Reference 1.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Reference 2 */}
          {formData.enableShippingLabelRef1 && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-slate-700">
                  Shipping Label Reference 2
                </label>
                {!formData.enableShippingLabelRef2 && (
                  <button
                    onClick={() =>
                      updateFormData({ enableShippingLabelRef2: true })
                    }
                    className="text-xs text-blue-600 hover:underline"
                  >
                    + Add Reference 2
                  </button>
                )}
              </div>

              {formData.enableShippingLabelRef2 && (
                <div className="space-y-3">
                  <input
                    value={formData.shippingLabelRef2Prefix || ""}
                    onChange={(e) =>
                      updateFormData({
                        shippingLabelRef2Prefix: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    placeholder="Prefix"
                  />

                  <select
                    value={formData.shippingLabelRef2Value || ""}
                    onChange={(e) =>
                      updateFormData({
                        shippingLabelRef2Value: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                  >
                    <option value="">Select…</option>
                    <option value="purchaseOrderNumber">
                      Purchase Order Number
                    </option>
                    <option value="customerTicketNumber">
                      Customer Ticket Number
                    </option>
                  </select>

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
      {/* ============================= */}
      {/* Packing Slip Copy Requirements */}
      {/* ============================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Packing Slip Copy Requirements
        </h2>

        <div className="space-y-3">
          {packingSlipConfigs.map((rule, index) => {
            const usedByOthers = packingSlipConfigs
              .map((c, i) => (i === index ? null : c.aggregationLevel))
              .filter(Boolean) as AggregationLevel[];

            return (
              <div
                key={index}
                className="grid grid-cols-3 gap-3 items-center bg-slate-50 border border-slate-200 rounded-lg p-3"
              >
                <select
                  value={rule.aggregationLevel ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const next = [...packingSlipConfigs];
                    next[index] = {
                      ...rule,
                      aggregationLevel:
                        value === "" ? "" : (value as AggregationLevel),
                    };
                    setPackingSlipConfigs(next);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">Select level…</option>
                  {allowedLevels.map((lvl) => (
                    <option
                      key={lvl}
                      value={lvl}
                      disabled={
                        usedByOthers.includes(lvl) &&
                        rule.aggregationLevel !== lvl
                      }
                    >
                      {LEVEL_LABELS[lvl]}
                    </option>
                  ))}
                </select>

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
                />

                <button
                  onClick={() => {
                    const next = [...packingSlipConfigs];
                    next.splice(index, 1);
                    setPackingSlipConfigs(next);
                  }}
                  className="text-xs text-slate-500 hover:underline text-right"
                >
                  Remove
                </button>
              </div>
            );
          })}

          <button
            onClick={() =>
              setPackingSlipConfigs([
                ...packingSlipConfigs,
                { aggregationLevel: "", copiesRequired: 1 },
              ])
            }
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Packing Slip Requirement
          </button>
        </div>
      </div>
    </div>
  );
}
